package com.kanban.server.controllers;

import com.kanban.server.config.JwtTokenUtil;
import com.kanban.server.models.JwtResponse;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;
    private final String UPLOAD_DIR = "./uploads/";

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
            JwtResponse jwtResponse = jwtTokenUtil.getToken(principal);
            UserDTO user=UserDTO.builder().avatarSrc(principal.getAvatarSrc()).email(principal.getEmail()).name(principal.getName()).id(principal.getId()).token(jwtResponse.getToken()).build();
            return ResponseEntity.ok(user);
        }catch (Exception e){
            System.out.println(e);
            return ResponseEntity.badRequest().body("Invalid Credentials");
        }

    }
    @GetMapping("/getUsers")
    public ResponseEntity<?> addUser() {

        return ResponseEntity.ok(jwtUserDetailsService.getUsers());

    }
    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(jwtUserDetailsService.loadUserById(id));
    }
    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(@RequestPart("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        try {
            // Ensure the directory exists
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Construct a file path
            Path filePath = Paths.get(UPLOAD_DIR, file.getOriginalFilename());

            // Write the file to the directory
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("File uploaded successfully: " + filePath);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Could not upload the file");
        }
    }
}
