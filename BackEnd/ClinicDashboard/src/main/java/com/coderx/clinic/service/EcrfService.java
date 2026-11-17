package com.coderx.clinic.service;

import com.coderx.clinic.Entity.EcrfSubmission;
import com.coderx.clinic.repository.EcrfSubmissionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EcrfService {

    private final EcrfSubmissionRepository submissionRepository;
    private final AuditService auditService;

    public EcrfService(EcrfSubmissionRepository submissionRepository, AuditService auditService) {
        this.submissionRepository = submissionRepository;
        this.auditService = auditService;
    }

    public List<EcrfSubmission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public List<EcrfSubmission> getSubmissionsByParticipant(Long participantId) {
        return submissionRepository.findByParticipantId(participantId);
    }

    public EcrfSubmission saveSubmission(EcrfSubmission submission, String username) {
        boolean isNew = (submission.getId() == null);
        if (submission.getSubmittedAt() == null) {
            submission.setSubmittedAt(LocalDate.now());
        }
        if (submission.getSubmittedBy() == null) {
            submission.setSubmittedBy(username != null ? username : "Investigator");
        }
        if (submission.getStatus() == null) {
            submission.setStatus("Submitted");
        }
        EcrfSubmission saved = submissionRepository.save(submission);
        auditService.log(username, "Clinical Monitor", isNew ? "SUBMIT_ECRF" : "UPDATE_ECRF",
                "eCRF", "eCRF #" + saved.getId(), "Form: " + saved.getFormTitle() + " for " + saved.getParticipantCode() + " status: " + saved.getStatus());
        return saved;
    }

    public EcrfSubmission lockSubmission(Long id, String username) {
        return submissionRepository.findById(id).map(sub -> {
            sub.setStatus("Locked");
            EcrfSubmission saved = submissionRepository.save(sub);
            auditService.log(username, "Clinical Monitor", "LOCK_ECRF",
                    "eCRF", "eCRF #" + saved.getId(), "Locked submission to prevent further edits (GCP compliance)");
            return saved;
        }).orElse(null);
    }
}

