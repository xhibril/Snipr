package com.xhibril.snipr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "Enter your email address")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Enter a password")
    @Size(min = 8, max = 32, message = "Password must be 8–32 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!.@#$%^&* ]+$",
            message = "Password must include an uppercase" +
                    " letter, a number, and a special character."
    )
    private String password;
    private Boolean rememberMe = false;

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

    public void setRememberMe(boolean rememberMe){
        this.rememberMe = rememberMe;
    }

    public Boolean getRememberMe(){
        return rememberMe;
    }
}
