package com.coderx.clinic.service;

import com.coderx.clinic.Entity.AdverseEvent;
import com.coderx.clinic.repository.AdverseEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SafetyService {

    private final AdverseEventRepository adverseEventRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public SafetyService(AdverseEventRepository adverseEventRepository,
                         AuditService auditService,
                         NotificationService notificationService) {
        this.adverseEventRepository = adverseEventRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<AdverseEvent> getAllEvents() {
        return adverseEventRepository.findAll();
    }

    public List<AdverseEvent> getEventsByTrial(Long trialId) {
        return adverseEventRepository.findByTrialId(trialId);
    }

    public Optional<AdverseEvent> getEventById(Long id) {
        return adverseEventRepository.findById(id);
    }

    public AdverseEvent saveEvent(AdverseEvent event, String username) {
        boolean isNew = (event.getId() == null);
        if (event.getReportedDate() == null) {
            event.setReportedDate(LocalDate.now());
        }
        if (event.getIsSae() == null) {
            event.setIsSae(false);
        }

        AdverseEvent saved = adverseEventRepository.save(event);

        auditService.log(username, "Pharmacovigilance Officer",
                isNew ? (saved.getIsSae() ? "REPORT_SAE" : "REPORT_AE") : "UPDATE_AE",
                "Safety", "AE #" + saved.getId(),
                "Event: " + saved.getEventTerm() + " for " + saved.getParticipantCode() + " (Severity: " + saved.getSeverity() + ")");

        // Trigger urgent alert if SAE reported
        if (saved.getIsSae()) {
            notificationService.createNotification(
                    "URGENT: Serious Adverse Event (SAE) Reported!",
                    "SAE '" + saved.getEventTerm() + "' reported for participant " + saved.getParticipantCode() + " in trial " + saved.getTrialCode() + ". NDCT Rules 2019 reporting required within 24 hours.",
                    "Urgent", "Pharmacovigilance Officer", "/app/adverse-events"
            );
        }

        return saved;
    }

    public Map<String, Object> getSafetyStats() {
        List<AdverseEvent> list = adverseEventRepository.findAll();
        long totalAe = list.size();
        long totalSae = list.stream().filter(e -> Boolean.TRUE.equals(e.getIsSae())).count();
        long ongoing = list.stream().filter(e -> "Ongoing".equalsIgnoreCase(e.getOutcome())).count();
        long recovered = list.stream().filter(e -> "Recovered".equalsIgnoreCase(e.getOutcome())).count();
        long ndctPending = list.stream().filter(e -> Boolean.TRUE.equals(e.getIsSae()) && !Boolean.TRUE.equals(e.getNdctReported())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAe", totalAe);
        stats.put("totalSae", totalSae);
        stats.put("ongoing", ongoing);
        stats.put("recovered", recovered);
        stats.put("ndctPendingReports", ndctPending);
        return stats;
    }
}

