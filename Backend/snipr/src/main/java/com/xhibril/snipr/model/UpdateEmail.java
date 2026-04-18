package com.xhibril.snipr.model;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class UpdateEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "pending_email")
    private String pendingEmail;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expires_at")
    private Instant resetTokenExpiration;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getPendingEmail() { return pendingEmail; }
    public String getVerificationCode() { return verificationCode; }
    public Instant getExpiresAt() { return expiresAt; }
    public String getResetToken() { return resetToken; }
    public Instant getResetTokenExpiration() { return resetTokenExpiration; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setPendingEmail(String pendingEmail) { this.pendingEmail = pendingEmail; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public void setResetTokenExpiration(Instant resetTokenExpiration) { this.resetTokenExpiration = resetTokenExpiration; }
}
