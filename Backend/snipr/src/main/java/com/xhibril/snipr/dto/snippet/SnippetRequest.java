package com.xhibril.snipr.dto.snippet;

import java.util.List;

public class SnippetRequest {
    private String title;
    private String code;
    private String description;
    private List<String> tags;
    private String query;


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

    public List<String> getTags(){
        return tags;
    }

    public void setTags(List<String> tags){
        this.tags = tags;
    }

    public void setQuery(String query){
        this.query = query;
    }
    public String getQuery(){
        return query;
    }
}

