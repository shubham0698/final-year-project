package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Participant;
import com.coderx.clinic.Entity.Trial;
import com.coderx.clinic.repository.ParticipantRepository;
import com.coderx.clinic.repository.TrialRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final TrialRepository trialRepository;
    private final ComplianceService complianceService;
    private final AuditService auditService;

    public ParticipantService(ParticipantRepository participantRepository, TrialRepository trialRepository,
                              ComplianceService complianceService, AuditService auditService) {
        this.participantRepository = participantRepository;
        this.trialRepository = trialRepository;
        this.complianceService = complianceService;
        this.auditService = auditService;
    }

    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    public Optional<Participant> getParticipantById(Long id) {
        return participantRepository.findById(id);
    }

    public List<Participant> getParticipantsByTrial(Long trialId) {
        return participantRepository.findByTrialId(trialId);
    }

    public Participant saveParticipant(Participant participant, String username) {
        // Enforce regulatory check: check if trial approvals are valid
        if (participant.getTrialId() != null) {
            boolean allowed = complianceService.isEnrollmentAllowed(participant.getTrialId());
            if (!allowed && "Active".equalsIgnoreCase(participant.getStatus())) {
                // Cannot mark as Active without valid Ethics Approval
                participant.setStatus("Pending Approval");
            }
        }

        boolean isNew = (participant.getId() == null);
        if (participant.getEnrollmentDate() == null) {
            participant.setEnrollmentDate(LocalDate.now());
        }

        Participant saved = participantRepository.save(participant);

        // Update trial current enrollment count if active
        if (saved.getTrialId() != null) {
            updateTrialEnrollmentCount(saved.getTrialId());
        }

        auditService.log(username, "Study Coordinator", isNew ? "ENROLL_PARTICIPANT" : "UPDATE_PARTICIPANT",
                "Participants", saved.getParticipantCode(), "Participant " + saved.getFullName() + " status: " + saved.getStatus());

        return saved;
    }

    public Participant randomizeParticipant(Long id, String username) {
        return participantRepository.findById(id).map(p -> {
            // Alternating or dosha-based randomized assignment
            long count = participantRepository.count();
            String group = (count % 2 == 0) ? "Group A - Ashwagandha Formulation" : "Group B - Placebo Control";
            p.setRandomizedGroup(group);
            p.setStatus("Active");
            Participant saved = participantRepository.save(p);

            if (saved.getTrialId() != null) {
                updateTrialEnrollmentCount(saved.getTrialId());
            }

            auditService.log(username, "Principal Investigator", "RANDOMIZE_PARTICIPANT",
                    "Participants", saved.getParticipantCode(), "Assigned to: " + group);
            return saved;
        }).orElse(null);
    }

    public Participant updateConsent(Long id, String status, String username) {
        return participantRepository.findById(id).map(p -> {
            p.setConsentStatus(status);
            if ("Signed".equalsIgnoreCase(status)) {
                p.setConsentDate(LocalDate.now());
                if ("Screened".equalsIgnoreCase(p.getStatus())) {
                    p.setStatus("Eligible");
                }
            }
            Participant saved = participantRepository.save(p);
            auditService.log(username, "Study Coordinator", "INFORMED_CONSENT",
                    "Participants", saved.getParticipantCode(), "Consent updated to " + status);
            return saved;
        }).orElse(null);
    }

    private void updateTrialEnrollmentCount(Long trialId) {
        trialRepository.findById(trialId).ifPresent(trial -> {
            List<Participant> participants = participantRepository.findByTrialId(trialId);
            long activeCount = participants.stream()
                    .filter(p -> "Active".equalsIgnoreCase(p.getStatus()) || "Completed".equalsIgnoreCase(p.getStatus()))
                    .count();
            trial.setCurrentEnrollment((int) activeCount);
            trialRepository.save(trial);
        });
    }

    public boolean deleteParticipant(Long id, String username) {
        return participantRepository.findById(id).map(p -> {
            participantRepository.delete(p);
            auditService.log(username, "Admin", "DELETE_PARTICIPANT", "Participants", p.getParticipantCode(), "Participant deleted");
            return true;
        }).orElse(false);
    }
}

