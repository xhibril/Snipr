package com.xhibril.snipr.dto.auth;

public class ResendVerificationEmailRequest{
    private String email;

    public void setEmail(String email){
        this.email = email;
    }

    public String getEmail(){
        return email;
    }
}
