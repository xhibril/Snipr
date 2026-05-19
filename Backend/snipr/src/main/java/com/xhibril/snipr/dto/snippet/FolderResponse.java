package com.xhibril.snipr.dto.snippet;

public class FolderResponse {
    private String name;
    private Long id;
    public String message;


    public FolderResponse(){}

    public FolderResponse(String message){
        this.message = message;
    }

    public void setMessage(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return name;
    }

    public void setId(Long id) {
    this.id = id;
    }

    public Long getId(){
        return id;
    }
}
