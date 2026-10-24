package com.xhibril.snipr.controller;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.*;
import com.xhibril.snipr.service.AuthService;
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

    public SnippetController(SnippetService snippetService, AuthService authService) {
        this.snippetService = snippetService;
        this.authService = authService;
    }

    @PostMapping("/folders")
    public ResponseEntity<FolderResponse> addFolder(
            @RequestBody FolderRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.addFolder(userId, request.getName());
    }

    @PostMapping("/snippets")
    public ResponseEntity<SnippetResponse> addSnippet(
            @RequestBody SnippetRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.addSnippet(userId, request.getName(), request.getFolderId());
    }

    @PatchMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> moveSnippet(
            @PathVariable Long snippetId,
            @RequestBody UpdateSnipperRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.moveSnippet(userId, snippetId, request.getFolderId());
    }

    @PatchMapping("/snippets/{snippetId}/pin")
    public ResponseEntity<ApiResponse> pinSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.updateSnippetPinStatus(userId, snippetId);
    }

    @PatchMapping("/folders/{folderId}/pin")
    public ResponseEntity<ApiResponse> pinFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.updateFolderPinStatus(userId, folderId);
    }

    @DeleteMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> deleteSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.deleteSnippet(userId, snippetId);
    }

    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<ApiResponse> deleteFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.deleteFolder(userId, folderId);
    }

    @DeleteMapping("/snippets/{snippetId}/permanent")
    public ResponseEntity<ApiResponse> permanentlyDeleteSnippet(
            @PathVariable Long snippetId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.permanentlyDeleteSnippet(userId, snippetId);
    }

    @DeleteMapping("/folders/{folderId}/permanent")
    public ResponseEntity<ApiResponse> permanentlyDeleteFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.permanentlyDeleteFolder(userId, folderId);
    }

    @GetMapping("/folders")
    public List<FolderResponse> getFolders(
            @RequestParam(defaultValue = "ALL") SnippetService.ItemView view,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.getFolders(userId, view);
    }

    @GetMapping("/snippets")
    public List<SnippetResponse> getSnippets(
            @RequestParam(defaultValue = "ALL") SnippetService.ItemView view,
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

    @PatchMapping("/folders/{folderId}/recover")
    public ResponseEntity<ApiResponse> recoverFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.recoverFolder(userId, folderId);
    }

    @PatchMapping("/snippets/{snippetId}/rename")
    public ResponseEntity<ApiResponse> renameSnippet(
            @PathVariable Long snippetId,
            @RequestBody SnippetRequest snippetRequest,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.renameSnippet(userId, snippetId, snippetRequest.getName());
    }

    @PatchMapping("/folders/{folderId}/rename")
    public ResponseEntity<ApiResponse> renameFolder(
            @PathVariable Long folderId,
            @RequestBody FolderRequest folderRequest,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.renameFolder(userId, folderId, folderRequest.getName());
    }

    @DeleteMapping("/bin")
    public ResponseEntity<ApiResponse> emptyRecycleBin(HttpServletRequest req) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.emptyRecycleBin(userId);
    }

    @PostMapping("/folders/{folderId}/copy")
    public ResponseEntity<FolderCopyResponse> copyFolder(
            @PathVariable Long folderId,
            @RequestBody FolderRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return snippetService.copyFolder(userId, folderId, request.getName());
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
                request.getFolderId(),
                request.getName()
        );
    }
}