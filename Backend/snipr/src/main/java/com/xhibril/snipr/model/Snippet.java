package com.xhibril.snipr.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Snippet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "folder_id", nullable = true)
    private Folder folder;

    private String fileName;
    private String body;
    private String title;
    private Boolean isPinned = false;

    @Column(name = "tag_amount")
    private Integer tagAmount;

    private Boolean isDeleted = false;


    private Boolean isShared = false;

    private LocalDateTime deletedAt;






    @ElementCollection
    private List<String> tags = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Folder getFolder() {
        return folder;
    }

    public void setFolder(Folder folder) {
        this.folder = folder;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public void setIsPinned(Boolean isPinned){
        this.isPinned = isPinned;
    }

    public Boolean getIsPinned(){
        return isPinned;
    }


    public Boolean getIsDeleted(){
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted){
        this.isDeleted = isDeleted;
    }

    public void setTagAmount(Integer tagAmount){
        this.tagAmount = tagAmount;
    }

    public Integer getTagAmount(){
        return tagAmount;
    }


    public Boolean getIsShared(){
        return isShared;
    }

    public void setIsShared(Boolean isShared){
        this.isShared = isShared;
    }
    

    public void setDeletedAt(LocalDateTime deletedAt){
        this.deletedAt = deletedAt;
    }

    public LocalDateTime getDeletedAt(){
        return deletedAt;
    }
}

