package com.xhibril.snipr.service;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.auth.PasswordResetResponse;
import com.xhibril.snipr.model.PasswordReset;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.PasswordResetRepository;
import com.xhibril.snipr.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final static SecureRandom random = new SecureRandom();

    private final PasswordResetRepository passwordResetRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;

    public PasswordResetService(PasswordResetRepository passwordResetRepo,
                                UserRepository userRepo, EmailService emailService) {
        this.passwordResetRepo = passwordResetRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    public ResponseEntity<PasswordResetResponse> initPasswordReset(String email) {
        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {
            Optional<PasswordReset> passwordResetOpt = passwordResetRepo.findByUser(userOpt.get());
            PasswordReset passwordReset = new PasswordReset();

            // delete alr existing request
            if (passwordResetOpt.isPresent()) {
                passwordResetRepo.deleteById(passwordResetOpt.get().getId());
            }

            String code = String.valueOf(100000 + random.nextInt(900000));
            passwordReset.setAttempts(6);
            passwordReset.setCode(code);
            passwordReset.setCodeExpiresAt(Instant.now().plusSeconds(600));
            passwordReset.setUser(userOpt.get());

            passwordResetRepo.save(passwordReset);

            emailService.sendVerificationCode(email, code);
        }

        return ResponseEntity.ok().body(new PasswordResetResponse("Verification code sent"));
    }


    @Transactional
    public ResponseEntity<PasswordResetResponse> verifyRequest(String email, String code) {
        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {

            Optional<PasswordReset> passwordResetOpt = passwordResetRepo.findByUser(userOpt.get());

            if (passwordResetOpt.isPresent()) {

                PasswordReset passwordReset = passwordResetOpt.get();

                if (passwordReset.getAttempts() <= 0) {
                    return ResponseEntity.badRequest().body(new PasswordResetResponse("No more attempts remaining"));
                }

                // check if code has expired
                Instant expiresAt = passwordReset.getCodeExpiresAt();
                if (expiresAt == null || Instant.now().isAfter(expiresAt)) {
                    passwordResetRepo.deleteById(passwordReset.getId());
                    return ResponseEntity.badRequest()
                            .body(new PasswordResetResponse("Code has expired"));
                }


                if (!passwordReset.getCode().equals(code)) {
                    passwordResetRepo.updateAttempts(passwordReset.getAttempts() - 1, passwordReset.getId());
                    return ResponseEntity.badRequest().body(new PasswordResetResponse("Code is not correct"));
                }

                PasswordResetResponse response = new PasswordResetResponse();

                String resetToken = saveResetToken(passwordReset.getId());

                response.setResetToken(resetToken);
                response.setMessage("Verification successful");

                passwordResetRepo.deleteConfirmationCode(passwordReset.getId());
                return ResponseEntity.ok().body(response);
            }
        }
        return ResponseEntity.badRequest().body(new PasswordResetResponse("Invalid request"));
    }


    @Transactional
    public ResponseEntity<PasswordResetResponse> resetPassword(String email, String newPassword, String confirmPassword, String resetToken){

        Optional<User> userOpt = userRepo.findByEmail(email);


        if(userOpt.isPresent()){
            Optional<PasswordReset> passwordResetOpt = passwordResetRepo.findByUser(userOpt.get());



            if(passwordResetOpt.isPresent()){
                PasswordReset passwordReset = passwordResetOpt.get();

                // check if reset token has expired
                Instant expiresAt = passwordReset.getTokenExpiresAt();
                if(expiresAt == null || Instant.now().isAfter(expiresAt)){
                    passwordResetRepo.deleteById(passwordReset.getId());
                    return ResponseEntity.badRequest()
                            .body(new PasswordResetResponse("Password reset has expired"));
                }

                // check if reset token matches
                if(!resetToken.equals(passwordReset.getResetToken())){
                    return ResponseEntity.badRequest()
                            .body(new PasswordResetResponse("Invalid request"));
                }

                if(!newPassword.equals(confirmPassword)){
                    return ResponseEntity.badRequest()
                            .body(new PasswordResetResponse("Passwords do not match"));
                }

                if(newPassword.equals(userOpt.get().getPassword())){
                    return ResponseEntity.badRequest()
                            .body(new PasswordResetResponse("New password cannot be same as old"));
                }


                userRepo.updatePassword(newPassword, email);
                passwordResetRepo.deleteById(passwordReset.getId());
                return ResponseEntity.ok().body(new PasswordResetResponse("Password successfully changed"));
            }
        }
        return ResponseEntity.badRequest().body(new PasswordResetResponse("Invalid request"));
    }

    public String saveResetToken(Long id) {
        String resetToken = UUID.randomUUID().toString();
        Instant resetTokenExpiration = Instant.now().plusSeconds(600);
        passwordResetRepo.addResetToken(resetToken, resetTokenExpiration, id);
        return resetToken;
    }
}
