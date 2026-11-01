package com.xhibril.snipr.dto.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.parameters.P;

public class UpdateUsernameRequest {

    @NotBlank(message = "Enter a username")
    @Size(min = 3, max = 20, message = "Username must be 3-20 characters long")
    @Pattern(
            regexp = "^[A-Za-z0-9_.]+$",
            message = "Username can contain letters, numbers, underscores, and periods only."
    )
    private String username;

    @NotBlank(message = "Enter a password")
    @Size(min = 8, max = 32, message = "Password must be 8–32 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!.@#$%^&* ]+$",
            message = "Password must include an uppercase" +
                    " letter, a number, and a special character."
    )
    private String password;


    public void setUsername(String username){
        this.username = username;
    }

    public String getUsername(){
        return username;
    }


    public void setPassword(String password){
        this.password = password;
    }

    public String getPassword() {
    return password;
    }



}
