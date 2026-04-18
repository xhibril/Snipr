package com.xhibril.snipr.model;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class PasswordReset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_email")
    private User user;

    private String code;

    @Column(name = "code_expires_at")
    private Instant codeExpiresAt;

    private Integer attempts;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expires_at")
    private  Instant tokenExpiresAt;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getCode() { return code; }
    public Instant getCodeExpiresAt() { return codeExpiresAt; }
    public Integer getAttempts() { return attempts; }
    public String getResetToken() { return resetToken; }
    public Instant getTokenExpiresAt() { return tokenExpiresAt; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setCode(String code) { this.code = code; }
    public void setCodeExpiresAt(Instant codeExpiresAt) { this.codeExpiresAt = codeExpiresAt; }
    public void setAttempts(Integer attempts) { this.attempts = attempts; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public void setTokenExpiresAt(Instant tokenExpiresAt) { this.tokenExpiresAt = tokenExpiresAt; }
}
