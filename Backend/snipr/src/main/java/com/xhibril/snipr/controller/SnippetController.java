package com.xhibril.snipr.controller;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.*;
import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;
import com.xhibril.snipr.service.SnippetService;
import jakarta.persistence.PreUpdate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SnippetController {

    private final SnippetService snippetService;

    public SnippetController(SnippetService snippetService){
        this.snippetService = snippetService;
    }

    @PostMapping("/folders")
    public ResponseEntity<FolderResponse> addFolder(@RequestBody FolderRequest request){
        Long userId = 1L; // placeholder

        return snippetService.addFolder(userId, request.getName());
    }


    @PostMapping("/snippets")
    public ResponseEntity<SnippetResponse> addSnippet(@RequestBody SnippetRequest request){
        Long userId = 1L; // placeholder

        return snippetService.addSnippet(userId, request.getName(), request.getFolderId());
    }


    @PatchMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> moveSnippet(@PathVariable Long snippetId, @RequestBody UpdateSnipperRequest request){
        Long userId = 1L; // placeholder

        return snippetService.moveSnippet(userId, snippetId, request.getFolderId());
    }

    @PatchMapping("/snippets/{snippetId}/pin")
    public ResponseEntity<ApiResponse> pinSnippet(@PathVariable Long snippetId){
        Long userId = 1L; // placeholder

        return snippetService.updateSnippetPinStatus(userId, snippetId);
    }

    @PatchMapping("/folders/{folderId}/pin")
    public ResponseEntity<ApiResponse> pinFolder(@PathVariable Long folderId){
        Long userId = 1L;

                return snippetService.updateFolderPinStatus(userId, folderId);
    }

    @DeleteMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> deleteSnippet(@PathVariable Long snippetId){
        Long userId = 1L; // place holder;
        return snippetService.deleteSnippet(userId, snippetId);
    }


    @DeleteMapping("/folders/{folderId}")
    public ResponseEntity<ApiResponse> deleteFolder(@PathVariable Long folderId){
        Long userId = 1L;

        return snippetService.deleteFolder(userId, folderId);
    }

    @PostMapping("/snippets/{snippetId}/tag")
    public ResponseEntity<ApiResponse> addTag(@PathVariable Long snippetId, @RequestBody TagRequest request){
        Long userId = 1L; // place holder;

        return snippetService.addTag(userId, snippetId, request.getTag());
    }

    @DeleteMapping("/snippets/{snippetId}/tag")
    public ResponseEntity<ApiResponse> deleteTag(@PathVariable Long snippetId, @RequestBody TagRequest request){
        Long userId = 1L;
        return snippetService.deleteTag(userId, snippetId, request.getTag());
    }


    @GetMapping("/folders")
    public List<FolderResponse> getFolders(){
        Long userId = 1L; // place holder;

        return snippetService.getFolders(userId);
    }

    @GetMapping("/snippets")
    public List<SnippetResponse> getSnippets(){
        Long userId = 1L; // place holder;

        return snippetService.getSnippets(userId);
    }


    @PatchMapping("/snippets")
    public ResponseEntity<ApiResponse> updateSnippet(@RequestBody SnippetRequest request){
        Long userId = 1L;
        return snippetService.updateSnippet(userId, request);
    }
}
