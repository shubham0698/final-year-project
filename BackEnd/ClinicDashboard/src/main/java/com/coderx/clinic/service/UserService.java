package com.coderx.clinic.service;

import com.coderx.clinic.Entity.User;
import com.coderx.clinic.repository.UserRepo;
import com.coderx.clinic.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {

    static Long id = 1L;
    private final UserRepository userRepository;
    private final UserRepo userRepo;

    public UserService(UserRepository userRepository, UserRepo userRepo){
        this.userRepository = userRepository;
        this.userRepo = userRepo;
    }

    public int createUser(User u){
        u.setStatus("pending");
//        u.setId(++id);
        u.setDateCreated(LocalDate.now());
        return userRepo.save(u);

    }

    public List<User> getAll(){
        return userRepo.getAll();
    }

}
