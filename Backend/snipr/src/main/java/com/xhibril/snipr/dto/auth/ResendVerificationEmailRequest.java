package com.xhibril.snipr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ResendVerificationEmailRequest{
    private String email;

    @NotBlank(message = "We couldn't find your email address. " +
            "Please sign up or log in again.")

    @Email(message = "We couldn't use the email address." +
            " Please sign up or log in again.")
    public void setEmail(String email){
        this.email = email;
    }

    public String getEmail(){
        return email;
    }
}
