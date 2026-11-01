package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<User> {

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User u = new User();
        u.setId(rs.getLong("id"));
        u.setName(rs.getString("name"));
        u.setAge(rs.getInt("age"));
        u.setDateCreated(rs.getDate("date_created").toLocalDate());
        u.setDesignation(rs.getString("designation"));
        u.setEmail(rs.getString("email"));
        u.setMobile(rs.getLong("mobile"));
        u.setPassword(rs.getString("password"));
        u.setStatus(rs.getString("status"));
        return u;
    }
}
