package com.xhibril.snipr.dto.auth;

public class PasswordResetRequest {
    private String message;
    private String email;
    private String newPassword;
    private String confirmPassword;
    private String code;
    private String resetToken;



    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

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
