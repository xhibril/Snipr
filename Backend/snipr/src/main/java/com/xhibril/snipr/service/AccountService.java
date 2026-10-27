package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.account.UpdateEmailRequest;
import com.xhibril.snipr.dto.account.UpdateEmailResponse;
import com.xhibril.snipr.dto.account.UpdatePasswordRequest;
import com.xhibril.snipr.dto.account.UpdateUsernameRequest;
import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.model.UpdateEmail;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.UpdateEmailRepository;
import com.xhibril.snipr.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {


    private final UserRepository userRepo;
    private final UpdateEmailRepository updateEmailRepo;
    private final EmailService emailService;

    public AccountService(UserRepository userRepo,
                          UpdateEmailRepository updateEmailRepo,
                          EmailService emailService) {
        this.userRepo = userRepo;
        this.updateEmailRepo = updateEmailRepo;
        this.emailService = emailService;
    }


    public ResponseEntity<Void> logout(HttpServletResponse res) {
        Cookie cookie = new Cookie("authToken", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        res.addCookie(cookie);
        return ResponseEntity.ok().build();
    }


    public ResponseEntity<ApiResponse> updateUsername(Long userId, UpdateUsernameRequest request) {
        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Incorrect password"));
        }

        user.setUsername(request.getUsername());
        userRepo.save(user);
        return ResponseEntity.ok().body(new ApiResponse("Username successfully updated"));
    }


    public ResponseEntity<ApiResponse> updatePassword(Long userId, UpdatePasswordRequest request) {

        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Account not found"));
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Incorrect password"));
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Passwords do not match"));
        }


        if (request.getNewPassword().equals(user.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Password cannot be same as old"));
        }


        user.setPassword(request.getNewPassword());
        userRepo.save(user);
        return ResponseEntity.ok().body(new ApiResponse("Password successfully changed"));
    }


    @Transactional
    public ResponseEntity<UpdateEmailResponse> updateEmailRequest(Long userId, UpdateEmailRequest request) {
        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Invalid request"));
        }

        User user = userOpt.get();
        String pendingEmail = request.getPendingEmail().trim().toLowerCase();

        if (user.getEmail().equalsIgnoreCase(pendingEmail)) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("That is already your current email"));
        }

        if (userRepo.existsByEmailIgnoreCase(pendingEmail)) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("This email is already registered"));
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse(("Incorrect password")));
        }

        boolean hasPendingRequest = updateEmailRepo.existsByUser(user);
        // remove existing requests
        if (hasPendingRequest) {
            updateEmailRepo.deleteAllByUser(user);
            updateEmailRepo.flush();
        }

        UpdateEmail updateEmail = new UpdateEmail();

        SecureRandom random = new SecureRandom();
        String code = String.valueOf(100000 + random.nextInt(900000));
        emailService.sendVerificationCode(pendingEmail, code);

        updateEmail.setPendingEmail(pendingEmail);
        updateEmail.setVerificationCode(code);
        updateEmail.setUser(user);
        updateEmail.setExpiresAt(Instant.now().plusSeconds(600));
        updateEmail.setAttemptsRemaining(5);

        updateEmailRepo.save(updateEmail);
        return ResponseEntity.ok().body(new UpdateEmailResponse("Verification code sent"));
    }


    @Transactional
    public ResponseEntity<UpdateEmailResponse> updateEmailVerify(Long userId, UpdateEmailRequest request) {
        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Invalid request"));
        }

        User user = userOpt.get();

        Optional<UpdateEmail> updateEmailOpt = updateEmailRepo.findByUser(user);

        if (updateEmailOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Invalid request"));
        }

        UpdateEmail updateEmail = updateEmailOpt.get();

        if (updateEmail.getVerificationCode() == null) {
            return ResponseEntity.badRequest()
                    .body(new UpdateEmailResponse("Invalid request"));
        }

        Instant current = Instant.now();

        // code expired
        if (!current.isBefore(updateEmail.getExpiresAt())) {
            return ResponseEntity.badRequest()
                    .body(new UpdateEmailResponse("Code has expired"));
        }
        // too many attempts
        if (updateEmail.getAttemptsRemaining() <= 0) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse(
                    "Too many incorrect attempts. Please request a new code."));
        }

        // code is incorrect
        if (!updateEmail.getVerificationCode().equals(request.getCode())) {
            Integer currentAttemptsRemaining = updateEmail.getAttemptsRemaining() - 1;
            updateEmail.setAttemptsRemaining(currentAttemptsRemaining);
            updateEmailRepo.save(updateEmail);
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Code is incorrect"));
        }


        String resetToken = UUID.randomUUID().toString();
        Instant resetTokenExpiration = Instant.now().plusSeconds(600);

        updateEmail.setVerificationCode(null);
        updateEmail.setResetToken(resetToken);
        updateEmail.setResetTokenExpiration(resetTokenExpiration);

        updateEmailRepo.save(updateEmail);
        UpdateEmailResponse response = new UpdateEmailResponse();

        response.setResetToken(resetToken);
        return ResponseEntity.ok().body(response);
    }


    @Transactional
    public ResponseEntity<UpdateEmailResponse> updateEmailChange(Long userId, UpdateEmailRequest request) {
        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Invalid request"));
        }

        User user = userOpt.get();
        Optional<UpdateEmail> updateEmailOpt = updateEmailRepo.findByUser(user);

        if (updateEmailOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Invalid request"));
        }

        UpdateEmail updateEmail = updateEmailOpt.get();

        Instant current = Instant.now();
        // reset token expired

        if (!current.isBefore(updateEmail.getResetTokenExpiration())) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse("Email reset has expired"));
        }

        // token has expired
        if (!updateEmail.getResetToken().equals(request.getResetToken())) {
            return ResponseEntity.badRequest().body(new UpdateEmailResponse(
                            "Verification session is invalid or has expired. Please start again."));
        }
        user.setEmail(request.getPendingEmail());
        userRepo.save(user);
        updateEmailRepo.deleteAllByUser(user);

        return ResponseEntity.ok().body(new UpdateEmailResponse("Email successfully changed"));
    }


}
