package com.xhibril.snipr.dto.auth;

import com.xhibril.snipr.validation.ValidationGroups;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PasswordResetRequest {

    @NotBlank(message = "Enter your email address", groups = ValidationGroups.Step1.class)
    @Email(message = "Enter a valid email address", groups = ValidationGroups.Step1.class)
    private String email;

    @NotBlank(message = "Enter a password", groups = ValidationGroups.Step3.class)
    @Size(min = 8, max = 32, message = "Password must be 8–32 characters long", groups = ValidationGroups.Step3.class)
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!.@#$%^&* ]+$",
            message = "Password must include an uppercase" +
                    " letter, a number, and a special character.", groups = ValidationGroups.Step3.class
    )
    private String newPassword;

    private String confirmPassword;

    @NotBlank(message = "Enter a verification code", groups = ValidationGroups.Step2.class)
    @Size(min = 6, max = 6, message = "Verification code must be 6 digits", groups = ValidationGroups.Step2.class)
    @Pattern(regexp = "\\d+", message = "Verification code can only contain numbers", groups = ValidationGroups.Step2.class)
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
