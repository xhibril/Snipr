package com.xhibril.snipr.repository;

import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SnippetRepository extends JpaRepository<Snippet, Long> {

    @Modifying
    @Query("UPDATE Snippet s SET s.folder = :folder WHERE s.id = :id")
    void moveSnippet(@Param("folder") Folder folder,
                     @Param("id") Long id);

    Optional<Snippet> findByUserIdAndId(Long userId, Long snippetId);

    void deleteByUserIdAndFolderId(Long userId, Long folderId);

    List<Snippet> findAllByUserId(Long userId);


    @Modifying
    @Query("UPDATE Snippet s SET s.isPinned = :isPinned  WHERE s.id = :snippetId")
    void updatePinStatus(@Param("isPinned") Boolean isPinned,
                         @Param("snippetId") Long snippetId);


    List<Snippet> findByUserIdAndIsDeletedFalse(Long userId);


    @Modifying
    @Query("UPDATE Snippet s SET s.isDeleted = :isDeleted, s.deletedAt = :deletedAt WHERE s.user.id = :userId AND s.folder.id = :folderId")
    void updateDeletedByUserIdAndFolderId(@Param("userId") Long userId,
                                          @Param("folderId") Long folderId,
                                          @Param("isDeleted") Boolean isDeleted,
                                          @Param("deletedAt") LocalDateTime deletedAt);


    @Transactional
    @Modifying
    @Query("UPDATE Snippet s SET s.isPinned = :isPinned WHERE s.user.id = :userId AND s.folder.id = :folderId")
    void updatePinnedByUserIdAndFolderId(@Param("userId") Long userId,
                                         @Param("folderId") Long folderId,
                                         @Param("isPinned") Boolean isPinned);

    List<Snippet> findByUserIdAndIsPinned(Long userId, Boolean isPinned);

    List<Snippet> findByUserIdAndIsShared(Long userId, Boolean isShared);

    List<Snippet> findByUserIdAndIsDeleted(Long userId, Boolean isDeleted);


    @Query("""
            SELECT s FROM Snippet s
            WHERE s.user.id = :userId 
            AND s.isDeleted = true 
            AND s.deletedAt > :time
            """)
    List<Snippet> getDeletedSnippets(@Param("userId") Long userId,
                                     @Param("time") LocalDateTime time);


    @Modifying
    @Query("""
            DELETE FROM Snippet s 
            WHERE s.deletedAt < :time
            """)
    void deleteExpiredFiles(@Param("time") LocalDateTime time);

    List<Snippet> findByUserIdAndFolderId(Long userId, Long folderId);





    @Query("""
SELECT s FROM Snippet s 
LEFT JOIN s.folder f
WHERE s.user.id = :userId
AND (s.isPinned = true OR f.isPinned = true)
AND s.isDeleted = false
""")
    List<Snippet> findStarredSnippets(@Param("userId") Long userId);

}
