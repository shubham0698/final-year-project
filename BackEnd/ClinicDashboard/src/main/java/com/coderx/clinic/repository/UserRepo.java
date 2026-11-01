package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepo {
    private final JdbcTemplate jdbcTemplate;

    public UserRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(User u){
        String sql = """
                INSERT INTO USER
                VALUES(?,?,?,?,?,?,?,?,?)
                """;
        return jdbcTemplate.update(sql,u.getId(),u.getName(),u.getAge(),u.getDateCreated(),
                u.getDesignation(),u.getEmail(),u.getMobile(),u.getPassword(),
                u.getStatus());
    }

    public List<User> getAll(){
        String sql = "SELECT * FROM USER";

        return jdbcTemplate.query(sql,new UserRowMapper());

    }


}
