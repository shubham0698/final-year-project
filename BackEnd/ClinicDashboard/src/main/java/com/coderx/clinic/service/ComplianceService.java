package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Approval;
import com.coderx.clinic.repository.ApprovalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ComplianceService {

    private final ApprovalRepository approvalRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public ComplianceService(ApprovalRepository approvalRepository, AuditService auditService, NotificationService notificationService) {
        this.approvalRepository = approvalRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();
    }

    public List<Approval> getApprovalsByTrial(Long trialId) {
        return approvalRepository.findByTrialId(trialId);
    }

    public Approval saveApproval(Approval approval, String username) {
        boolean isNew = (approval.getId() == null);
        Approval saved = approvalRepository.save(approval);
        auditService.log(username, "Ethics Committee", isNew ? "CREATE_APPROVAL" : "UPDATE_APPROVAL",
                "Compliance", saved.getReferenceNumber(), "Regulatory approval " + saved.getApprovalType() + " saved for " + saved.getTrialCode());

        // Check if expiry is near or expired
        if (saved.getExpiryDate() != null && saved.getExpiryDate().isBefore(LocalDate.now().plusDays(30))) {
            notificationService.createNotification(
                    "Regulatory Expiry Alert: " + saved.getTrialCode(),
                    "Approval " + saved.getReferenceNumber() + " (" + saved.getApprovalType() + ") is expiring on " + saved.getExpiryDate(),
                    "Warning", "Ethics Committee", "/app/regulatory-compliance"
            );
        }
        return saved;
    }

    public boolean isEnrollmentAllowed(Long trialId) {
        List<Approval> approvals = approvalRepository.findByTrialId(trialId);
        if (approvals.isEmpty()) {
            return false;
        }
        boolean hasValidEthics = false;
        for (Approval a : approvals) {
            if ("Ethics Committee".equalsIgnoreCase(a.getApprovalType())) {
                boolean notExpired = (a.getExpiryDate() == null || a.getExpiryDate().isAfter(LocalDate.now()));
                if ("Approved".equalsIgnoreCase(a.getStatus()) && notExpired) {
                    hasValidEthics = true;
                }
            }
        }
        return hasValidEthics;
    }

    public Map<String, Object> getComplianceOverview() {
        List<Approval> list = approvalRepository.findAll();
        long total = list.size();
        long approved = list.stream().filter(a -> "Approved".equalsIgnoreCase(a.getStatus())).count();
        long underReview = list.stream().filter(a -> "Under Review".equalsIgnoreCase(a.getStatus()) || "Pending".equalsIgnoreCase(a.getStatus())).count();
        long expired = list.stream().filter(a -> "Expired".equalsIgnoreCase(a.getStatus()) || (a.getExpiryDate() != null && a.getExpiryDate().isBefore(LocalDate.now()))).count();

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalApprovals", total);
        overview.put("approved", approved);
        overview.put("underReview", underReview);
        overview.put("expired", expired);
        return overview;
    }
}

