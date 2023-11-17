package com.kanban.server.services;

import com.kanban.server.models.user.UserDAO;
import com.kanban.server.models.user.UserDTO;
import com.kanban.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
//    @Autowired
//    PasswordEncoder passwordEncoder;

    public UserDAO loadUserByUsername(String username){
        return userRepository.findByEmail(username);
    }
    public UserDAO loadUserById(Long id){
        return userRepository.findById(id).get();
    }
    public UserDAO save(UserDAO user){
        UserDAO userDAO=UserDAO.builder().email(user.getEmail()).name(user.getName()).avatarSrc(user.getAvatarSrc()).password(new BCryptPasswordEncoder().encode(user.getPassword())).build();
//        UserDAO savedUser= userRepository.save(user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()))));

        return userRepository.save(userDAO);
    }
    public List<UserDTO> getUsers(){
        List<UserDTO> userDTOS= new ArrayList<>();
        userRepository.findAll().forEach(userDAO ->
                userDTOS.add(UserDTO.builder().id(userDAO.getId()).email(userDAO.getEmail()).name(userDAO.getName()).avatarSrc(userDAO.getAvatarSrc()).build()
                ));
        return userDTOS;
    }



}