package com.kanban.server.models.user;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="Users")
@Table(name="Users",uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class UserDAO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String avatarSrc;
}
