package com.xhibril.snipr.service;
import com.xhibril.snipr.dto.api.ApiResponse;
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
            folderResponse.setId(folderSaved.getId());
            folderResponse.setMessage("Folder successfully created");

            return ResponseEntity.ok().body(folderResponse);
        } else {
            return ResponseEntity.badRequest().body(new FolderResponse("Invalid request"));
        }
    }


    public ResponseEntity<SnippetResponse> addSnippet(Long userId, String title,
                                                      String code, String description,
                                                      List<String> tags) {

        Optional<User> userOpt = userRepo.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Snippet snippet = new Snippet();

            snippet.setUser(user);
            snippet.setTitle(title);
            snippet.setCode(code);
            snippet.setDescription(description);
            snippet.setTags(tags);

            Snippet savedSnippet = snippetRepo.save(snippet);

            SnippetResponse snippetResponse = new SnippetResponse();
            snippetResponse.setMessage("Snippet successfully saved");
            snippetResponse.setId(savedSnippet.getId());

            return ResponseEntity.ok().body(snippetResponse);
        } else {
            return ResponseEntity.badRequest().body(new SnippetResponse("Invalid request"));
        }
    }


    @Transactional
    public ResponseEntity<ApiResponse> moveSnippet(Long userId, Long snippetId, Long folderId) {
        Optional<Snippet> snippetOpt = snippetRepo.findById(snippetId);
        Optional<Folder> folderOpt = folderRepo.findById(folderId);

        if (snippetOpt.isPresent() && folderOpt.isPresent()) {
            Snippet snippet = snippetOpt.get();
            Folder folder = folderOpt.get();

            User userSnippet = snippet.getUser();
            User userFolder = folder.getUser();

            // check if user owns the snippet n folder
            if (!(userSnippet.getId().equals(userId) && userFolder.getId().equals(userId))) {
                return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
            }

            snippetRepo.moveSnippet(folder, snippetId);
            return ResponseEntity.ok().body(new ApiResponse("Snippet successfully moved"));

        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }
    }


    @Transactional
    public ResponseEntity<ApiResponse> deleteSnippet(Long userId, Long snippetId) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if (snippetOpt.isPresent()) {
            snippetRepo.deleteById(snippetId);

            return ResponseEntity.ok().body(new ApiResponse("Snippet deleted"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }
    }

    @Transactional
    public ResponseEntity<ApiResponse> deleteFolder(Long userId, Long folderId) {
        Optional<Folder> folderOpt = folderRepo.findByUserIdAndId(userId, folderId);

        if (folderOpt.isPresent()) {
            // delete all snippets inside of folder
            snippetRepo.deleteByUserIdAndFolderId(userId, folderId);

            folderRepo.deleteById(folderId);

            return ResponseEntity.ok().body(new ApiResponse("Successfully deleted"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }
    }


    public ResponseEntity<ApiResponse> addTag(Long userId, Long snippetId, String tag) {
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if (snippetOpt.isPresent()) {
            Snippet snippet = snippetOpt.get();
            if (tag == null) {
                return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
            }

            if(snippet.getTags().contains(tag)){
                return ResponseEntity.badRequest().body(new ApiResponse("Tag already exists"));
            }

            snippet.getTags().add(tag);
            snippetRepo.save(snippet);
            return ResponseEntity.ok().body(new ApiResponse("Tag added"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }
    }

    public ResponseEntity<ApiResponse> deleteTag(Long userId, Long snippetId, String tag){
        Optional<Snippet> snippetOpt = snippetRepo.findByUserIdAndId(userId, snippetId);

        if(snippetOpt.isPresent()){
            Snippet snippet = snippetOpt.get();

            snippet.getTags().remove(tag);
            snippetRepo.save(snippet);
            return ResponseEntity.ok().body(new ApiResponse("Tag deleted"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse("Invalid request"));
        }
    }

    public List<FolderResponse> getFolders(Long userId){
        List<Folder> folders = folderRepo.findByUserId(userId);
        List<FolderResponse> foldersToReturn = new ArrayList<>();


        for(Folder folder : folders){
            FolderResponse folderRequest = new FolderResponse();
            folderRequest.setId(folder.getId());
            folderRequest.setName(folder.getName());
            foldersToReturn.add(folderRequest);
        }

        return foldersToReturn;
    }

    public List<SnippetResponse> getSnippets(Long userId){
        List<Snippet> snippets =  snippetRepo.findByUserId(userId);
        List<SnippetResponse> snippetsToReturn = new ArrayList<>();

        for(Snippet snippet : snippets){
            SnippetResponse snippetResponse = new SnippetResponse();

            if(snippet.getFolder()!= null){
                Folder folder = snippet.getFolder();
                snippetResponse.setFolderId(folder.getId());
            }

            snippetResponse.setId(snippet.getId());
            snippetResponse.setTitle(snippet.getTitle());
            snippetResponse.setCode(snippet.getCode());
            snippetResponse.setDescription(snippet.getDescription());
            snippetsToReturn.add(snippetResponse);
        }

        return snippetsToReturn;
    }
}
