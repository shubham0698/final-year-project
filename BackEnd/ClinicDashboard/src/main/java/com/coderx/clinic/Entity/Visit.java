package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long participantId;
    private String participantCode;
    private Long trialId;
    private String trialCode;

    private String visitName; // Screening, Baseline, Week 4, Week 8, Close-out
    private String visitType;
    private LocalDate scheduledDate;
    private LocalDate completedDate;
    private String status; // Scheduled, Completed, Missed, Overdue

    private String vitals; // e.g. "BP: 120/80, Pulse: 72, Weight: 68kg"
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    public Visit() {}

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
    public String getVisitName() {
        return visitName;
    }
    public void setVisitName(String visitName) {
        this.visitName = visitName;
    }
    public String getVisitType() {
        return visitType;
    }
    public void setVisitType(String visitType) {
        this.visitType = visitType;
    }
    public LocalDate getScheduledDate() {
        return scheduledDate;
    }
    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }
    public LocalDate getCompletedDate() {
        return completedDate;
    }
    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getVitals() {
        return vitals;
    }
    public void setVitals(String vitals) {
        this.vitals = vitals;
    }
    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
}

