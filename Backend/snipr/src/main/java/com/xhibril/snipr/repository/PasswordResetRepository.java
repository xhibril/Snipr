package com.xhibril.snipr.repository;

import com.xhibril.snipr.model.PasswordReset;
import com.xhibril.snipr.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByUser(User user);


    @Modifying
    @Query ("UPDATE PasswordReset u SET u.attempts = :attempts WHERE u.id = :id")
    void updateAttempts(@Param("attempts") Integer attempts,
                        @Param("id") Long id);


    @Modifying
    @Query("UPDATE PasswordReset u SET u.resetToken = :resetToken, u.tokenExpiresAt = :tokenExpiresAt WHERE u.id = :id")
    void addResetToken(@Param("resetToken")String resetToken,
                       @Param("tokenExpiresAt") Instant tokenExpiresAt,
                       @Param("id") Long id);


    @Modifying
    @Query("UPDATE PasswordReset  u SET u.code = null, u.codeExpiresAt = null WHERE u.id = :id")
    void deleteConfirmationCode(@Param("id") Long id);


}
