package com.kanban.server.controllers;

import com.kanban.server.config.JwtTokenUtil;
import com.kanban.server.models.user.UserDAO;
import com.kanban.server.models.user.UserDTO;
import com.kanban.server.services.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDAO userDAO){
//        System.out.println(userDTO);
        try {
            UserDAO user = jwtUserDetailsService.save(userDAO);

            return ResponseEntity.ok(jwtTokenUtil.getToken(user));
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO){
        try {
            System.out.println(userDTO);
            Authentication authentication;
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDAO principal= (UserDAO) authentication.getPrincipal();

            return ResponseEntity.ok(jwtTokenUtil.getToken(principal));
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.badRequest().body("Invalid Credentials");
        }

    }
    @GetMapping("/getUsers")
    public ResponseEntity<?> addUser() {

        return ResponseEntity.ok(jwtUserDetailsService.getUsers());

    }
}
