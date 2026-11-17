package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Participant;
import com.coderx.clinic.Entity.PrakritiAssessment;
import com.coderx.clinic.repository.ParticipantRepository;
import com.coderx.clinic.repository.PrakritiAssessmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AyurvedaService {

    private final PrakritiAssessmentRepository assessmentRepository;
    private final ParticipantRepository participantRepository;
    private final AuditService auditService;

    public AyurvedaService(PrakritiAssessmentRepository assessmentRepository,
                           ParticipantRepository participantRepository,
                           AuditService auditService) {
        this.assessmentRepository = assessmentRepository;
        this.participantRepository = participantRepository;
        this.auditService = auditService;
    }

    public List<PrakritiAssessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    public Optional<PrakritiAssessment> getByParticipantId(Long participantId) {
        return assessmentRepository.findByParticipantId(participantId);
    }

    public PrakritiAssessment saveAssessment(PrakritiAssessment assessment, String username) {
        if (assessment.getAssessedAt() == null) {
            assessment.setAssessedAt(LocalDate.now());
        }

        // Determine dominant doshas based on scores
        int v = assessment.getVataScore() != null ? assessment.getVataScore() : 0;
        int p = assessment.getPittaScore() != null ? assessment.getPittaScore() : 0;
        int k = assessment.getKaphaScore() != null ? assessment.getKaphaScore() : 0;

        String primary = "Vata";
        String secondary = "Pitta";

        if (p >= v && p >= k) {
            primary = "Pitta";
            secondary = (v >= k) ? "Vata" : "Kapha";
        } else if (k >= v && k >= p) {
            primary = "Kapha";
            secondary = (p >= v) ? "Pitta" : "Vata";
        } else {
            primary = "Vata";
            secondary = (p >= k) ? "Pitta" : "Kapha";
        }

        assessment.setPrimaryDosha(primary);
        assessment.setSecondaryDosha(secondary);
        assessment.setPrakritiType(primary + "-" + secondary);

        PrakritiAssessment saved = assessmentRepository.save(assessment);

        // Update participant's doshaType field as well
        if (saved.getParticipantId() != null) {
            participantRepository.findById(saved.getParticipantId()).ifPresent(part -> {
                part.setDoshaType(saved.getPrakritiType());
                participantRepository.save(part);
            });
        }

        auditService.log(username, "Ayurvedic Physician", "PRAKRITI_ASSESSMENT",
                "Ayurveda", saved.getParticipantCode(), "Computed Prakriti: " + saved.getPrakritiType());

        return saved;
    }
}

