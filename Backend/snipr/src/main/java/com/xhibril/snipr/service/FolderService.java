package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.FolderCopyResponse;
import com.xhibril.snipr.dto.snippet.FolderRequest;
import com.xhibril.snipr.dto.snippet.FolderResponse;
import com.xhibril.snipr.dto.snippet.SnippetResponse;
import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.FolderRepository;
import com.xhibril.snipr.repository.SnippetRepository;
import com.xhibril.snipr.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FolderService {

    private final UserRepository userRepo;
    private final FolderRepository folderRepo;
    private final SnippetRepository snippetRepo;

    public FolderService(UserRepository userRepo,
                         FolderRepository folderRepo,
                         SnippetRepository snippetRepo){
        this.userRepo = userRepo;
        this.folderRepo = folderRepo;
        this.snippetRepo = snippetRepo;
    }

    public ResponseEntity<FolderResponse> addFolder(Long userId, FolderRequest request) {
        Optional<User> userOpt = userRepo.findById(userId);
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndName(userId, request.getName());

        if (folderOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new FolderResponse("Folder already exists"));
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Folder folder = new Folder();
            folder.setUser(user);
            folder.setName(request.getName());

            Folder folderSaved = folderRepo.save(folder);

            FolderResponse folderResponse = new FolderResponse();
            folderResponse.setName(folderSaved.getName());
            folderResponse.setId(folderSaved.getId());
            folderResponse.setMessage("Folder successfully created");

            return ResponseEntity.ok().body(folderResponse);
        } else {
            return ResponseEntity.badRequest().body(new FolderResponse("Invalid request"));
        }
    }



    @Transactional
    public ResponseEntity<ApiResponse> deleteFolder(Long userId, Long folderId) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);

        if (folderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Folder folder = folderOpt.get();

        folder.setIsDeleted(true);
        folder.setDeletedAt(LocalDateTime.now());
        folderRepo.save(folder);
        snippetRepo.updateDeletedByUserIdAndFolderId(userId, folderId, true, LocalDateTime.now());

        return ResponseEntity.ok().body(new ApiResponse("Folder moved to trash"));
    }


    @Transactional
    public ResponseEntity<ApiResponse> permanentlyDeleteFolder(Long userId, Long folderId) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);

        if (folderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Folder folder = folderOpt.get();

        if (!Boolean.TRUE.equals(folder.getIsDeleted())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Folder is not in trash"));
        }

        snippetRepo.deleteByUserIdAndFolderId(userId, folderId);
        folderRepo.delete(folder);

        return ResponseEntity.ok().body(new ApiResponse("Folder permanently deleted"));
    }

    public List<FolderResponse> getFolders(Long userId, ItemView view) {
        List<Folder> folders;

        switch (view) {
            case ALL -> folders = folderRepo.findByUserIdAndIsDeletedFalse(userId);
            case PINNED -> folders = folderRepo.findByUserIdAndIsPinnedTrueAndIsDeletedFalse(userId);
            case SHARED -> folders = folderRepo.findByUserIdAndIsSharedTrueAndIsDeletedFalse(userId);
            case DELETED -> folders = folderRepo.findDeletedFolders(userId, LocalDateTime.now().minusDays(30));
            default -> throw new IllegalArgumentException("Invalid view");
        }

        return folders.stream()
                .map(this::toFolderResponse)
                .toList();
    }


    public FolderResponse toFolderResponse(Folder folder) {
        FolderResponse folderResponse = new FolderResponse();
        folderResponse.setId(folder.getId());
        folderResponse.setName(folder.getName());
        folderResponse.setIsPinned(folder.getIsPinned());
        folderResponse.setIsDeleted(folder.getIsDeleted());

        if (folder.getIsDeleted()) {
            Long days = 30 - ChronoUnit.DAYS.between(folder.getDeletedAt(), LocalDateTime.now());
            folderResponse.setDaysRemaining(days);
        }
        return folderResponse;
    }



    @Transactional
    public ResponseEntity<ApiResponse> updateFolderPinStatus(Long userId, Long folderId) {
        Optional<Folder> folderOpt = folderRepo.findById(folderId);

        if (folderOpt.isPresent()) {
            Folder folder = folderOpt.get();
            User user = folder.getUser();

            if (user.getId() == userId) {
                Boolean pinStatus = !Boolean.TRUE.equals(folder.getIsPinned());
                folderRepo.updatePinStatus(pinStatus, folderId);
                return ResponseEntity.ok().body(new ApiResponse("Snippet successfully updated"));
            }
        }
        return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
    }


    @Transactional
    public ResponseEntity<ApiResponse> recoverFolder(Long userId, Long folderId) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);
        List<Snippet> snippets =
                snippetRepo.findByUserIdAndFolderId(userId, folderId);

        if (folderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }
        Folder folder = folderOpt.get();
        folder.setDeletedAt(null);
        folder.setIsDeleted(false);
        folderRepo.save(folder);

        if (!snippets.isEmpty()) {
            snippetRepo.updateDeletedByUserIdAndFolderId(userId, folderId, false, null);
        }

        return ResponseEntity.ok().body(new ApiResponse("Folder successfully recovered"));
    }

    public ResponseEntity<ApiResponse> renameFolder(Long userId, Long folderId, FolderRequest request) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);
        if (folderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Folder folder = folderOpt.get();
        folder.setName(request.getName());
        folderRepo.save(folder);
        return ResponseEntity.ok().body(new ApiResponse("Folder successfully updated"));
    }


    @Transactional
    public ResponseEntity<FolderCopyResponse> copyFolder(Long userId, Long folderId,
                                                         FolderRequest request) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);

        if (folderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new FolderCopyResponse("Invalid request"));
        }

        Folder originalFolder = folderOpt.get();

        Folder copiedFolder = new Folder();
        copiedFolder.setName(request.getName());
        copiedFolder.setUser(originalFolder.getUser());
        copiedFolder.setIsPinned(originalFolder.getIsPinned());

        Folder savedFolder = folderRepo.save(copiedFolder);


        List<Snippet> originalSnippets =
                snippetRepo.findByUserIdAndFolderId(userId, folderId);

        List<Snippet> newSnippets = new ArrayList<>();
        List<SnippetResponse> snippetResponses = new ArrayList<>();

        for (Snippet original : originalSnippets) {
            Snippet copy = new Snippet();

            copy.setUser(original.getUser());
            copy.setFolder(savedFolder);
            copy.setName(original.getName());
            copy.setTitle(original.getTitle());
            copy.setBody(original.getBody());
            copy.setTags(new ArrayList<>(original.getTags()));

            copy.setIsPinned(original.getIsPinned());
            newSnippets.add(copy);

            SnippetResponse response = new SnippetResponse();

            response.setId(original.getId());
            response.setFolderId(savedFolder.getId());
            response.setName(original.getName());
            response.setTitle(original.getTitle());
            response.setBody(original.getTitle());
            response.setTags(original.getTags());

            response.setIsPinned(original.getIsPinned());
            snippetResponses.add(response);
        }
        snippetRepo.saveAll(newSnippets);

        FolderCopyResponse folderCopyResponse = new FolderCopyResponse(savedFolder, snippetResponses);

        return ResponseEntity.ok(folderCopyResponse);
    }



}
