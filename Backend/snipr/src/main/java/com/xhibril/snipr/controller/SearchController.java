package com.xhibril.snipr.controller;
import com.xhibril.snipr.dto.snippet.SnippetRequest;
import com.xhibril.snipr.dto.snippet.SnippetResponse;
import com.xhibril.snipr.service.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService){
        this.searchService = searchService;
    }

    @PostMapping("/snippets/find")
    public List<SnippetResponse> searchSnippet(@RequestBody SnippetRequest request){
        Long userId = 1L;

        return searchService.searchSnippets(userId, request.getQuery(), request.getTags(), request.getLanguages());
    }






}
