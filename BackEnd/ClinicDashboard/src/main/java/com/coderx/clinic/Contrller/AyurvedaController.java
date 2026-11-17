package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.PrakritiAssessment;
import com.coderx.clinic.service.AyurvedaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ayurveda")
@CrossOrigin(origins = "*")
public class AyurvedaController {

    private final AyurvedaService ayurvedaService;

    public AyurvedaController(AyurvedaService ayurvedaService) {
        this.ayurvedaService = ayurvedaService;
    }

    @GetMapping("/prakriti")
    public ResponseEntity<List<PrakritiAssessment>> getAllAssessments() {
        return ResponseEntity.ok(ayurvedaService.getAllAssessments());
    }

    @GetMapping("/prakriti/participant/{participantId}")
    public ResponseEntity<PrakritiAssessment> getByParticipant(@PathVariable Long participantId) {
        return ayurvedaService.getByParticipantId(participantId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/prakriti")
    public ResponseEntity<PrakritiAssessment> saveAssessment(@RequestBody PrakritiAssessment assessment, @RequestHeader(value = "X-User-Name", required = false) String username) {
        return ResponseEntity.ok(ayurvedaService.saveAssessment(assessment, username));
    }
}

