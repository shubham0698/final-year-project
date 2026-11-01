package com.coderx.clinic.Contrller.auth;

import com.coderx.clinic.DTO.Login;
import com.coderx.clinic.DTO.LoginDTO;
import com.coderx.clinic.Entity.User;
import com.coderx.clinic.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/auth")
public class UserController {
    private final UserService userService;

    public UserController (UserService userService){
        this.userService = userService;
    }

    //login api

    @PostMapping("/login")
    public ResponseEntity<LoginDTO> login(@RequestBody Login data){
        if(data == null || data.getEmail() == null || data.getPassword()==null){
            return ResponseEntity.status(400).build();
        }
        String token = UUID.randomUUID().toString();
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setMessage("login successful");
        loginDTO.setToken(token);
        System.out.println("login request accepted ");
        System.out.println(data);
        return ResponseEntity.ok(loginDTO);
    }


//    @PostMapping("/create")
//    public ResponseEntity<Boolean> create(@RequestBody User u){
////        User u = new User();
////        u.setAge(19);
////        u.setDateCreated(LocalDate.now());
////        u.setDesignation("student");
////        u.setEmail("shubham@gamil.com");
////        u.setId(1L);
////        u.setMobile(31231234L);
////        u.setPassword("shubham@123");
////        u.setStatus("pending");
////
////        userRepository.save(u);
//        if(u == null){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
//        }
//
//        int result = userService.createUser(u);
//
//        if(result<1){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
//        }
//        return ResponseEntity.status(201).body(true);
//
//    }


    //Registration api

    @PostMapping("/create")
    public ResponseEntity<Boolean> create(HttpServletRequest request) throws IOException {
        BufferedReader br =  request.getReader();
        StringBuilder body =new StringBuilder();
        String line = br.readLine();
        while(line != null){
            body = body.append(line);
            line = br.readLine();
        }

        System.out.println("registration request accepted");
        System.out.println(body);

        return ResponseEntity.status(201).body(true);


    }

    @GetMapping
    public void login(@RequestBody LoginDTO loginDTO){

    }

    @GetMapping("/user/all")
    public ResponseEntity<List<User>> getAll(){
        List<User> ls = userService.getAll();

        if(ls != null && !ls.isEmpty()){
            return ResponseEntity.status(200).body(ls);
        }
        return ResponseEntity.notFound().build();
    }




}
