package com.xhibril.snipr.controller;

import com.xhibril.snipr.dto.auth.PasswordResetRequest;
import com.xhibril.snipr.dto.auth.PasswordResetResponse;
import com.xhibril.snipr.service.AuthService;
import com.xhibril.snipr.service.PasswordResetService;
import jakarta.annotation.security.RunAs;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PasswordResetController {


    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public PasswordResetController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/password/reset/init")
    public ResponseEntity<PasswordResetResponse> initResetRequest(@RequestBody PasswordResetRequest request){
        return passwordResetService.initPasswordReset(request.getEmail());
    }

    @PostMapping("/password/reset/verify")
    public ResponseEntity<PasswordResetResponse> verifyResetRequest(@RequestBody PasswordResetRequest request){
        return passwordResetService.verifyRequest(request.getEmail(), request.getCode());
    }

    @PostMapping("/password/reset/complete")
    public ResponseEntity<PasswordResetResponse> resetPassword(@RequestBody PasswordResetRequest request){
        return passwordResetService.resetPassword(request.getEmail(), request.getNewPassword(), request.getConfirmPassword(), request.getResetToken());
    }



}
