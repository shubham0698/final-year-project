package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.EcrfSubmission;
import com.coderx.clinic.service.EcrfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ecrf")
@CrossOrigin(origins = "*")
public class EcrfController {

    private final EcrfService ecrfService;

    public EcrfController(EcrfService ecrfService) {
        this.ecrfService = ecrfService;
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<EcrfSubmission>> getAllSubmissions() {
        return ResponseEntity.ok(ecrfService.getAllSubmissions());
    }

    @GetMapping("/submissions/participant/{participantId}")
    public ResponseEntity<List<EcrfSubmission>> getByParticipant(@PathVariable Long participantId) {
        return ResponseEntity.ok(ecrfService.getSubmissionsByParticipant(participantId));
    }

    @PostMapping("/submissions")
    public ResponseEntity<EcrfSubmission> submitForm(@RequestBody EcrfSubmission submission, @RequestHeader(value = "X-User-Name", required = false) String username) {
        return ResponseEntity.ok(ecrfService.saveSubmission(submission, username));
    }

    @PostMapping("/submissions/{id}/lock")
    public ResponseEntity<EcrfSubmission> lockForm(@PathVariable Long id, @RequestHeader(value = "X-User-Name", required = false) String username) {
        EcrfSubmission locked = ecrfService.lockSubmission(id, username);
        return locked != null ? ResponseEntity.ok(locked) : ResponseEntity.notFound().build();
    }
}

