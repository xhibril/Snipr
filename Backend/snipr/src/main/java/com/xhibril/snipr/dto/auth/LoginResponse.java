package com.xhibril.snipr.dto.auth;

import com.xhibril.snipr.model.User;

public class LoginResponse {

    private String message;
    private Boolean isTrusted;
    public User user;


    public LoginResponse(String message, Boolean isTrusted) {
        this.message = message;
        this.isTrusted = isTrusted;
    }

    public LoginResponse() {
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setIsTrusted(Boolean isTrusted){
        this.isTrusted = isTrusted;
    }

    public Boolean isTrusted(){
        return isTrusted;
    }



    public String getMessage(){
        return message;
    }
    public void setUser(User user){
        this.user= user;
    }

    public User getUser(){
        return user;
    }
}
