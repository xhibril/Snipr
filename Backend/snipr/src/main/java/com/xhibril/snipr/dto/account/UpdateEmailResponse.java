package com.xhibril.snipr.dto.account;

public class UpdateEmailResponse {
    private String resetToken;
    private String message;


    public UpdateEmailResponse(String message){
        this.message = message;
    }

    public UpdateEmailResponse(){}


    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
