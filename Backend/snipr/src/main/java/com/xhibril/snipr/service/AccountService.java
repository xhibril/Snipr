package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.account.UpdatePasswordRequest;
import com.xhibril.snipr.dto.account.UpdateUsernameRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {


    private final UserRepository userRepo;

    public AccountService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }


    public ResponseEntity<Void> logout(HttpServletResponse res) {
        Cookie cookie = new Cookie("authToken", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        res.addCookie(cookie);
        return ResponseEntity.ok().build();
    }


    public ResponseEntity<ApiResponse> updateUsername(Long userId,
                                                      UpdateUsernameRequest request) {

        Optional<User> userOpt = userRepo.findById(userId);

        System.out.println("SAVED PASSWORD: " + userOpt.get().getPassword());

        System.out.println("SENT PASSWORD: " + request.getPassword());



        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Incorrect password"));
        }

        user.setUsername(request.getUsername());

        userRepo.save(user);

        return ResponseEntity.ok().body(new ApiResponse("Username successfully updated"));
    }


    public ResponseEntity<ApiResponse> updatePassword(Long userId, UpdatePasswordRequest request){

        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Account not found"));
        }

        User user = userOpt.get();


        if(!user.getPassword().equals(request.getOldPassword())){
            return ResponseEntity.badRequest().body(new ApiResponse("Incorrect password"));
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())){
            return ResponseEntity.badRequest().body(new ApiResponse("Passwords do not match"));
        }


        if(request.getNewPassword().equals(user.getPassword())){
            return ResponseEntity.badRequest().body(new ApiResponse("Password cannot be same as old"));
        }



        user.setPassword(request.getNewPassword());
        userRepo.save(user);

        return ResponseEntity.ok().body(new ApiResponse("Password successfully changed"));








    }
}
