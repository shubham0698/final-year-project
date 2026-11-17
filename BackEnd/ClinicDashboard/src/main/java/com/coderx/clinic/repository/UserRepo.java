package com.coderx.clinic.repository;

import com.coderx.clinic.DTO.Login;
import com.coderx.clinic.Entity.User;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Repository
public class UserRepo {
    private final JdbcTemplate jdbcTemplate;

    public UserRepo(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public int save(User u){
        String sql = """
                INSERT INTO USER
                (FULL_NAME,DATE_CREATED,EMAIL, PHONE, PASSWORD, ROLE, STATUS)
                VALUES (?,?,?,?,?,?,?)
                """;
        try {
            return jdbcTemplate.update(sql,u.getFullName(),u.getDateCreated(),u.getEmail(),u.getPhone(),u.getPassword()
                    ,"Student","pending");
        }
        catch (DataAccessException e){
            System.out.println(e.getMessage());
            return -1;
        }
    }
    private String createSession(Long id) throws SQLException{
        String query = """
                INSERT INTO SESSION VALUES (?,?,CURRENT_TIMESTAMP);
                """;
        String token = UUID.randomUUID().toString();
        int row = jdbcTemplate.update(query,id,token);
//        System.out.println("row count "+ row);
        if(row>0) return token;


        else throw new SQLException(" ");
    }

    public String  login(Login login){
        String query = "select id from user where email= ? and password = ?";
        try{
            Long id = jdbcTemplate.queryForObject(query,Long.class,login.getEmail(),login.getPassword());
            return createSession(id);
        }
        catch (Exception e ){
            System.out.println(e.getMessage());
            return null;
        }
    }

    public List<User> getAll(){
        String sql = "SELECT * FROM USER";

        return jdbcTemplate.query(sql,new UserRowMapper());

    }


}
