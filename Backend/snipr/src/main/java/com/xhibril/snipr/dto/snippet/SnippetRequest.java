package com.xhibril.snipr.dto.snippet;

import java.util.List;

public class SnippetRequest {

    private Long id;
    private String name;
    private Long folderId;
    private String body;
    private String title;
    private List<String> tags;
    private String query;
    private Boolean isPinned;
    private Integer tagAmount;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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


    public void setId(Long id){ this.id = id;}
    public Long getId(){
        return id;
    }


    public void setIsPinned(Boolean isPinned){
        this.isPinned = isPinned;
    }

    public Boolean getIsPinned(){
        return isPinned;
    }

    public void setTagAmount(Integer tagAmount){
        this.tagAmount = tagAmount;
    }

    public Integer getTagAmount(){
        return tagAmount;
    }
}