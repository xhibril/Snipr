package com.xhibril.snipr.repository;
import com.xhibril.snipr.model.User;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.verified = true WHERE u.email = :email")
    void verifyUser(@Param("email") String email);


    @Query("SELECT u.verified FROM User u WHERE u.email = :email")
    Optional<Boolean> isVerified(@Param("email") String email);
}



