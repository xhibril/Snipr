package com.xhibril.snipr.controller;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.auth.LoginRequest;
import com.xhibril.snipr.dto.auth.LoginResponse;
import com.xhibril.snipr.dto.auth.SignUpRequest;
import com.xhibril.snipr.dto.snippet.AuthStatusResponse;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.service.AccountService;
import com.xhibril.snipr.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.juli.logging.Log;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;
    private final AccountService accountService;

    public AuthController(AuthService authService,  AccountService accountService){
        this.authService = authService;
        this.accountService = accountService;
    }


    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody SignUpRequest request){
        return authService.registerUser(request);
    }

    @PostMapping("/email/resend")
    public ResponseEntity<ApiResponse> resendVerificationEmail(@RequestBody User user){
        return authService.resendVerificationEmail(user.getEmail());
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpServletResponse res){
        return authService.login(request, res);
    }


    @PostMapping("/auth/status")
    public AuthStatusResponse isAuthenticated(HttpServletRequest req){
        return authService.isAuthenticated(req);
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse res){
        return accountService.logout(res);
    }
}
