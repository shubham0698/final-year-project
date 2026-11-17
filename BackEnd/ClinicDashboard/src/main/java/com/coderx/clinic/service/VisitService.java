package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Visit;
import com.coderx.clinic.repository.VisitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public VisitService(VisitRepository visitRepository, AuditService auditService, NotificationService notificationService) {
        this.visitRepository = visitRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<Visit> getAllVisits() {
        // Automatically check and update overdue visits
        List<Visit> list = visitRepository.findAll();
        boolean changed = false;
        LocalDate today = LocalDate.now();
        for (Visit v : list) {
            if ("Scheduled".equalsIgnoreCase(v.getStatus()) && v.getScheduledDate() != null && v.getScheduledDate().isBefore(today)) {
                v.setStatus("Overdue");
                changed = true;
            }
        }
        if (changed) {
            visitRepository.saveAll(list);
        }
        return list;
    }

    public List<Visit> getVisitsByParticipant(Long participantId) {
        return visitRepository.findByParticipantId(participantId);
    }

    public Visit saveVisit(Visit visit, String username) {
        boolean isNew = (visit.getId() == null);
        Visit saved = visitRepository.save(visit);
        auditService.log(username, "Study Coordinator", isNew ? "SCHEDULE_VISIT" : "UPDATE_VISIT",
                "Visits", "Visit #" + saved.getId(), "Visit " + saved.getVisitName() + " for participant " + saved.getParticipantCode() + " set to " + saved.getStatus());
        return saved;
    }

    public Visit completeVisit(Long id, String vitals, String notes, String username) {
        return visitRepository.findById(id).map(v -> {
            v.setStatus("Completed");
            v.setCompletedDate(LocalDate.now());
            if (vitals != null) v.setVitals(vitals);
            if (notes != null) v.setNotes(notes);
            Visit saved = visitRepository.save(v);
            auditService.log(username, "Study Coordinator", "COMPLETE_VISIT",
                    "Visits", "Visit #" + saved.getId(), "Completed visit for " + saved.getParticipantCode());
            return saved;
        }).orElse(null);
    }

    public List<Visit> generateProtocolSchedule(Long participantId, String participantCode, Long trialId, String trialCode, LocalDate enrollmentDate) {
        List<Visit> generated = new ArrayList<>();
        LocalDate base = (enrollmentDate != null) ? enrollmentDate : LocalDate.now();

        // Standard Ayurvedic Clinical Trial Protocol visits
        generated.add(createVisitEntry(participantId, participantCode, trialId, trialCode, "Baseline Assessment (Day 0)", "Baseline", base));
        generated.add(createVisitEntry(participantId, participantCode, trialId, trialCode, "Interim Evaluation (Week 2)", "Follow-up", base.plusWeeks(2)));
        generated.add(createVisitEntry(participantId, participantCode, trialId, trialCode, "Mid-Term Assessment (Week 6)", "Follow-up", base.plusWeeks(6)));
        generated.add(createVisitEntry(participantId, participantCode, trialId, trialCode, "Final Close-out & Assessment (Week 12)", "Close-out", base.plusWeeks(12)));

        return visitRepository.saveAll(generated);
    }

    private Visit createVisitEntry(Long participantId, String participantCode, Long trialId, String trialCode, String name, String type, LocalDate date) {
        Visit v = new Visit();
        v.setParticipantId(participantId);
        v.setParticipantCode(participantCode);
        v.setTrialId(trialId);
        v.setTrialCode(trialCode);
        v.setVisitName(name);
        v.setVisitType(type);
        v.setScheduledDate(date);
        v.setStatus("Scheduled");
        return v;
    }
}

