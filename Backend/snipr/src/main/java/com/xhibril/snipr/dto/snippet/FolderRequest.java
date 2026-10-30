package com.xhibril.snipr.dto.snippet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FolderRequest {

    private Long id;


    @NotBlank(message = "Enter a folder name")
    @Size(max = 255, message = "Folder name cannot be more than 255 characters")
    private String name;

    private Long folderId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }
}