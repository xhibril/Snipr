package com.xhibril.snipr.dto.auth;

public class LoginResponse {

    private String message;
    private Boolean isTrusted;


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
}
