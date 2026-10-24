package com.xhibril.snipr.configs;

import com.xhibril.snipr.service.AuthService;
import com.xhibril.snipr.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthFilter extends OncePerRequestFilter {

    private final AuthService authService;

    public AuthFilter(AuthService authService){
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {


        String path = req.getRequestURI();


        if(!path.startsWith("/api")){
            chain.doFilter(req, res);
            return;
        }

        if(path.startsWith("/api/login") ||
                path.startsWith("/api/signup") ||
                path.startsWith("/api/account/status") ||
                path.startsWith("/api/email/resend") ||
                path.startsWith("/api/email/verify") ||
                path.startsWith("/api/password/reset")
        ) {
            chain.doFilter(req, res);
            return;
        }


        Long id = authService.getAuthenticatedId(req);


        if(id == null){
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(req, res);
    }





}
