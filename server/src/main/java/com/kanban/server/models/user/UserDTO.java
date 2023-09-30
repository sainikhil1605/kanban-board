package com.kanban.server.models.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.UniqueConstraint;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@ToString
@Getter
@Setter
@Builder

public class UserDTO  {
    private long id;
    private String email;
    @JsonIgnore
    private String password;

    private String name;
    private String avatarSrc;
}
