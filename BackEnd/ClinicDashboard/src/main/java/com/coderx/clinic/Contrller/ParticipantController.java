package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.Participant;
import com.coderx.clinic.service.ParticipantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "*")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping
    public ResponseEntity<List<Participant>> getAllParticipants() {
        return ResponseEntity.ok(participantService.getAllParticipants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participant> getParticipantById(@PathVariable Long id) {
        return participantService.getParticipantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/trial/{trialId}")
    public ResponseEntity<List<Participant>> getByTrial(@PathVariable Long trialId) {
        return ResponseEntity.ok(participantService.getParticipantsByTrial(trialId));
    }

    @PostMapping
    public ResponseEntity<Participant> saveParticipant(@RequestBody Participant participant, @RequestHeader(value = "X-User-Name", required = false) String username) {
        return ResponseEntity.ok(participantService.saveParticipant(participant, username));
    }

    @PostMapping("/{id}/randomize")
    public ResponseEntity<Participant> randomizeParticipant(@PathVariable Long id, @RequestHeader(value = "X-User-Name", required = false) String username) {
        Participant randomized = participantService.randomizeParticipant(id, username);
        return randomized != null ? ResponseEntity.ok(randomized) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/consent")
    public ResponseEntity<Participant> updateConsent(@PathVariable Long id, @RequestBody Map<String, String> body, @RequestHeader(value = "X-User-Name", required = false) String username) {
        String status = body.get("status");
        Participant updated = participantService.updateConsent(id, status, username);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id, @RequestHeader(value = "X-User-Name", required = false) String username) {
        boolean deleted = participantService.deleteParticipant(id, username);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

