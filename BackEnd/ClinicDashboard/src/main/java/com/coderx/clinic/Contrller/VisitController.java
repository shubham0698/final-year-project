package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.Visit;
import com.coderx.clinic.service.VisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "*")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping
    public ResponseEntity<List<Visit>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<Visit>> getVisitsByParticipant(@PathVariable Long participantId) {
        return ResponseEntity.ok(visitService.getVisitsByParticipant(participantId));
    }

    @PostMapping
    public ResponseEntity<Visit> saveVisit(@RequestBody Visit visit, @RequestHeader(value = "X-User-Name", required = false) String username) {
        return ResponseEntity.ok(visitService.saveVisit(visit, username));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Visit> completeVisit(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body, @RequestHeader(value = "X-User-Name", required = false) String username) {
        String vitals = body != null ? body.get("vitals") : null;
        String notes = body != null ? body.get("notes") : null;
        Visit completed = visitService.completeVisit(id, vitals, notes, username);
        return completed != null ? ResponseEntity.ok(completed) : ResponseEntity.notFound().build();
    }

    @PostMapping("/generate-schedule")
    public ResponseEntity<List<Visit>> generateSchedule(@RequestBody Map<String, Object> req) {
        Long participantId = Long.valueOf(req.get("participantId").toString());
        String participantCode = (String) req.get("participantCode");
        Long trialId = req.get("trialId") != null ? Long.valueOf(req.get("trialId").toString()) : null;
        String trialCode = (String) req.get("trialCode");
        LocalDate date = req.get("enrollmentDate") != null ? LocalDate.parse(req.get("enrollmentDate").toString()) : LocalDate.now();

        List<Visit> list = visitService.generateProtocolSchedule(participantId, participantCode, trialId, trialCode, date);
        return ResponseEntity.ok(list);
    }
}

