package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "trials")
public class Trial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trial_code", nullable = false, unique = true)
    private String trialCode;

    @Column(nullable = false)
    private String title;

    private String phase;
    private String status;
    private String principalInvestigator;
    private String siteLocation;
    private String ctriNumber;

    private LocalDate ethicsApprovalDate;
    private LocalDate startDate;
    private LocalDate endDate;

    private Integer targetEnrollment;
    private Integer currentEnrollment;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Trial() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTrialCode() {
        return trialCode;
    }
    public void setTrialCode(String trialCode) {
        this.trialCode = trialCode;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getPhase() {
        return phase;
    }
    public void setPhase(String phase) {
        this.phase = phase;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getPrincipalInvestigator() {
        return principalInvestigator;
    }
    public void setPrincipalInvestigator(String principalInvestigator) {
        this.principalInvestigator = principalInvestigator;
    }
    public String getSiteLocation() {
        return siteLocation;
    }
    public void setSiteLocation(String siteLocation) {
        this.siteLocation = siteLocation;
    }
    public String getCtriNumber() {
        return ctriNumber;
    }
    public void setCtriNumber(String ctriNumber) {
        this.ctriNumber = ctriNumber;
    }
    public LocalDate getEthicsApprovalDate() {
        return ethicsApprovalDate;
    }
    public void setEthicsApprovalDate(LocalDate ethicsApprovalDate) {
        this.ethicsApprovalDate = ethicsApprovalDate;
    }
    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    public Integer getTargetEnrollment() {
        return targetEnrollment;
    }
    public void setTargetEnrollment(Integer targetEnrollment) {
        this.targetEnrollment = targetEnrollment;
    }
    public Integer getCurrentEnrollment() {
        return currentEnrollment;
    }
    public void setCurrentEnrollment(Integer currentEnrollment) {
        this.currentEnrollment = currentEnrollment;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}

