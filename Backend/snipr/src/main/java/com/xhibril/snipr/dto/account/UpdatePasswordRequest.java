package com.xhibril.snipr.dto.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdatePasswordRequest {

    @NotBlank(message = "Enter a password")
    @Size(min = 8, max = 32, message = "Password must be 8–32 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!.@#$%^&* ]+$",
            message = "Password must include an uppercase" +
                    " letter, a number, and a special character."
    )
    private String oldPassword;

    @NotBlank(message = "Enter a password")
    @Size(min = 8, max = 32, message = "Password must be 8–32 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!.@#$%^&* ]+$",
            message = "Password must include an uppercase" +
                    " letter, a number, and a special character."
    )
    private String newPassword;
    private String confirmPassword;


    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
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
}
