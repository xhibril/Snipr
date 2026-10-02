package com.xhibril.snipr.model;

import jakarta.persistence.*;

@Entity
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private Boolean isPinned;

    private Boolean isDeleted;
    private Boolean isShared;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getName() { return name; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setName(String name) { this.name = name; }


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


    public void setIsShared(Boolean isShared){
        this.isShared = isShared;
    }

    public Boolean getIsShared(){
        return isShared;
    }
}
