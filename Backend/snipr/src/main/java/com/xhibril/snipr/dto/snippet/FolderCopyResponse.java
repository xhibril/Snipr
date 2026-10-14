package com.xhibril.snipr.dto.snippet;

import com.xhibril.snipr.model.Folder;
import com.xhibril.snipr.model.Snippet;

import java.util.List;

public class FolderCopyResponse {

    private Folder folder;
    private List<Snippet> snippets;
    private String message;


    public FolderCopyResponse(Folder folder, List<Snippet> snippets) {
        this.folder = folder;
        this.snippets = snippets;
    }

    public FolderCopyResponse(String message){
        this.message = message;
    }

    public Folder getFolder() {
        return folder;
    }

    public List<Snippet> getSnippets() {
        return snippets;
    }

    public void setMessage(String message){
        this.message= message;
    }

    public String getMessage(){
        return message;
    }
}