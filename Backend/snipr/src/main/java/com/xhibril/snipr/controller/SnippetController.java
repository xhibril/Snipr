package com.xhibril.snipr.controller;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.*;
import com.xhibril.snipr.service.AuthService;
import com.xhibril.snipr.service.CommonService;
import com.xhibril.snipr.service.ItemView;
import com.xhibril.snipr.service.SnippetService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SnippetController {

    private final SnippetService snippetService;
    private final AuthService authService;
    private final CommonService commonService;

    public SnippetController(SnippetService snippetService, AuthService authService,
                             CommonService commonService) {
        this.snippetService = snippetService;
        this.authService = authService;
        this.commonService = commonService;
    }


    @PostMapping("/snippets")
    public ResponseEntity<SnippetResponse> addSnippet(
            @RequestBody SnippetRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.addSnippet(userId, request);
    }

    @PatchMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> moveSnippet(
            @PathVariable Long snippetId,
            @RequestBody SnippetRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.moveSnippet(userId, snippetId, request);
    }

    @PatchMapping("/snippets/{snippetId}/pin")
    public ResponseEntity<ApiResponse> pinSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.updateSnippetPinStatus(userId, snippetId);
    }


    @DeleteMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> deleteSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.deleteSnippet(userId, snippetId);
    }

    @DeleteMapping("/snippets/{snippetId}/permanent")
    public ResponseEntity<ApiResponse> permanentlyDeleteSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.permanentlyDeleteSnippet(userId, snippetId);
    }


    @GetMapping("/snippets")
    public List<SnippetResponse> getSnippets(
            @RequestParam(defaultValue = "ALL") ItemView view,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.getSnippets(userId, view);
    }

    @PatchMapping("/snippets")
    public ResponseEntity<SnippetResponse> updateSnippet(
            @RequestBody SnippetRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.updateSnippet(userId, request);
    }

    @PatchMapping("/snippets/{snippetId}/recover")
    public ResponseEntity<ApiResponse> recoverSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.recoverSnippet(userId, snippetId);
    }


    @PatchMapping("/snippets/{snippetId}/rename")
    public ResponseEntity<ApiResponse> renameSnippet(
            @PathVariable Long snippetId,
            @RequestBody SnippetRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.renameSnippet(userId, snippetId, request);
    }


    @PostMapping("/snippets/{snippetId}/copy")
    public ResponseEntity<SnippetResponse> copySnippet(
            @PathVariable Long snippetId,
            @RequestBody SnippetRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.copySnippet(
                userId,
                snippetId,
                request
        );
    }

    @DeleteMapping("/bin")
    public ResponseEntity<ApiResponse> emptyRecycleBin(HttpServletRequest req) {
        Long userId = authService.getAuthenticatedId(req);
        return commonService.emptyRecycleBin(userId);
    }
}