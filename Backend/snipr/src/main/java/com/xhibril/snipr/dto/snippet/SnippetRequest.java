package com.xhibril.snipr.dto.snippet;

import java.util.List;

public class SnippetRequest {

    private String fileName;
    private Long folderId;
    private String body;
    private String title;
    private List<String> tags;
    private String query;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void folderId(Long folderId){
        this.folderId = folderId;
    }

    public Long getFolderId(){
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
}