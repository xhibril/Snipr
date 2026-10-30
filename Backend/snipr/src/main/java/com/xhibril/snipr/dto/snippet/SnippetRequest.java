package com.xhibril.snipr.dto.snippet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class SnippetRequest {

    private Long id;

    @NotBlank(message = "Enter a file name")
    @Size(max = 255, message = "File name cannot be more than 255 characters")
    private String name;

    private Long folderId;


    @Size(max = 100000, message = "File body limit exceeded")
    private String body;

    @Size(max = 120, message = "File title cannot be more than 120 characters")
    private String title;

    private List<
            @NotBlank(message = "Enter a tag name")
            @Pattern(regexp = "[A-Za-z]+", message = "Enter a valid tag"
            )String> tags;


    private String query;
    private Boolean isPinned;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void folderId(Long folderId) {
        this.folderId = folderId;
    }

    public Long getFolderId() {
        return folderId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }


    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
    }

    public Boolean getIsPinned() {
        return isPinned;
    }

}