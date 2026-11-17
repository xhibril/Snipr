package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.SupportRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class SupportService {

    private final EmailService emailService;

    public SupportService(EmailService emailService){
        this.emailService = emailService;
    }

    public ResponseEntity<ApiResponse> submitTicket(SupportRequest request) {


        String html = """
                <p>Name: %s</p>
                <p>Email: %s</p>
                <p>Subject: %s</p>
                <p>Message: %s</p>
                
                """.formatted(request.getName(),
                request.getEmail(), request.getSubject(),
                request.getMessage());


        // prototype email
        String email = emailService.createBody(html, "xhibril.dev@gmail.com");

        emailService.sendEmail(email);

        return ResponseEntity.ok().body(new ApiResponse("Message successfully sent"));

    }
}
