package com.coderx.clinic.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class User {

//    Field	Data type	Purpose
//    id	Long	Primary key
//    firstName	String	First name
//    lastName	String	Last name
//    email	String	Unique email
//    mobileNumber	String	Contact number
//    employeeId	String	Staff identification
//    designation	String	Professional designation
//    password	String	BCrypt password hash
//    status	Enum	ACTIVE, INACTIVE, PENDING
//    createdAt	LocalDateTime	Account creation
//    updatedAt	LocalDateTime	Last update

    @Id
    Long id;
    String Name;
    String email;
    Long mobile;
    int age;
    String designation;
    String password;
    String status;
    LocalDate dateCreated;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getMobile() {
        return mobile;
    }

    public void setMobile(Long mobile) {
        this.mobile = mobile;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDate dateCreated) {
        this.dateCreated = dateCreated;
    }
}
