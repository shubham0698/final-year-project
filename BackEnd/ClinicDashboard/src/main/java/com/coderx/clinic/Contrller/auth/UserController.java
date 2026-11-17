package com.coderx.clinic.Contrller.auth;

import com.coderx.clinic.DTO.Login;
import com.coderx.clinic.DTO.LoginDTO;
import com.coderx.clinic.Entity.User;
import com.coderx.clinic.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Login API
    @PostMapping("/auth/login")
    public ResponseEntity<LoginDTO> login(@RequestBody Login data) {
        if (data == null || data.getEmail() == null || data.getPassword() == null) {
            return ResponseEntity.status(400).build();
        }
        String token = userService.login(data);
        if (token == null) {
            LoginDTO loginDTO = new LoginDTO();
            loginDTO.setToken(null);
            loginDTO.setMessage("Invalid credentials. Please verify your email and password.");
            return ResponseEntity.status(401).body(loginDTO);
        }

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setMessage("Login successful");
        loginDTO.setToken(token);
        return ResponseEntity.ok(loginDTO);
    }

    // Registration API
    @PostMapping("/auth/create")
    public ResponseEntity<Boolean> create(@RequestBody User user) {
        if (user == null || !user.checkNull()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        user.setDateCreated(LocalDate.now());
        int count = userService.createUser(user);

        if (count > 0) {
            return ResponseEntity.status(201).body(true);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    // User Management APIs
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        User updated = userService.updateUserRole(id, role);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        User updated = userService.updateUserStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
}
