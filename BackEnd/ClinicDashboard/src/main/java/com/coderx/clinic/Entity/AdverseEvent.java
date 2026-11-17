package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "adverse_events")
public class AdverseEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long trialId;
    private String trialCode;
    private Long participantId;
    private String participantCode;

    @Column(nullable = false)
    private String eventTerm; // e.g., "Severe Headache", "Nausea", "Hyperacidity"

    private LocalDate onsetDate;
    private LocalDate resolvedDate;

    private String severity; // Mild, Moderate, Severe, Life-Threatening
    private Boolean isSae; // Serious Adverse Event true/false
    private String seriousnessCriteria; // Hospitalization, Life Threatening, Disability, Congenital Anomaly, Death
    private String causality; // Definite, Probable, Possible, Unlikely, Not Related
    private String outcome; // Recovered, Recovering, Ongoing, Fatal
    private LocalDate reportedDate;

    // Regulatory requirement: New Drugs and Clinical Trials Rules 2019 reporting compliance
    private Boolean ndctReported; 
    private String actionTaken; // Dose reduced, Drug interrupted, Drug withdrawn, None

    @Column(columnDefinition = "TEXT")
    private String details;

    public AdverseEvent() {}

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
    public String getEventTerm() {
        return eventTerm;
    }
    public void setEventTerm(String eventTerm) {
        this.eventTerm = eventTerm;
    }
    public LocalDate getOnsetDate() {
        return onsetDate;
    }
    public void setOnsetDate(LocalDate onsetDate) {
        this.onsetDate = onsetDate;
    }
    public LocalDate getResolvedDate() {
        return resolvedDate;
    }
    public void setResolvedDate(LocalDate resolvedDate) {
        this.resolvedDate = resolvedDate;
    }
    public String getSeverity() {
        return severity;
    }
    public void setSeverity(String severity) {
        this.severity = severity;
    }
    public Boolean getIsSae() {
        return isSae;
    }
    public void setIsSae(Boolean isSae) {
        this.isSae = isSae;
    }
    public String getSeriousnessCriteria() {
        return seriousnessCriteria;
    }
    public void setSeriousnessCriteria(String seriousnessCriteria) {
        this.seriousnessCriteria = seriousnessCriteria;
    }
    public String getCausality() {
        return causality;
    }
    public void setCausality(String causality) {
        this.causality = causality;
    }
    public String getOutcome() {
        return outcome;
    }
    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
    public LocalDate getReportedDate() {
        return reportedDate;
    }
    public void setReportedDate(LocalDate reportedDate) {
        this.reportedDate = reportedDate;
    }
    public Boolean getNdctReported() {
        return ndctReported;
    }
    public void setNdctReported(Boolean ndctReported) {
        this.ndctReported = ndctReported;
    }
    public String getActionTaken() {
        return actionTaken;
    }
    public void setActionTaken(String actionTaken) {
        this.actionTaken = actionTaken;
    }
    public String getDetails() {
        return details;
    }
    public void setDetails(String details) {
        this.details = details;
    }
}

