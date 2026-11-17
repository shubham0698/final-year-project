package com.coderx.clinic.service;

import com.coderx.clinic.DTO.Login;
import com.coderx.clinic.Entity.User;
import com.coderx.clinic.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, AuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public int createUser(User u) {
        if (u.getStatus() == null) {
            u.setStatus("Active");
        }
        if (u.getRole() == null) {
            u.setRole("Principal Investigator");
        }
        if (u.getDateCreated() == null) {
            u.setDateCreated(LocalDate.now());
        }
        try {
            User saved = userRepository.save(u);
            auditService.log(saved.getEmail(), saved.getRole(), "USER_REGISTRATION", "Users", String.valueOf(saved.getId()), "User registered: " + saved.getFullName());
            return 1;
        } catch (Exception e) {
            System.err.println("User save error: " + e.getMessage());
            return -1;
        }
    }

    public String login(Login login) {
        if (login == null || login.getEmail() == null || login.getPassword() == null) {
            return null;
        }
        Optional<User> userOpt = userRepository.findByEmail(login.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (login.getPassword().equals(user.getPassword())) {
                String token = "aiia_jwt_" + UUID.randomUUID().toString().replace("-", "");
                auditService.log(user.getEmail(), user.getRole(), "USER_LOGIN", "Authentication", String.valueOf(user.getId()), "Successful login");
                return token;
            }
        }
        return null;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long id, String role) {
        return userRepository.findById(id).map(u -> {
            u.setRole(role);
            User saved = userRepository.save(u);
            auditService.log("Admin", "Admin", "UPDATE_ROLE", "Users", String.valueOf(saved.getId()), "Updated role to: " + role);
            return saved;
        }).orElse(null);
    }

    public User updateUserStatus(Long id, String status) {
        return userRepository.findById(id).map(u -> {
            u.setStatus(status);
            User saved = userRepository.save(u);
            auditService.log("Admin", "Admin", "UPDATE_STATUS", "Users", String.valueOf(saved.getId()), "Updated status to: " + status);
            return saved;
        }).orElse(null);
    }
}
