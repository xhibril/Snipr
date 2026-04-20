package com.xhibril.snipr.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.persister.collection.mutation.CollectionOperationCoordinator;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    public String generateToken(String subject, Map<String, Object> claims, int time){
        String secret = System.getenv("JWT_SECRET");

        if(secret == null){
            throw new IllegalStateException("Jwt secret not found");
        }

        Instant now = Instant.now();
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        JwtBuilder builder = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(time)));

        if(claims != null){
            builder.addClaims(claims);
        }

        return builder.signWith(key).compact();
    }


    public void saveToken(String tokenName, String token, String path, int time, HttpServletResponse res){
        Cookie cookie = new Cookie(tokenName, token);
        cookie.setPath(path);
        //cookie.setSecure(true);
        //cookie.setHttpOnly(true);
        cookie.setMaxAge(time);
        res.addCookie(cookie);
    }


    public String extractFromCookie(String tokenName, HttpServletRequest req){
        Cookie[] cookies = req.getCookies();

        if(cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(tokenName)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }


    public <T> T extractFromToken(String token, String claimName, Class<T> type){
        String secretKey = System.getenv("JWT_SECRET");

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get(claimName, type);
        } catch (Exception e) {
            return null;
        }
    }
}
