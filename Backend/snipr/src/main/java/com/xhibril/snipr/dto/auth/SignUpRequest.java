package com.xhibril.snipr.dto.auth;

public class SignUpRequest {
    private String email;
    private String password;
    private String username;

    public void setEmail(String email){
        this.email = email;
    }

    public String getEmail(){
        return email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public String getPassword(){
        return password;
    }


    public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }
}
