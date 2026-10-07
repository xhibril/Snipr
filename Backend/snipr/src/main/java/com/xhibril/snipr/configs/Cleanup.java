package com.xhibril.snipr.configs;

import com.xhibril.snipr.repository.FolderRepository;
import com.xhibril.snipr.repository.SnippetRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class Cleanup {

    private final SnippetRepository snippetRepo;
    private final FolderRepository folderRepo;

    public Cleanup(SnippetRepository snippetRepo,
                   FolderRepository folderRepo){
        this.snippetRepo = snippetRepo;
        this.folderRepo = folderRepo;
    }

    @Transactional
    @Scheduled(fixedDelay = 60 * 60 * 1000)
    public void cleanupTask(){
        snippetRepo.deleteExpiredFiles(LocalDateTime.now().minusDays(30));
        folderRepo.deleteExpiredFolders(LocalDateTime.now().minusDays(30));
    }
}
