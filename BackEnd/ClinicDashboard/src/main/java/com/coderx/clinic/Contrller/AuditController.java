package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.AuditLog;
import com.coderx.clinic.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getLogs(@RequestParam(required = false) String module) {
        if (module != null && !module.isEmpty()) {
            return ResponseEntity.ok(auditService.getLogsByModule(module));
        }
        return ResponseEntity.ok(auditService.getAllLogs());
    }
}

