package com.xhibril.snipr.dto.snippet;

public class SnippetResponse {

    private Long id;
    private String fileName;
    private String body;
    private String title;
    private Long folderId;
    private String message;
    private Boolean isPinned;

    public SnippetResponse(String title, String body, String fileName) {
        this.title = title;
        this.body = body;
        this.fileName = fileName;
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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
}