package com.xhibril.snipr.dto.snippet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class SnippetRequests {

    public SnippetRequests(){}

    public record Create(
            @NotBlank(message = "Enter a file name")
            @Size(max = 255, message = "File name cannot be more than 255 characters")
             String name,
             Long folderId
    ){}


    public record Move(Long folderId){}

    public record Rename(
            @NotBlank(message = "Enter a file name")
            @Size(max = 255, message = "File name cannot be more than 255 characters")
            String name,
            Long folderId
    ) {}


    public record Update(
            @NotNull(message = "Invalid request") Long id,
            @Size(max = 120, message = "File title cannot be more than 120 characters") String title,
            @Size(max = 100000, message = "File body limit exceeded") String body,
            List<@NotBlank(message = "Enter a tag name")
                        @Pattern(regexp = "[A-Za-z]+", message = "Enter a valid tag") String> tags

    ) {}


    public record Pin(
            Long isPinned
    ){}


    public record Copy(
            @NotBlank(message = "Enter a file name")
            @Size(max = 255, message = "File name cannot be more than 255 characters")
            String name,
            Long folderId
    ) {}


}
