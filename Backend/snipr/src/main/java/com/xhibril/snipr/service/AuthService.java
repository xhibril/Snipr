package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.auth.ResendVerificationEmailRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.auth.LoginRequest;
import com.xhibril.snipr.dto.auth.LoginResponse;
import com.xhibril.snipr.dto.auth.SignUpRequest;
import com.xhibril.snipr.dto.snippet.AuthStatusResponse;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
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



    public ResponseEntity<ApiResponse> registerUser(SignUpRequest request) {
        // check if email is already registered
        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {

            User user = new User();

            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setUsername(request.getUsername());
            user.setIsVerified(false);


            userRepo.save(user);
            emailService.sendVerificationEmail(request.getEmail());

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


    public ResponseEntity<ApiResponse> resendVerificationEmail(
            ResendVerificationEmailRequest request) {
        Optional<Boolean> isVerifiedOpt = userRepo.isVerified(request.getEmail());

        if (isVerifiedOpt.isPresent()) {
            if (!isVerifiedOpt.get()) {
                return emailService.sendVerificationEmail(request.getEmail());
            }
        }
        return ResponseEntity.ok().body(new ApiResponse("If an account with this email exists, a verification email has been sent."));
    }


    public ResponseEntity<LoginResponse> login(LoginRequest request, HttpServletResponse res){
        Optional<User> userOpt = userRepo.findByEmail(request.getEmail());

        if(userOpt.isPresent()){
            User user = userOpt.get();

            if(request.getEmail().equals(user.getEmail()) && request.getPassword().equals(user.getPassword())){

                if(!user.getIsVerified()){
                    emailService.sendVerificationEmail(request.getEmail());
                    return ResponseEntity.status(403).body(new LoginResponse("Not verified", false));
                }

                Map<String, Object> claims = new HashMap<>();
                claims.put("id", user.getId());

                int time;

                if(!request.getRememberMe()){
                    time = TIME.TWO_HOURS.getSeconds();
                } else {
                    time = request.getRememberMe() ? TIME.WEEK.getSeconds() : TIME.TWO_HOURS.getSeconds();
                }

                String token = jwtService.generateToken("authToken", claims, time);
                jwtService.saveToken("authToken", token, "/", time, res);


                LoginResponse loginResponse = new LoginResponse();
                User userResponse = new User();
                userResponse.setUsername(user.getUsername());
                userResponse.setEmail(user.getEmail());

                loginResponse.setIsTrusted(true);
                loginResponse.setMessage("Successfully logged in");
                loginResponse.setUser(userResponse);

                return ResponseEntity.ok().body(loginResponse);
            }
        }

        return ResponseEntity.badRequest().body(new LoginResponse("Invalid credentials", false));
    }



    public Long getAuthenticatedId(HttpServletRequest req){
        String token = jwtService.extractFromCookie("authToken", req);
        return jwtService.extractFromToken(token, "id", Long.class);
    }

    public AuthStatusResponse isAuthenticated(HttpServletRequest req){
        Long id = getAuthenticatedId(req);

        if(id == null){
            return new AuthStatusResponse(false, null);
        }

        Optional<User> userOpt = userRepo.findById(id);

        if(userOpt.isEmpty()){
            return new AuthStatusResponse(false, null);
        }

        User user = userOpt.get();

        User userResponse = new User();

        userResponse.setEmail(user.getEmail());
        userResponse.setUsername(user.getUsername());

        return new AuthStatusResponse(true, userResponse);
    }




}
