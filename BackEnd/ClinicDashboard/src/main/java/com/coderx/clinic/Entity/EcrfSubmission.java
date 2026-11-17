package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ecrf_submissions")
public class EcrfSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long participantId;
    private String participantCode;
    private Long trialId;
    private String trialCode;
    private Long visitId;

    private String formTitle; // e.g. "Vitals & Anthropometry", "Ayurvedic Symptom Score", "Safety Assessment"
    private String formType;

    @Column(columnDefinition = "TEXT")
    private String formData; // JSON string of field key-values

    private String status; // Draft, Submitted, Reviewed, Locked
    private String submittedBy;
    private LocalDate submittedAt;

    public EcrfSubmission() {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getParticipantId() {
        return participantId;
    }
    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
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
    public Long getVisitId() {
        return visitId;
    }
    public void setVisitId(Long visitId) {
        this.visitId = visitId;
    }
    public String getFormTitle() {
        return formTitle;
    }
    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }
    public String getFormType() {
        return formType;
    }
    public void setFormType(String formType) {
        this.formType = formType;
    }
    public String getFormData() {
        return formData;
    }
    public void setFormData(String formData) {
        this.formData = formData;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getSubmittedBy() {
        return submittedBy;
    }
    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }
    public LocalDate getSubmittedAt() {
        return submittedAt;
    }
    public void setSubmittedAt(LocalDate submittedAt) {
        this.submittedAt = submittedAt;
    }
}

