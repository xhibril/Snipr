package com.xhibril.snipr.service;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepo;

    public AuthService(UserRepository userRepo){
        this.userRepo = userRepo;
    }


    public ResponseEntity<ApiResponse> registerUser(String email, String password){
        // check if email is already registered
        Optional<User> userOpt = userRepo.findByEmail(email);

        if(userOpt.isEmpty()){

            User user = new User();

            user.setEmail(email);
            user.setPassword(password);
            user.setIsVerified(false);

            userRepo.save(user);

            return ResponseEntity.ok().body(new ApiResponse("Successfully registered"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Account already exists"));
        }
    }






}
