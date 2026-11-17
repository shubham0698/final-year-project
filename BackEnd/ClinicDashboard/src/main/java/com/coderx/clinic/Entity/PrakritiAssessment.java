package com.coderx.clinic.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prakriti_assessments")
public class PrakritiAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long participantId;
    private String participantCode;

    private Integer vataScore;
    private Integer pittaScore;
    private Integer kaphaScore;

    private String primaryDosha;
    private String secondaryDosha;
    private String prakritiType; // e.g. "Pitta-Vata"

    @Column(columnDefinition = "TEXT")
    private String responsesJson;

    private LocalDate assessedAt;

    public PrakritiAssessment() {}

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
    public Integer getVataScore() {
        return vataScore;
    }
    public void setVataScore(Integer vataScore) {
        this.vataScore = vataScore;
    }
    public Integer getPittaScore() {
        return pittaScore;
    }
    public void setPittaScore(Integer pittaScore) {
        this.pittaScore = pittaScore;
    }
    public Integer getKaphaScore() {
        return kaphaScore;
    }
    public void setKaphaScore(Integer kaphaScore) {
        this.kaphaScore = kaphaScore;
    }
    public String getPrimaryDosha() {
        return primaryDosha;
    }
    public void setPrimaryDosha(String primaryDosha) {
        this.primaryDosha = primaryDosha;
    }
    public String getSecondaryDosha() {
        return secondaryDosha;
    }
    public void setSecondaryDosha(String secondaryDosha) {
        this.secondaryDosha = secondaryDosha;
    }
    public String getPrakritiType() {
        return prakritiType;
    }
    public void setPrakritiType(String prakritiType) {
        this.prakritiType = prakritiType;
    }
    public String getResponsesJson() {
        return responsesJson;
    }
    public void setResponsesJson(String responsesJson) {
        this.responsesJson = responsesJson;
    }
    public LocalDate getAssessedAt() {
        return assessedAt;
    }
    public void setAssessedAt(LocalDate assessedAt) {
        this.assessedAt = assessedAt;
    }
}

