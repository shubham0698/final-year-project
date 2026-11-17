package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.Approval;
import com.coderx.clinic.service.ComplianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping("/compliance/approvals")
    public ResponseEntity<List<Approval>> getAllApprovals() {
        return ResponseEntity.ok(complianceService.getAllApprovals());
    }

    @GetMapping("/trials/{trialId}/approvals")
    public ResponseEntity<List<Approval>> getApprovalsForTrial(@PathVariable Long trialId) {
        return ResponseEntity.ok(complianceService.getApprovalsByTrial(trialId));
    }

    @PostMapping("/compliance/approvals")
    public ResponseEntity<Approval> saveApproval(@RequestBody Approval approval, @RequestHeader(value = "X-User-Name", required = false) String username) {
        return ResponseEntity.ok(complianceService.saveApproval(approval, username));
    }

    @GetMapping("/compliance/overview")
    public ResponseEntity<Map<String, Object>> getComplianceOverview() {
        return ResponseEntity.ok(complianceService.getComplianceOverview());
    }

    @GetMapping("/compliance/check-enrollment/{trialId}")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(@PathVariable Long trialId) {
        boolean allowed = complianceService.isEnrollmentAllowed(trialId);
        return ResponseEntity.ok(Map.of("enrollmentAllowed", allowed));
    }
}

