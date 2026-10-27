package com.xhibril.snipr.repository;

import com.xhibril.snipr.model.UpdateEmail;
import com.xhibril.snipr.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UpdateEmailRepository extends JpaRepository<UpdateEmail, Long> {
    boolean existsByUserId(Long userId);

    boolean existsByUser(User user);

    void deleteAllByUser(User user);

    Optional<UpdateEmail> findByUser(User user);
}
