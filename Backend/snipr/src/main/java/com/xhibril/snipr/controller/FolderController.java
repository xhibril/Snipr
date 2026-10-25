package com.xhibril.snipr.controller;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.FolderCopyResponse;
import com.xhibril.snipr.dto.snippet.FolderRequest;
import com.xhibril.snipr.dto.snippet.FolderResponse;
import com.xhibril.snipr.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FolderController {

    private final AuthService authService;
    private final FolderService folderService;

    public FolderController(AuthService authService, FolderService folderService){
        this.authService = authService;
        this.folderService = folderService;
    }

    @PostMapping("/folders")
    public ResponseEntity<FolderResponse> addFolder(
            @RequestBody FolderRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.addFolder(userId, request);
    }

    @PatchMapping("/folders/{folderId}/pin")
    public ResponseEntity<ApiResponse> pinFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.updateFolderPinStatus(userId, folderId);
    }


    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<ApiResponse> deleteFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.deleteFolder(userId, folderId);
    }

    @DeleteMapping("/folders/{folderId}/permanent")
    public ResponseEntity<ApiResponse> permanentlyDeleteFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.permanentlyDeleteFolder(userId, folderId);
    }



    @GetMapping("/folders")
    public List<FolderResponse> getFolders(
            @RequestParam(defaultValue = "ALL") ItemView view,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.getFolders(userId, view);
    }

    @PatchMapping("/folders/{folderId}/recover")
    public ResponseEntity<ApiResponse> recoverFolder(
            @PathVariable Long folderId,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.recoverFolder(userId, folderId);
    }


    @PatchMapping("/folders/{folderId}/rename")
    public ResponseEntity<ApiResponse> renameFolder(
            @PathVariable Long folderId,
            @RequestBody FolderRequest request,
            HttpServletRequest req

    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.renameFolder(userId, folderId, request);
    }


    @PostMapping("/folders/{folderId}/copy")
    public ResponseEntity<FolderCopyResponse> copyFolder(
            @PathVariable Long folderId,
            @RequestBody FolderRequest request,
            HttpServletRequest req
    ) {
        Long userId = authService.getAuthenticatedId(req);
        return folderService.copyFolder(userId, folderId, request);
    }

}
