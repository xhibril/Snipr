package com.xhibril.snipr.dto.auth;

public class PasswordResetResponse {
    private String message;
    private String resetToken;

    public PasswordResetResponse(String message){
        this.message = message;
    }

    public PasswordResetResponse(String message,
                                 String resetToken){
        this.message = message;
        this.resetToken = resetToken;
    }

    public PasswordResetResponse(){}

    public void setMessage(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

    public void setResetToken(String resetToken){
        this.resetToken = resetToken;
    }
    public String getResetToken(){
        return resetToken;
    }

}
