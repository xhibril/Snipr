package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.auth.LoginResponse;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.sql.ast.tree.predicate.BooleanExpressionPredicate;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final EmailService emailService;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo,
                       JwtService jwtService,
                       EmailService emailService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    enum TIME{
        TWO_HOURS(7200),
        WEEK(604800);

        TIME(int seconds){
            this.seconds = seconds;
        }

        private final int seconds;

        public int getSeconds(){
            return seconds;
        }
    }



    public ResponseEntity<ApiResponse> registerUser(String email, String password) {
        // check if email is already registered
        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty()) {

            User user = new User();

            user.setEmail(email);
            user.setPassword(password);
            user.setIsVerified(false);

            userRepo.save(user);
            emailService.sendVerificationEmail(email);

            return ResponseEntity.ok().body(new ApiResponse("Successfully registered"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Account already exists"));
        }
    }

    @Transactional
    public boolean verifyUser(String token) {
        String email = jwtService.extractFromToken(token, "email", String.class);
        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {
            userRepo.verifyUser(email);
            return true;
        }
        return false;
    }


    public ResponseEntity<ApiResponse> resendVerificationEmail(String email) {
        Optional<Boolean> isVerifiedOpt = userRepo.isVerified(email);

        if (isVerifiedOpt.isPresent()) {
            if (!isVerifiedOpt.get()) {
                return emailService.sendVerificationEmail(email);
            }
        }
        return ResponseEntity.ok().body(new ApiResponse("If an account with this email exists, a verification email has been sent."));
    }


    public ResponseEntity<LoginResponse> login(String email, String password, Boolean rememberMe, HttpServletResponse res){
        Optional<User> userOpt = userRepo.findByEmail(email);

        if(userOpt.isPresent()){
            User user = userOpt.get();

            if(email.equals(user.getEmail()) && password.equals(user.getPassword())){

                if(!user.getIsVerified()){
                    emailService.sendVerificationEmail(email);
                    return ResponseEntity.status(403).body(new LoginResponse("Not verified", false));
                }

                Map<String, Object> claims = new HashMap<>();
                claims.put("id", user.getId());

                int time;

                if(rememberMe == null){
                    time = TIME.TWO_HOURS.getSeconds();
                } else {
                    time = rememberMe ? TIME.WEEK.getSeconds() : TIME.TWO_HOURS.getSeconds();
                }

                String token = jwtService.generateToken("authToken", claims, time);
                jwtService.saveToken("authToken", token, "/", time, res);

                return ResponseEntity.ok().body(new LoginResponse("Successfully logged in", true));
            }
        }

        return ResponseEntity.badRequest().body(new LoginResponse("Invalid credentials", false));
    }



    public Long getAuthenticatedId(HttpServletRequest req){
        String token = jwtService.extractFromCookie("authToken", req);
        return jwtService.extractFromToken(token, "id", Long.class);
    }

    public Boolean isAuthenticated(HttpServletRequest req){
        Long id = getAuthenticatedId(req);
        System.out.println(id != null);
        return id != null;
    }




}
