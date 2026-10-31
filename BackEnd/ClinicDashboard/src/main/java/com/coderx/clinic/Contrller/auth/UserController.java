package com.coderx.clinic.Contrller.auth;

import com.coderx.clinic.DTO.LoginDTO;
import com.coderx.clinic.Entity.User;
import com.coderx.clinic.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class UserController {
    private final UserService userService;

    public UserController (UserService userService){
        this.userService = userService;
    }



    @PostMapping("/create")
    public ResponseEntity<Boolean> create(@RequestBody User u){
//        User u = new User();
//        u.setAge(19);
//        u.setDateCreated(LocalDate.now());
//        u.setDesignation("student");
//        u.setEmail("shubham@gamil.com");
//        u.setId(1L);
//        u.setMobile(31231234L);
//        u.setPassword("shubham@123");
//        u.setStatus("pending");
//
//        userRepository.save(u);
        if(u == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }

        boolean result = userService.createUser(u);

        if(!result){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
        return ResponseEntity.status(201).body(true);

    }

    @GetMapping
    public void login(@RequestBody LoginDTO loginDTO){

    }




}
