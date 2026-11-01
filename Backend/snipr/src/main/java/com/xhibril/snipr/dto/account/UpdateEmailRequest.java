package com.xhibril.snipr.dto.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateEmailRequest {

    @NotBlank(message = "Enter your email address")
    @Email(message = "Enter a valid email address")
    private String pendingEmail;

    @NotBlank(message = "Enter a verification code")
    @Size(min = 6, max = 6, message = "Verification code must be 6 digits")
    @Pattern(regexp = "\\d+", message = "Verification code can only contain numbers")
    private String code;

    private String resetToken;

    @NotBlank(message = "Enter a password")
    @Size(min = 8, max = 32, message = "Password must be 8–32 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!.@#$%^&* ]+$",
            message = "Password must include an uppercase" +
                    " letter, a number, and a special character."
    )
    private String password;

    public String getPendingEmail() {
        return pendingEmail;
    }

    public void setPendingEmail(String pendingEmail) {
        this.pendingEmail = pendingEmail;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
