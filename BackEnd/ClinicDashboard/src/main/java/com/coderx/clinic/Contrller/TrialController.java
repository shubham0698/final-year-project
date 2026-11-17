package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.Trial;
import com.coderx.clinic.service.TrialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trials")
@CrossOrigin(origins = "*")
public class TrialController {

    private final TrialService trialService;

    public TrialController(TrialService trialService) {
        this.trialService = trialService;
    }

    @GetMapping
    public ResponseEntity<List<Trial>> getAllTrials() {
        return ResponseEntity.ok(trialService.getAllTrials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trial> getTrialById(@PathVariable Long id) {
        return trialService.getTrialById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Trial> createOrUpdateTrial(@RequestBody Trial trial, @RequestHeader(value = "X-User-Name", required = false) String username) {
        Trial saved = trialService.saveTrial(trial, username);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrial(@PathVariable Long id, @RequestHeader(value = "X-User-Name", required = false) String username) {
        boolean deleted = trialService.deleteTrial(id, username);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

