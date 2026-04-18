package com.xhibril.snipr.controller;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.*;
import com.xhibril.snipr.service.SnippetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SnippetController {

    private final SnippetService snippetService;

    public SnippetController(SnippetService snippetService){
        this.snippetService = snippetService;
    }

    @PostMapping("/folders")
    public ResponseEntity<ApiResponse> addFolder(@RequestParam String name){
        Long userId = 1L; // placeholder

        return snippetService.addFolder(userId, name);
    }


    @PostMapping("/snippets")
    public ResponseEntity<ApiResponse> addSnippet(@RequestBody SnippetRequest request){
        Long userId = 1L; // placeholder

        return snippetService.addSnippet(userId, request.getTitle(), request.getCode(),
                request.getDescription(), request.getTags(), request.getLanguages());
    }


    @PatchMapping("/snippets/{snippetId}")
    public ResponseEntity<ApiResponse> moveSnippet(@PathVariable Long snippetId, @RequestBody UpdateSnipperRequest request){
        Long userId = 1L; // placeholder

        return snippetService.moveSnippet(userId, snippetId, request.getFolderId());
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

    @PostMapping("/snippets/{snippetId}/language")
    public ResponseEntity<ApiResponse> addLanguage(@PathVariable Long snippetId, @RequestBody LanguageRequest request){
        Long userId = 1L; // place holder

        return snippetService.addLanguage(userId, snippetId, request.getLanguage());
    }

    @DeleteMapping("/snippets/{snippetId}/language")
    public ResponseEntity<ApiResponse> deleteLanguage(@PathVariable Long snippetId, @RequestBody LanguageRequest request){
        Long userId = 1L;

        return snippetService.deleteLanguage(userId, snippetId, request.getLanguage());
    }
}
