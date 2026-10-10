package com.xhibril.snipr.controller;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.*;
import com.xhibril.snipr.service.SnippetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SnippetController {

    private final SnippetService snippetService;

    public SnippetController(SnippetService snippetService) {
        this.snippetService = snippetService;
    }

    @PostMapping("/folders")
    public ResponseEntity<FolderResponse> addFolder(@RequestBody FolderRequest request) {
        Long userId = 1L; // placeholder

        return snippetService.addFolder(userId, request.getName());
    }


    @PostMapping("/snippets")
    public ResponseEntity<SnippetResponse> addSnippet(@RequestBody SnippetRequest request) {
        Long userId = 1L; // placeholder

        return snippetService.addSnippet(userId, request.getName(), request.getFolderId());
    }


    @PatchMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> moveSnippet(@PathVariable Long snippetId, @RequestBody UpdateSnipperRequest request) {
        Long userId = 1L; // placeholder

        return snippetService.moveSnippet(userId, snippetId, request.getFolderId());
    }

    @PatchMapping("/snippets/{snippetId}/pin")
    public ResponseEntity<ApiResponse> pinSnippet(@PathVariable Long snippetId) {
        Long userId = 1L; // placeholder

        return snippetService.updateSnippetPinStatus(userId, snippetId);
    }

    @PatchMapping("/folders/{folderId}/pin")
    public ResponseEntity<ApiResponse> pinFolder(@PathVariable Long folderId) {
        Long userId = 1L;

        return snippetService.updateFolderPinStatus(userId, folderId);
    }

    @DeleteMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> deleteSnippet(@PathVariable Long snippetId) {
        Long userId = 1L; // place holder;
        return snippetService.deleteSnippet(userId, snippetId);
    }


    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<ApiResponse> deleteFolder(@PathVariable Long folderId) {
        Long userId = 1L;

        return snippetService.deleteFolder(userId, folderId);
    }


    @DeleteMapping("/snippets/{snippetId}/permanent")
    public ResponseEntity<ApiResponse> permanentlyDeleteSnippet(@PathVariable Long snippetId) {
        Long userId = 1L;

        return snippetService.permanentlyDeleteSnippet(userId, snippetId);
    }

    @DeleteMapping("/folders/{folderId}/permanent")
    public ResponseEntity<ApiResponse> permanentlyDeleteFolder(@PathVariable Long folderId) {
        Long userId = 1L;

        return snippetService.permanentlyDeleteFolder(userId, folderId);
    }


    @GetMapping("/folders")
    public List<FolderResponse> getFolders(
            @RequestParam(required = false) Boolean shared,
            @RequestParam(required = false) Boolean starred,
            @RequestParam(required = false) Boolean deleted
    ) {
        Long userId = 1L; // place holder;

        return snippetService.getFolders(userId, shared, starred, deleted);
    }

    @GetMapping("/snippets")
    public List<SnippetResponse> getSnippets(
            @RequestParam(required = false) Boolean shared,
            @RequestParam(required = false) Boolean starred,
            @RequestParam(required = false) Boolean deleted
    ) {
        Long userId = 1L; // place holder;

        return snippetService.getSnippets(userId, shared, starred, deleted);
    }


    @PatchMapping("/snippets")
    public ResponseEntity<SnippetResponse> updateSnippet(@RequestBody SnippetRequest request) {
        Long userId = 1L;
        return snippetService.updateSnippet(userId, request);
    }


    @PatchMapping("/snippets/{snippetId}/recover")
    public ResponseEntity<ApiResponse> recoverSnippet(@PathVariable Long snippetId){
        Long userId = 1L;

        return snippetService.recoverSnippet(userId, snippetId);
    }

    @PatchMapping("/folders/{folderId}/recover")
    public ResponseEntity<ApiResponse> recoverFolder(@PathVariable Long folderId){
        Long userId = 1L;

        return snippetService.recoverFolder(userId, folderId);
    }


    @PatchMapping("/snippets/{snippetId}/rename")
    public ResponseEntity<ApiResponse> renameSnippet(@PathVariable Long snippetId, @RequestBody SnippetRequest snippetRequest){
        Long userId = 1L;
        return snippetService.renameSnippet(userId, snippetId, snippetRequest.getName());
    }

    @PatchMapping("/folders/{folderId}/rename")
public ResponseEntity<ApiResponse> renameFolder(@PathVariable Long folderId, @RequestBody FolderRequest folderRequest){
        Long userId = 1L;
        return snippetService.renameFolder(userId, folderId, folderRequest.getName());




    }

}