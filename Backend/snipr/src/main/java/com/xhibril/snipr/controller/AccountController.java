package com.xhibril.snipr.controller;

import com.xhibril.snipr.dto.account.UpdatePasswordRequest;
import com.xhibril.snipr.dto.account.UpdateUsernameRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.service.AccountService;
import com.xhibril.snipr.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AccountController {


    private final AuthService authService;
    private final AccountService accountService;

    public AccountController(AuthService authService,
                             AccountService accountService){
        this.authService = authService;
        this.accountService = accountService;
    }

    @PatchMapping("/account/profile")
    public ResponseEntity<ApiResponse> updateUsername(HttpServletRequest req, @RequestBody UpdateUsernameRequest request){
        Long userId = authService.getAuthenticatedId(req);

        return accountService.updateUsername(userId, request);

    }

    @PatchMapping("/account/password")
    public ResponseEntity<ApiResponse> updatePassword(HttpServletRequest req,
                                                      @RequestBody UpdatePasswordRequest request){

        Long userId = authService.getAuthenticatedId(req);

        return accountService.updatePassword(userId, request);
    }







}
