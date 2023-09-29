package com.kanban.server.services;

import com.kanban.server.models.user.UserDAO;
import com.kanban.server.models.user.UserDTO;
import com.kanban.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
//    @Autowired
//    private PasswordEncoder passwordEncoder;

    public UserDTO loadUserByUsername(String username){
        UserDAO user = userRepository.findByEmail(username);
        return UserDTO.builder().email(user.getEmail()).build();

    }
    public UserDTO save(UserDTO user){
        UserDAO userDAO = UserDAO.builder()
                .email(user.getEmail())
                .password(new BCryptPasswordEncoder().encode(user.getPassword()))
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarSrc(user.getAvatarSrc())
                .build();
        userDAO= userRepository.save(userDAO);
        return UserDTO.builder()
                .email(userDAO.getEmail())
                .firstName(userDAO.getFirstName())
                .lastName(userDAO.getLastName())
                .avatarSrc(userDAO.getAvatarSrc())
                .build();
    }

}