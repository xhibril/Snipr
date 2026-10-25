package com.xhibril.snipr.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    public ResponseEntity<Void> logout(HttpServletResponse res){
        Cookie cookie = new Cookie("authToken", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        res.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
}
