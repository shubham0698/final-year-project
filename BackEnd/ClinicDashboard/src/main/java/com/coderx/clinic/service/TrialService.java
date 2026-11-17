package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Trial;
import com.coderx.clinic.repository.TrialRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrialService {

    private final TrialRepository trialRepository;
    private final AuditService auditService;

    public TrialService(TrialRepository trialRepository, AuditService auditService) {
        this.trialRepository = trialRepository;
        this.auditService = auditService;
    }

    public List<Trial> getAllTrials() {
        return trialRepository.findAll();
    }

    public Optional<Trial> getTrialById(Long id) {
        return trialRepository.findById(id);
    }

    public Optional<Trial> getTrialByCode(String code) {
        return trialRepository.findByTrialCode(code);
    }

    public Trial saveTrial(Trial trial, String username) {
        boolean isNew = (trial.getId() == null);
        if (trial.getCurrentEnrollment() == null) {
            trial.setCurrentEnrollment(0);
        }
        Trial saved = trialRepository.save(trial);
        auditService.log(username, "Study Coordinator", isNew ? "CREATE_TRIAL" : "UPDATE_TRIAL", 
                         "Trials", saved.getTrialCode(), "Trial " + saved.getTitle() + " saved with status " + saved.getStatus());
        return saved;
    }

    public boolean deleteTrial(Long id, String username) {
        return trialRepository.findById(id).map(trial -> {
            trialRepository.delete(trial);
            auditService.log(username, "Admin", "DELETE_TRIAL", "Trials", trial.getTrialCode(), "Deleted trial: " + trial.getTitle());
            return true;
        }).orElse(false);
    }
}

