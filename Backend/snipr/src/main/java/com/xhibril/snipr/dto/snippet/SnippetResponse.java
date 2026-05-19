package com.xhibril.snipr.dto.snippet;

public class SnippetResponse {


    private Long id;
    private String title;
    private String code;
    private String description;
    private Long folderId;
    private String message;

    public SnippetResponse(String title, String code, String description) {
        this.title = title;
        this.code = code;
        this.description = description;
    }

    public SnippetResponse(String message){
        this.message = message;
    }

    public SnippetResponse(){}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setFolderId(Long folderId){
        this.folderId = folderId;
    }
    public Long getFolderId(){
        return folderId;
    }

    public String getMessage(){
        return message;
    }

    public void setMessage(String message){
        this.message = message;
    }

    public void setId(Long id){
        this.id = id;
    }

    public Long getId(){
        return id;
    }
}
