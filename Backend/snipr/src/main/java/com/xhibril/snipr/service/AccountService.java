package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.account.UpdateUsernameRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
}
