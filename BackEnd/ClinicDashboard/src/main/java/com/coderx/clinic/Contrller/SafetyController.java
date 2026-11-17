package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.AdverseEvent;
import com.coderx.clinic.service.SafetyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adverse-events")
@CrossOrigin(origins = "*")
public class SafetyController {

    private final SafetyService safetyService;

    public SafetyController(SafetyService safetyService) {
        this.safetyService = safetyService;
    }

    @GetMapping
    public ResponseEntity<List<AdverseEvent>> getAllEvents() {
        return ResponseEntity.ok(safetyService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdverseEvent> getEventById(@PathVariable Long id) {
        return safetyService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/trial/{trialId}")
    public ResponseEntity<List<AdverseEvent>> getByTrial(@PathVariable Long trialId) {
        return ResponseEntity.ok(safetyService.getEventsByTrial(trialId));
    }

    @PostMapping
    public ResponseEntity<AdverseEvent> reportEvent(@RequestBody AdverseEvent event, @RequestHeader(value = "X-User-Name", required = false) String username) {
        return ResponseEntity.ok(safetyService.saveEvent(event, username));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSafetyStats() {
        return ResponseEntity.ok(safetyService.getSafetyStats());
    }
}

