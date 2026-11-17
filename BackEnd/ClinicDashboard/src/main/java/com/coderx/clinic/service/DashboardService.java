package com.coderx.clinic.service;

import com.coderx.clinic.Entity.Trial;
import com.coderx.clinic.Entity.Participant;
import com.coderx.clinic.Entity.Visit;
import com.coderx.clinic.repository.AdverseEventRepository;
import com.coderx.clinic.repository.ParticipantRepository;
import com.coderx.clinic.repository.TrialRepository;
import com.coderx.clinic.repository.VisitRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TrialRepository trialRepository;
    private final ParticipantRepository participantRepository;
    private final VisitRepository visitRepository;
    private final AdverseEventRepository adverseEventRepository;

    public DashboardService(TrialRepository trialRepository,
                            ParticipantRepository participantRepository,
                            VisitRepository visitRepository,
                            AdverseEventRepository adverseEventRepository) {
        this.trialRepository = trialRepository;
        this.participantRepository = participantRepository;
        this.visitRepository = visitRepository;
        this.adverseEventRepository = adverseEventRepository;
    }

    public Map<String, Object> getKpis() {
        List<Trial> trials = trialRepository.findAll();
        List<Participant> participants = participantRepository.findAll();
        List<Visit> visits = visitRepository.findAll();

        long totalTrials = trials.size();
        long activeTrials = trials.stream().filter(t -> "Active".equalsIgnoreCase(t.getStatus()) || "Recruiting".equalsIgnoreCase(t.getStatus())).count();
        long completedTrials = trials.stream().filter(t -> "Completed".equalsIgnoreCase(t.getStatus())).count();

        long totalParticipants = participants.size();
        long activeParticipants = participants.stream().filter(p -> "Active".equalsIgnoreCase(p.getStatus())).count();

        long completedVisits = visits.stream().filter(v -> "Completed".equalsIgnoreCase(v.getStatus())).count();
        long scheduledVisits = visits.stream().filter(v -> "Scheduled".equalsIgnoreCase(v.getStatus())).count();
        long overdueVisits = visits.stream().filter(v -> "Overdue".equalsIgnoreCase(v.getStatus()) || "Missed".equalsIgnoreCase(v.getStatus())).count();

        long totalAes = adverseEventRepository.count();
        long saeCount = adverseEventRepository.findByIsSae(true).size();

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalTrials", totalTrials);
        kpis.put("activeTrials", activeTrials);
        kpis.put("completedTrials", completedTrials);
        kpis.put("totalParticipants", totalParticipants);
        kpis.put("activeParticipants", activeParticipants);
        kpis.put("completedVisits", completedVisits);
        kpis.put("scheduledVisits", scheduledVisits);
        kpis.put("overdueVisits", overdueVisits);
        kpis.put("adverseEvents", totalAes);
        kpis.put("seriousAdverseEvents", saeCount);

        return kpis;
    }
}

