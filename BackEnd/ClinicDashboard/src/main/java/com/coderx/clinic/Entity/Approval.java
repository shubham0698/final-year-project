package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "approvals")
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long trialId;
    private String trialCode;
    private String approvalType; // Ethics Committee, CTRI, NDCT Rule 2019, DCGI/CDSCO
    private String referenceNumber;
    private String status; // Approved, Under Review, Expired, Pending
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String documentUrl;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public Approval() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
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
    public String getApprovalType() {
        return approvalType;
    }
    public void setApprovalType(String approvalType) {
        this.approvalType = approvalType;
    }
    public String getReferenceNumber() {
        return referenceNumber;
    }
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDate getIssueDate() {
        return issueDate;
    }
    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    public String getDocumentUrl() {
        return documentUrl;
    }
    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }
    public String getRemarks() {
        return remarks;
    }
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

