package com.xhibril.snipr.service;

import com.xhibril.snipr.dto.api.ApiResponse;
import com.xhibril.snipr.dto.snippet.FolderResponse;
import com.xhibril.snipr.dto.snippet.SnippetRequest;
import com.xhibril.snipr.dto.snippet.SnippetResponse;
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


    public ResponseEntity<FolderResponse> addFolder(Long userId, String folderName) {
        Optional<User> userOpt = userRepo.findById(userId);
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndName(userId, folderName);

        if (folderOpt.isPresent()) {
            return ResponseEntity.badRequest().body(new FolderResponse("Folder already exists"));
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Folder folder = new Folder();
            folder.setUser(user);
            folder.setName(folderName);

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


    public ResponseEntity<SnippetResponse> addSnippet(Long userId, String fileName, Long folderId) {

        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Snippet snippet = new Snippet();

            snippet.setUser(user);
            snippet.setFileName(fileName);
            snippet.setTitle("Untitled");
            snippet.setTagAmount(0);

            if (folderId != null) {
                Optional<Folder> folderOpt = folderRepo.findById(folderId);

                if (folderOpt.isPresent()) {
                    Folder folder = folderOpt.get();
                    snippet.setFolder(folder);
                }
            }

            Snippet savedSnippet = snippetRepo.save(snippet);

            SnippetResponse snippetResponse = new SnippetResponse();
            snippetResponse.setMessage("Snippet successfully saved");
            snippetResponse.setName(savedSnippet.getFileName());
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
    public ResponseEntity<ApiResponse> moveSnippet(Long userId, Long snippetId, Long folderId) {
        Optional<Snippet> snippetOpt = snippetRepo.findById(snippetId);

        if (snippetOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();
        User userSnippet = snippet.getUser();

        if (!userSnippet.getId().equals(userId)) {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        if (folderId == null) {
            snippetRepo.moveSnippet(null, snippetId);
            return ResponseEntity.ok().body(new ApiResponse("Snippet successfully moved"));
        }

        Optional<Folder> folderOpt = folderRepo.findById(folderId);

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

        if(snippetOpt.isEmpty()){
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();
        snippet.setIsDeleted(true);
        snippetRepo.save(snippet);

        return ResponseEntity.ok().body(new ApiResponse("Snippet moved to trash"));
    }


    @Transactional
    public ResponseEntity<ApiResponse> permanentlyDeleteSnippet(Long userId, Long snippetId){
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if(snippetOpt.isEmpty()){
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Snippet snippet = snippetOpt.get();

        if(!Boolean.TRUE.equals(snippet.getIsDeleted())){
            return ResponseEntity.badRequest().body(new ApiResponse("Snippet is not in trash"));
        }

        snippetRepo.delete(snippet);

        return ResponseEntity.ok().body(new ApiResponse("Snippet permanently deleted"));
    }



    @Transactional
    public ResponseEntity<ApiResponse> deleteFolder(Long userId, Long folderId) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);

        if(folderOpt.isEmpty()){
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Folder folder = folderOpt.get();

        folder.setIsDeleted(true);
        folderRepo.save(folder);
        snippetRepo.updateDeletedByUserIdAndFolderId(userId, folderId, true);

        return ResponseEntity.ok().body(new ApiResponse("Folder moved to trash"));
    }


    @Transactional
    public ResponseEntity<ApiResponse> permanentlyDeleteFolder(Long userId, Long folderId){
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);

        if(folderOpt.isEmpty()){
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }

        Folder folder = folderOpt.get();

        if(!Boolean.TRUE.equals(folder.getIsDeleted())){
            return ResponseEntity.badRequest().body(new ApiResponse("Folder is not in trash"));
        }

        snippetRepo.deleteByUserIdAndFolderId(userId, folderId);
        folderRepo.delete(folder);

        return ResponseEntity.ok().body(new ApiResponse("Folder permanently deleted"));
    }

    public List<FolderResponse> getFolders(Long userId, Boolean shared, Boolean starred, Boolean deleted) {
        List<Folder> folders;

        if (Boolean.TRUE.equals(starred)) {
            folders = folderRepo.findByUserIdAndIsPinned(userId, true);
        } else if (Boolean.TRUE.equals(shared)) {
            folders = folderRepo.findByUserIdAndIsShared(userId, true);
        } else if (Boolean.TRUE.equals(deleted)) {
            folders = folderRepo.findByUserIdAndIsDeleted(userId, true);
        } else {
            folders = folderRepo.findByUserIdAndIsDeletedFalse(userId);
        }


        return folders.stream()
                .map(this::toFolderResponse)
                .toList();
    }


    public FolderResponse toFolderResponse(Folder folder){
        FolderResponse folderResponse = new FolderResponse();
        folderResponse.setId(folder.getId());
        folderResponse.setName(folder.getName());
        folderResponse.setIsPinned(folder.getIsPinned());
        return folderResponse;
    }





    public List<SnippetResponse> getSnippets(Long userId, Boolean shared, Boolean starred, Boolean deleted) {
        List<Snippet> snippets;

        if (Boolean.TRUE.equals(starred)) {
            snippets = snippetRepo.findByUserIdAndIsPinned(userId, true);
        } else if (Boolean.TRUE.equals(shared)) {
            snippets = snippetRepo.findByUserIdAndIsShared(userId, true);
        } else if (Boolean.TRUE.equals(deleted)) {
            snippets = snippetRepo.findByUserIdAndIsDeleted(userId, true);
        } else {
            snippets = snippetRepo.findByUserIdAndIsDeletedFalse(userId);
        }


        return snippets.stream()
                .map(this::toSnippetResponse)
                .toList();
    }


    public SnippetResponse toSnippetResponse(Snippet snippet){
        SnippetResponse snippetResponse = new SnippetResponse();
        if (snippet.getFolder() != null) {
            Folder folder = snippet.getFolder();
            snippetResponse.setFolderId(folder.getId());
        }

        snippetResponse.setId(snippet.getId());
        snippetResponse.setName(snippet.getFileName());
        snippetResponse.setBody(snippet.getBody());
        snippetResponse.setTitle(snippet.getTitle());
        snippetResponse.setIsPinned(snippet.getIsPinned());
        snippetResponse.setTags(snippet.getTags());
        snippetResponse.setTagAmount(snippet.getTagAmount());


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


    public ResponseEntity<SnippetResponse> updateSnippet(Long userId, SnippetRequest request) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, request.getId());

        if (snippetOpt.isPresent()) {
            Snippet snippet = snippetOpt.get();
            snippet.setFileName(request.getName());
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

            if (snippet.getTags().size() != snippet.getTagAmount()) {
                snippet.setTagAmount(snippet.getTags().size());
            }

            snippetRepo.save(snippet);
            SnippetResponse snippetRes = new SnippetResponse();
            snippetRes.setId(snippet.getId());

            if (snippet.getFolder() != null) {
                snippetRes.setFolderId(snippet.getFolder().getId());
            }

            snippetRes.setName(snippet.getFileName());
            snippetRes.setTitle(snippet.getTitle());
            snippetRes.setBody(snippet.getBody());
            snippetRes.setTags(snippet.getTags());
            snippetRes.setTagAmount(snippet.getTagAmount());
            snippetRes.setMessage("Snippet updated");

            return ResponseEntity.ok().body(snippetRes);
        } else {
            return ResponseEntity.badRequest().body(new SnippetResponse("Could not update snippet"));
        }
    }
}
