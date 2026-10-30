package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.*;
import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;
import com.xhibril.snipr.model.User;
import com.xhibril.snipr.repository.FolderRepository;
import com.xhibril.snipr.repository.SnippetRepository;
import com.xhibril.snipr.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SnippetService {

    private final UserRepository userRepo;
    private final SnippetRepository snippetRepo;
    private final FolderRepository folderRepo;

    public SnippetService(UserRepository userRepo,
                          SnippetRepository snippetRepo,
                          FolderRepository folderRepo) {
        this.userRepo = userRepo;
        this.snippetRepo = snippetRepo;
        this.folderRepo = folderRepo;
    }

    public ResponseEntity<SnippetResponse> addSnippet(Long userId, SnippetRequest request) {

        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Snippet snippet = new Snippet();

            snippet.setUser(user);
            snippet.setName(request.getName());
            snippet.setTitle("Untitled");

            if (request.getFolderId() != null) {
                Optional<Folder> folderOpt = folderRepo.findById(request.getFolderId());

                if (folderOpt.isPresent()) {
                    Folder folder = folderOpt.get();
                    snippet.setFolder(folder);
                }
            }

            Snippet savedSnippet = snippetRepo.save(snippet);

            SnippetResponse snippetResponse = new SnippetResponse();
            snippetResponse.setMessage("Snippet successfully saved");
            snippetResponse.setName(savedSnippet.getName());
            snippetResponse.setId(savedSnippet.getId());
            snippetResponse.setTitle(snippet.getTitle());

            if (snippet.getFolder() != null) {
                snippetResponse.setFolderId(snippet.getFolder().getId());
            }

            return ResponseEntity.ok().body(snippetResponse);
        } else {
            return ResponseEntity.badRequest().body(new SnippetResponse("Invalid request"));
        }
    }


    @Transactional
    public ResponseEntity<ApiResponse> moveSnippet(Long userId, Long snippetId, SnippetRequest request) {
        Optional<Snippet> snippetOpt = snippetRepo.findById(snippetId);

        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();
        User userSnippet = snippet.getUser();

        if (!userSnippet.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        if (request.getFolderId() == null) {
            snippetRepo.moveSnippet(null, snippetId);
            return ResponseEntity.ok().body(new ApiResponse("Snippet successfully moved"));
        }

        Optional<Folder> folderOpt = folderRepo.findById(request.getFolderId());

        if (folderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Folder folder = folderOpt.get();
        User userFolder = folder.getUser();

        if (!userFolder.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        snippetRepo.moveSnippet(folder, snippetId);
        return ResponseEntity.ok().body(new ApiResponse("Snippet successfully moved"));

    }


    @Transactional
    public ResponseEntity<ApiResponse> deleteSnippet(Long userId, Long snippetId) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();
        snippet.setIsDeleted(true);
        snippet.setDeletedAt(LocalDateTime.now());
        snippetRepo.save(snippet);

        return ResponseEntity.ok().body(new ApiResponse("Snippet moved to trash"));
    }


    @Transactional
    public ResponseEntity<ApiResponse> permanentlyDeleteSnippet(Long userId, Long snippetId) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();

        if (!Boolean.TRUE.equals(snippet.getIsDeleted())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Snippet is not in trash"));
        }

        snippetRepo.delete(snippet);

        return ResponseEntity.ok().body(new ApiResponse("Snippet permanently deleted"));
    }


    public List<SnippetResponse> getSnippets(Long userId, ItemView view) {
        List<Snippet> snippets;

        switch (view) {
            case ALL -> snippets = snippetRepo.findByUserIdAndIsDeletedFalse(userId);
            case PINNED -> snippets = snippetRepo.findStarredSnippets(userId);
            case SHARED -> snippets = snippetRepo.findByUserIdAndIsSharedTrueAndIsDeletedFalse(userId);
            case DELETED -> snippets = snippetRepo.findDeletedSnippets(userId, LocalDateTime.now().minusDays(30));
            default -> throw new IllegalArgumentException("Invalid view");
        }


        return snippets.stream()
                .map(this::toSnippetResponse)
                .toList();
    }


    public SnippetResponse toSnippetResponse(Snippet snippet) {
        SnippetResponse snippetResponse = new SnippetResponse();
        if (snippet.getFolder() != null) {
            Folder folder = snippet.getFolder();
            snippetResponse.setFolderId(folder.getId());
        }

        snippetResponse.setId(snippet.getId());
        snippetResponse.setName(snippet.getName());
        snippetResponse.setBody(snippet.getBody());
        snippetResponse.setTitle(snippet.getTitle());
        snippetResponse.setIsPinned(snippet.getIsPinned());
        snippetResponse.setTags(snippet.getTags());
        snippetResponse.setIsDeleted(snippet.getIsDeleted());

        if (snippet.getIsDeleted()) {
            Long days = 30 -ChronoUnit.DAYS.between(snippet.getDeletedAt(), LocalDateTime.now());
            snippetResponse.setDaysRemaining(days);
        }
        return snippetResponse;
    }


    @Transactional
    public ResponseEntity<ApiResponse> updateSnippetPinStatus(Long userId, Long snippetId) {
        Optional<Snippet> snippetOpt = snippetRepo.findById(snippetId);

        if (snippetOpt.isPresent()) {
            Snippet snippet = snippetOpt.get();
            User user = snippet.getUser();

            if (user.getId() == userId) {
                Boolean pinStatus = !Boolean.TRUE.equals(snippet.getIsPinned());
                snippetRepo.updatePinStatus(pinStatus, snippetId);
                return ResponseEntity.ok().body(new ApiResponse("Snippet successfully updated"));
            }
        }
        return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
    }




    public ResponseEntity<SnippetResponse> updateSnippet(Long userId, SnippetRequest request) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, request.getId());

        if (snippetOpt.isPresent()) {
            Snippet snippet = snippetOpt.get();
            snippet.setName(request.getName());
            snippet.setBody(request.getBody());
            snippet.setTitle(request.getTitle());


            if (request.getFolderId() != null) {
                Optional<Folder> folderOpt = folderRepo.findById(request.getFolderId());

                if (folderOpt.isPresent()) {
                    snippet.setFolder(folderOpt.get());
                }
            }

            List<String> tags = request.getTags();

            if (tags == null) {
                tags = new ArrayList<>();
            }

            if (tags.size() > 5) {
                return ResponseEntity.badRequest().body(new SnippetResponse("Tag limit exceeded"));
            }

            snippet.setTags(tags);

            snippetRepo.save(snippet);
            SnippetResponse snippetRes = new SnippetResponse();
            snippetRes.setId(snippet.getId());

            if (snippet.getFolder() != null) {
                snippetRes.setFolderId(snippet.getFolder().getId());
            }

            snippetRes.setName(snippet.getName());
            snippetRes.setTitle(snippet.getTitle());
            snippetRes.setBody(snippet.getBody());
            snippetRes.setTags(snippet.getTags());

            snippetRes.setMessage("Snippet updated");

            return ResponseEntity.ok().body(snippetRes);
        } else {
            return ResponseEntity.badRequest().body(new SnippetResponse("Could not update snippet"));
        }
    }


    public ResponseEntity<ApiResponse> recoverSnippet(Long userId, Long snippetId) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);
        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();
        snippet.setDeletedAt(null);
        snippet.setIsDeleted(false);
        snippetRepo.save(snippet);

        return ResponseEntity.ok().body(new ApiResponse("Snippet successfully recovered"));
    }




    public ResponseEntity<ApiResponse> renameSnippet(Long userId, Long snippetId, SnippetRequest request) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();
        snippet.setName(request.getName());
        snippetRepo.save(snippet);
        return ResponseEntity.ok().body(new ApiResponse("Snippet successfully updated"));
    }



    @Transactional
    public ResponseEntity<SnippetResponse> copySnippet(Long userId,
                                                       Long snippetId,
                                                       SnippetRequest request) {

        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new SnippetResponse("Invalid request"));
        }

        Snippet original = snippetOpt.get();

        Snippet copy = new Snippet();
        SnippetResponse response = new SnippetResponse();

        copy.setUser(original.getUser());
        copy.setName(request.getName());
        copy.setIsPinned(original.getIsPinned());
        copy.setTitle(original.getTitle());
        copy.setBody(original.getBody());
        copy.setTags(original.getTags());
        copy.setTags(new ArrayList<>(original.getTags()));
        if (request.getFolderId() != null) {
            Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, request.getFolderId());
            folderOpt.ifPresent(copy::setFolder);
        }

        Snippet savedSnippet = snippetRepo.save(copy);

        response.setId(savedSnippet.getId());
        response.setName(savedSnippet.getName());
        response.setIsPinned(savedSnippet.getIsPinned());
        response.setTitle(savedSnippet.getTitle());
        response.setBody(savedSnippet.getBody());
        response.setTags(savedSnippet.getTags());


        if (request.getFolderId() != null) {
            Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, request.getFolderId());
            folderOpt.ifPresent(folder -> response.setFolderId(folder.getId()));
        }

        return ResponseEntity.ok().body(response);
    }
}



