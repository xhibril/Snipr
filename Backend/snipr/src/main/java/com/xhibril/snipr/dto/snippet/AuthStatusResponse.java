package com.xhibril.snipr.dto.snippet;

import com.xhibril.snipr.model.User;

public class AuthStatusResponse {

    private Boolean isAuthenticated;
    private User user;


    public AuthStatusResponse(){}

    public AuthStatusResponse(Boolean isAuthenticated, User user){
        this.isAuthenticated = isAuthenticated;
        this.user = user;
    }


    public void setUser(User user){
        this.user = user;
    }

    public Boolean getIsAuthenticated(){
        return isAuthenticated;
    }

    public void setIsAuthenticated(Boolean isAuthenticated){
        this.isAuthenticated = isAuthenticated;
    }

    public User getUser(){
        return user;
    }
}
