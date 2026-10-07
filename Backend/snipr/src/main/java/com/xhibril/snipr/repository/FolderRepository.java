package com.xhibril.snipr.repository;

import com.xhibril.snipr.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    Optional<Folder> findByUserIdAndName(Long userId, String folderName);

    Optional<Folder> findByUserIdAndId(Long userId, Long folderId);


    List<Folder> findByUserIdAndIsDeletedFalse(Long userId);

    @Modifying
    @Query("UPDATE Folder f SET f.isPinned = :isPinned  WHERE f.id = :folderId")
    void updatePinStatus(@Param("isPinned") Boolean isPinned,
                         @Param("folderId") Long folderId);


    List<Folder> findByUserIdAndIsPinned(Long userId, Boolean isPinned);

    List<Folder> findByUserIdAndIsShared(Long userId, Boolean isShared);

    List<Folder> findByUserIdAndIsDeleted(Long userId, Boolean isDeleted);


    @Query("""
            SELECT f FROM Folder f 
            WHERE f.user.id = :userId
            AND f.isDeleted = true
            AND f.deletedAt > :time
            """)
    List<Folder> getDeletedFolders(@Param("userId") Long userId,
                                   @Param("time") LocalDateTime time);


    @Modifying
    @Query("""
            DELETE FROM Folder f 
            WHERE f.deletedAt < :time
            """)
    void deleteExpiredFolders(@Param("time") LocalDateTime time);
}
