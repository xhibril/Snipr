package com.xhibril.snipr.repository;

import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
