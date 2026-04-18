package com.xhibril.snipr.repository;

import com.xhibril.snipr.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    Optional<Folder> findByUserIdAndName(Long userId, String folderName);

    Optional<Folder> findByUserIdAndId(Long userId, Long folderId);
}
