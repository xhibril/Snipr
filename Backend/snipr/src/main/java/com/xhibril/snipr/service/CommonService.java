package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.repository.FolderRepository;
import com.xhibril.snipr.repository.SnippetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

}
