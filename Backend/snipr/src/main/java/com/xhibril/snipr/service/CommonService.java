package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.FolderRequest;
import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;
import com.xhibril.snipr.repository.FolderRepository;
import com.xhibril.snipr.repository.SnippetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CommonService {

    private final SnippetRepository snippetRepo;
    private final FolderRepository folderRepo;

    public CommonService(SnippetRepository snippetRepo,
                         FolderRepository folderRepo){
        this.folderRepo = folderRepo;
        this.snippetRepo = snippetRepo;
    }

    @Transactional
    public ResponseEntity<ApiResponse> emptyRecycleBin(Long userId) {
        snippetRepo.deleteByUserIdAndIsDeletedTrue(userId);
        folderRepo.deleteByUserIdAndIsDeletedTrue(userId);
        return ResponseEntity.ok().body(new ApiResponse("Recycle bin successfully emptied"));
    }


    // check for dupe
    public boolean isSnippetNameValid(Long userId, Long folderId, String name){
        Optional<Snippet> snippetOpt;

        // outside folder
        if(folderId == null){
            snippetOpt = snippetRepo.findByUserIdAndFolderIsNullAndNameAndIsDeletedFalse(
                    userId, name);
        } else {
            snippetOpt = snippetRepo.findByUserIdAndFolderIdAndNameAndIsDeletedFalse(
                    userId, folderId, name);
        }

        return snippetOpt.isEmpty();
    }


    public boolean isFolderNameValid(Long userId, String name){
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndNameAndIsDeletedFalse(userId, name);
        return folderOpt.isEmpty();
    }






}
