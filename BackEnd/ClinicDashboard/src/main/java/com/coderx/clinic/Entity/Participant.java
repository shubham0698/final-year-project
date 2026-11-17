package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "participants")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participant_code", nullable = false, unique = true)
    private String participantCode;

    private Long trialId;
    private String trialCode;
    private String fullName;
    private Integer age;
    private String gender;
    private String contactNumber;

    private String status; // Screened, Eligible, Consented, Randomized, Active, Completed, Withdrawn
    private String consentStatus; // Signed, Pending, Withdrawn
    private LocalDate consentDate;

    private String doshaType; // Vata, Pitta, Kapha, Vata-Pitta, Pitta-Kapha, Tridoshic
    private String randomizedGroup; // Group A (Intervention), Group B (Control)
    private LocalDate enrollmentDate;

    public Participant() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getParticipantCode() {
        return participantCode;
    }
    public void setParticipantCode(String participantCode) {
        this.participantCode = participantCode;
    }
    public Long getTrialId() {
        return trialId;
    }
    public void setTrialId(Long trialId) {
        this.trialId = trialId;
    }
    public String getTrialCode() {
        return trialCode;
    }
    public void setTrialCode(String trialCode) {
        this.trialCode = trialCode;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getContactNumber() {
        return contactNumber;
    }
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getConsentStatus() {
        return consentStatus;
    }
    public void setConsentStatus(String consentStatus) {
        this.consentStatus = consentStatus;
    }
    public LocalDate getConsentDate() {
        return consentDate;
    }
    public void setConsentDate(LocalDate consentDate) {
        this.consentDate = consentDate;
    }
    public String getDoshaType() {
        return doshaType;
    }
    public void setDoshaType(String doshaType) {
        this.doshaType = doshaType;
    }
    public String getRandomizedGroup() {
        return randomizedGroup;
    }
    public void setRandomizedGroup(String randomizedGroup) {
        this.randomizedGroup = randomizedGroup;
    }
    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }
    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
}

