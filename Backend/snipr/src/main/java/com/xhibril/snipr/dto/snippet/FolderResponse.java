package com.xhibril.snipr.dto.snippet;

public class FolderResponse {
    private String name;
    private Long id;
    private String message;
    private Boolean isPinned;
    private Boolean isDeleted;

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

    public void setIsPinned(Boolean isPinned){
        this.isPinned = isPinned;
    }

    public Boolean getIsPinned(){
        return isPinned;
    }

    public Boolean getIsDeleted(){
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted){
        this.isDeleted = isDeleted;
    }
}
