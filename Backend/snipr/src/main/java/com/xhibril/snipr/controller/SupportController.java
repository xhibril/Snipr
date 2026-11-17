package com.xhibril.snipr.controller;
import com.xhibril.snipr.dto.SupportRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.service.SupportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService){
        this.supportService = supportService;
    }

    @PostMapping("/support")
    public ResponseEntity<ApiResponse> submitTicket(@Valid @RequestBody SupportRequest request){
        return supportService.submitTicket(request);
    }


}
