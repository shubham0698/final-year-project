package com.coderx.clinic.service;

import com.coderx.clinic.Entity.User;
import com.coderx.clinic.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserService {

    static Long id = 1L;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public boolean createUser(User u){
        u.setStatus("pending");
//        u.setId(++id);
        u.setDateCreated(LocalDate.now());
        userRepository.save(u);
        return true;
    }

}
