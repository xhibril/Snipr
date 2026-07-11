package com.xhibril.snipr.dto.snippet;

import java.util.List;

public class SnippetResponse {

    private Long id;
    private String name;
    private String body;
    private String title;
    private Long folderId;
    private String message;
    private Boolean isPinned;
    private List<String> tags;
    private Integer tagAmount;

    public SnippetResponse(String title, String body, String name) {
        this.title = title;
        this.body = body;
        this.name = name;
    }

    public SnippetResponse(String message) {
        this.message = message;
    }

    public SnippetResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setIsPinned(Boolean isPinned){
        this.isPinned = isPinned;
    }

    public Boolean getIsPinned(){
        return isPinned;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }


    public void setTagAmount(Integer tagAmount){
        this.tagAmount = tagAmount;
    }

    public Integer getTagAmount(){
        return tagAmount;
    }
}