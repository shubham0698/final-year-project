package com.coderx.clinic.service;

import com.coderx.clinic.Entity.AuditLog;
import com.coderx.clinic.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String username, String role, String action, String module, String recordId, String details) {
        try {
            AuditLog auditLog = new AuditLog(username != null ? username : "System", 
                                             role != null ? role : "SYSTEM", 
                                             action, module, recordId, details);
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            System.err.println("Audit log error: " + e.getMessage());
        }
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByModule(String module) {
        return auditLogRepository.findByModuleOrderByTimestampDesc(module);
    }
}

