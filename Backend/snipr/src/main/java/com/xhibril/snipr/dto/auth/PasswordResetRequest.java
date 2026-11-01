package com.xhibril.snipr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PasswordResetRequest {

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
    private String newPassword;

    private String confirmPassword;

    @NotBlank(message = "Enter a verification code")
    @Size(min = 6, max = 6, message = "Verification code must be 6 digits")
    @Pattern(regexp = "\\d+", message = "Verification code can only contain numbers")
    private String code;

    private String resetToken;



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setResetToken(String resetToken){
        this.resetToken = resetToken;
    }

    public String getResetToken(){
        return resetToken;
    }
}
