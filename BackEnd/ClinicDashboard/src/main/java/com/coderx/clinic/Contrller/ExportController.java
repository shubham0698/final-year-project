package com.coderx.clinic.Contrller;

import com.coderx.clinic.Entity.Participant;
import com.coderx.clinic.Entity.Trial;
import com.coderx.clinic.Entity.Visit;
import com.coderx.clinic.service.ParticipantService;
import com.coderx.clinic.service.TrialService;
import com.coderx.clinic.service.VisitService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/exports")
@CrossOrigin(origins = "*")
public class ExportController {

    private final TrialService trialService;
    private final ParticipantService participantService;
    private final VisitService visitService;

    public ExportController(TrialService trialService, ParticipantService participantService, VisitService visitService) {
        this.trialService = trialService;
        this.participantService = participantService;
        this.visitService = visitService;
    }

    @PostMapping("/cdisc")
    public ResponseEntity<Map<String, Object>> exportCdiscSdtm(@RequestBody(required = false) Map<String, Object> req) {
        List<Trial> trials = trialService.getAllTrials();
        List<Participant> participants = participantService.getAllParticipants();

        Map<String, Object> sdtmBundle = new LinkedHashMap<>();
        sdtmBundle.put("standard", "CDISC SDTM v3.3");
        sdtmBundle.put("generatedAt", LocalDateTime.now().toString());
        sdtmBundle.put("domain_TS", trials); // Trial Summary domain
        sdtmBundle.put("domain_DM", participants); // Demographics domain
        sdtmBundle.put("status", "SUCCESS");
        sdtmBundle.put("totalRecordsExported", trials.size() + participants.size());

        return ResponseEntity.ok(sdtmBundle);
    }

    @PostMapping("/fhir")
    public ResponseEntity<Map<String, Object>> exportHl7Fhir(@RequestBody(required = false) Map<String, Object> req) {
        List<Participant> participants = participantService.getAllParticipants();
        List<Visit> visits = visitService.getAllVisits();

        Map<String, Object> fhirBundle = new LinkedHashMap<>();
        fhirBundle.put("resourceType", "Bundle");
        fhirBundle.put("type", "collection");
        fhirBundle.put("timestamp", LocalDateTime.now().toString());

        List<Map<String, Object>> entries = new ArrayList<>();
        for (Participant p : participants) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("fullUrl", "urn:uuid:patient-" + p.getParticipantCode());
            Map<String, Object> resource = new HashMap<>();
            resource.put("resourceType", "ResearchSubject");
            resource.put("id", p.getParticipantCode());
            resource.put("status", p.getStatus() != null ? p.getStatus().toLowerCase() : "candidate");
            resource.put("study", p.getTrialCode());
            resource.put("individual", Map.of("display", p.getFullName(), "gender", p.getGender()));
            entry.put("resource", resource);
            entries.add(entry);
        }

        fhirBundle.put("entry", entries);
        fhirBundle.put("total", entries.size());

        return ResponseEntity.ok(fhirBundle);
    }
}

