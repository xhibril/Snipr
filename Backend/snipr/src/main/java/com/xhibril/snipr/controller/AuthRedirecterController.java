package com.xhibril.snipr.controller;

import com.xhibril.snipr.service.AuthService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api")
public class AuthRedirecterController {

    private final AuthService authService;

    public AuthRedirecterController(AuthService authService) {
        this.authService = authService;
    }
    @GetMapping("/email/verify/{token}")
    public String verifyUser(@PathVariable String token){
        if(authService.verifyUser(token)){
            return "redirect:http://localhost:5173/login?verified=true";

        } return "redirect:http://localhost:5173/login?verified=false";
    }
}
