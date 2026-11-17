package com.coderx.clinic.config;

import com.coderx.clinic.Entity.*;
import com.coderx.clinic.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrialRepository trialRepository;
    private final ApprovalRepository approvalRepository;
    private final ParticipantRepository participantRepository;
    private final VisitRepository visitRepository;
    private final EcrfSubmissionRepository ecrfSubmissionRepository;
    private final PrakritiAssessmentRepository prakritiRepository;
    private final AdverseEventRepository adverseEventRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    public DataInitializer(UserRepository userRepository,
                           TrialRepository trialRepository,
                           ApprovalRepository approvalRepository,
                           ParticipantRepository participantRepository,
                           VisitRepository visitRepository,
                           EcrfSubmissionRepository ecrfSubmissionRepository,
                           PrakritiAssessmentRepository prakritiRepository,
                           AdverseEventRepository adverseEventRepository,
                           NotificationRepository notificationRepository,
                           AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.trialRepository = trialRepository;
        this.approvalRepository = approvalRepository;
        this.participantRepository = participantRepository;
        this.visitRepository = visitRepository;
        this.ecrfSubmissionRepository = ecrfSubmissionRepository;
        this.prakritiRepository = prakritiRepository;
        this.adverseEventRepository = adverseEventRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default users if empty
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFullName("Dr. Anand Sharma");
            admin.setEmail("admin@aiia.gov.in");
            admin.setPassword("Admin@123");
            admin.setPhone(9876543210L);
            admin.setRole("Admin");
            admin.setStatus("Active");
            admin.setDesignation("Director / Principal Administrator");
            admin.setDateCreated(LocalDate.now().minusMonths(6));
            userRepository.save(admin);

            User pi = new User();
            pi.setFullName("Prof. Rajeshwari Nair");
            pi.setEmail("pi@aiia.gov.in");
            pi.setPassword("Doctor@123");
            pi.setPhone(9811223344L);
            pi.setRole("Principal Investigator");
            pi.setStatus("Active");
            pi.setDesignation("Head of Kayachikitsa");
            pi.setDateCreated(LocalDate.now().minusMonths(4));
            userRepository.save(pi);

            User coord = new User();
            coord.setFullName("Rahul Verma");
            coord.setEmail("coordinator@aiia.gov.in");
            coord.setPassword("Coord@123");
            coord.setPhone(9876501234L);
            coord.setRole("Study Coordinator");
            coord.setStatus("Active");
            coord.setDesignation("Clinical Research Coordinator");
            coord.setDateCreated(LocalDate.now().minusMonths(2));
            userRepository.save(coord);
        }

        // Seed default trials if empty
        if (trialRepository.count() == 0) {
            Trial t1 = new Trial();
            t1.setTrialCode("CT-2024-001");
            t1.setTitle("Evaluation of Ashwagandha Formulation in Generalized Anxiety & Stress");
            t1.setPhase("Phase II");
            t1.setStatus("Active");
            t1.setPrincipalInvestigator("Prof. Rajeshwari Nair");
            t1.setSiteLocation("AIIA Hospital, New Delhi - OPD 4");
            t1.setCtriNumber("CTRI/2024/03/064120");
            t1.setEthicsApprovalDate(LocalDate.now().minusMonths(5));
            t1.setStartDate(LocalDate.now().minusMonths(3));
            t1.setEndDate(LocalDate.now().plusMonths(9));
            t1.setTargetEnrollment(120);
            t1.setCurrentEnrollment(38);
            t1.setDescription("A randomized double-blind placebo-controlled study to evaluate standardized Ashwagandha extract.");
            trialRepository.save(t1);

            Trial t2 = new Trial();
            t2.setTrialCode("CT-2024-002");
            t2.setTitle("Clinical Efficacy of Haridra-Guduchi Kwatha in Metabolic Syndrome");
            t2.setPhase("Phase III");
            t2.setStatus("Recruiting");
            t2.setPrincipalInvestigator("Dr. Anand Sharma");
            t2.setSiteLocation("Center for Integrative Medicine, AIIA");
            t2.setCtriNumber("CTRI/2024/05/067891");
            t2.setEthicsApprovalDate(LocalDate.now().minusMonths(2));
            t2.setStartDate(LocalDate.now().minusMonths(1));
            t2.setEndDate(LocalDate.now().plusMonths(12));
            t2.setTargetEnrollment(150);
            t2.setCurrentEnrollment(24);
            t2.setDescription("Multicentric trial evaluating glycemic markers, lipid profile and oxidative markers.");
            trialRepository.save(t2);

            Trial t3 = new Trial();
            t3.setTrialCode("CT-2024-003");
            t3.setTitle("Guduchi and Yashtimadhu in Post-Viral Fatigue Management");
            t3.setPhase("Phase II");
            t3.setStatus("Pending Approval");
            t3.setPrincipalInvestigator("Dr. Sunita Kulkarni");
            t3.setSiteLocation("Clinical Research Wing, AIIA");
            t3.setCtriNumber("CTRI/2024/09/071234");
            t3.setTargetEnrollment(80);
            t3.setCurrentEnrollment(0);
            t3.setDescription("Assessment of immunomodulatory actions in persistent viral convalescence.");
            trialRepository.save(t3);
        }

        // Seed Approvals if empty
        if (approvalRepository.count() == 0) {
            Trial t1 = trialRepository.findByTrialCode("CT-2024-001").orElse(null);
            if (t1 != null) {
                Approval a1 = new Approval();
                a1.setTrialId(t1.getId());
                a1.setTrialCode(t1.getTrialCode());
                a1.setApprovalType("Ethics Committee");
                a1.setReferenceNumber("IEC/AIIA/2024/04-01");
                a1.setStatus("Approved");
                a1.setIssueDate(LocalDate.now().minusMonths(5));
                a1.setExpiryDate(LocalDate.now().plusMonths(7));
                a1.setRemarks("Institutional Ethics Committee clearance granted unconditionally.");
                approvalRepository.save(a1);

                Approval a2 = new Approval();
                a2.setTrialId(t1.getId());
                a2.setTrialCode(t1.getTrialCode());
                a2.setApprovalType("CTRI");
                a2.setReferenceNumber("CTRI/2024/03/064120");
                a2.setStatus("Approved");
                a2.setIssueDate(LocalDate.now().minusMonths(4));
                a2.setExpiryDate(LocalDate.now().plusMonths(20));
                a2.setRemarks("CTRI public portal registration verified.");
                approvalRepository.save(a2);
            }

            Trial t3 = trialRepository.findByTrialCode("CT-2024-003").orElse(null);
            if (t3 != null) {
                Approval a3 = new Approval();
                a3.setTrialId(t3.getId());
                a3.setTrialCode(t3.getTrialCode());
                a3.setApprovalType("Ethics Committee");
                a3.setReferenceNumber("IEC/AIIA/2024/09-12-REV");
                a3.setStatus("Under Review");
                a3.setIssueDate(LocalDate.now().minusDays(15));
                a3.setRemarks("Protocol amendment requested by EC regarding bio-waste disposal.");
                approvalRepository.save(a3);
            }
        }

        // Seed Participants if empty
        if (participantRepository.count() == 0) {
            Trial t1 = trialRepository.findByTrialCode("CT-2024-001").orElse(null);
            Long trialId = (t1 != null) ? t1.getId() : 1L;
            String trialCode = (t1 != null) ? t1.getTrialCode() : "CT-2024-001";

            Participant p1 = new Participant();
            p1.setParticipantCode("P-101");
            p1.setTrialId(trialId);
            p1.setTrialCode(trialCode);
            p1.setFullName("Ramesh Chandra");
            p1.setAge(42);
            p1.setGender("Male");
            p1.setContactNumber("+91 98100 12345");
            p1.setStatus("Active");
            p1.setConsentStatus("Signed");
            p1.setConsentDate(LocalDate.now().minusMonths(2));
            p1.setDoshaType("Vata-Pitta");
            p1.setRandomizedGroup("Group A - Ashwagandha Formulation");
            p1.setEnrollmentDate(LocalDate.now().minusMonths(2));
            participantRepository.save(p1);

            Participant p2 = new Participant();
            p2.setParticipantCode("P-102");
            p2.setTrialId(trialId);
            p2.setTrialCode(trialCode);
            p2.setFullName("Kavita Menon");
            p2.setAge(35);
            p2.setGender("Female");
            p2.setContactNumber("+91 98200 67890");
            p2.setStatus("Active");
            p2.setConsentStatus("Signed");
            p2.setConsentDate(LocalDate.now().minusMonths(1));
            p2.setDoshaType("Pitta-Kapha");
            p2.setRandomizedGroup("Group B - Placebo Control");
            p2.setEnrollmentDate(LocalDate.now().minusMonths(1));
            participantRepository.save(p2);

            Participant p3 = new Participant();
            p3.setParticipantCode("P-103");
            p3.setTrialId(trialId);
            p3.setTrialCode(trialCode);
            p3.setFullName("Sunil Deshmukh");
            p3.setAge(50);
            p3.setGender("Male");
            p3.setContactNumber("+91 98711 22334");
            p3.setStatus("Screened");
            p3.setConsentStatus("Pending");
            p3.setEnrollmentDate(LocalDate.now().minusDays(5));
            participantRepository.save(p3);
        }

        // Seed Visits if empty
        if (visitRepository.count() == 0) {
            Participant p1 = participantRepository.findByParticipantCode("P-101").orElse(null);
            if (p1 != null) {
                Visit v1 = new Visit();
                v1.setParticipantId(p1.getId());
                v1.setParticipantCode(p1.getParticipantCode());
                v1.setTrialId(p1.getTrialId());
                v1.setTrialCode(p1.getTrialCode());
                v1.setVisitName("Baseline Assessment");
                v1.setVisitType("Baseline");
                v1.setScheduledDate(LocalDate.now().minusMonths(2));
                v1.setCompletedDate(LocalDate.now().minusMonths(2));
                v1.setStatus("Completed");
                v1.setVitals("BP: 122/80 mmHg, Pulse: 74 bpm, Weight: 71 kg");
                v1.setNotes("Baseline blood panel collected, consent document verified.");
                visitRepository.save(v1);

                Visit v2 = new Visit();
                v2.setParticipantId(p1.getId());
                v2.setParticipantCode(p1.getParticipantCode());
                v2.setTrialId(p1.getTrialId());
                v2.setTrialCode(p1.getTrialCode());
                v2.setVisitName("Follow-up Visit (Week 4)");
                v2.setVisitType("Follow-up");
                v2.setScheduledDate(LocalDate.now().minusMonths(1));
                v2.setCompletedDate(LocalDate.now().minusMonths(1));
                v2.setStatus("Completed");
                v2.setVitals("BP: 118/78 mmHg, Pulse: 70 bpm, Weight: 70.5 kg");
                v2.setNotes("Self-reported HAM-A anxiety score dropped by 4 points.");
                visitRepository.save(v2);

                Visit v3 = new Visit();
                v3.setParticipantId(p1.getId());
                v3.setParticipantCode(p1.getParticipantCode());
                v3.setTrialId(p1.getTrialId());
                v3.setTrialCode(p1.getTrialCode());
                v3.setVisitName("Interim Visit (Week 8)");
                v3.setVisitType("Follow-up");
                v3.setScheduledDate(LocalDate.now().plusDays(10));
                v3.setStatus("Scheduled");
                visitRepository.save(v3);
            }
        }

        // Seed eCRF Submissions if empty
        if (ecrfSubmissionRepository.count() == 0) {
            Participant p1 = participantRepository.findByParticipantCode("P-101").orElse(null);
            if (p1 != null) {
                EcrfSubmission sub1 = new EcrfSubmission();
                sub1.setParticipantId(p1.getId());
                sub1.setParticipantCode(p1.getParticipantCode());
                sub1.setTrialId(p1.getTrialId());
                sub1.setTrialCode(p1.getTrialCode());
                sub1.setFormTitle("Vital Signs & Anthropometry");
                sub1.setFormType("Vitals");
                sub1.setFormData("{\"systolicBp\":122,\"diastolicBp\":80,\"pulseRate\":74,\"weight\":71,\"height\":175,\"temperature\":98.4}");
                sub1.setStatus("Locked");
                sub1.setSubmittedBy("Prof. Rajeshwari Nair");
                sub1.setSubmittedAt(LocalDate.now().minusMonths(2));
                ecrfSubmissionRepository.save(sub1);

                EcrfSubmission sub2 = new EcrfSubmission();
                sub2.setParticipantId(p1.getId());
                sub2.setParticipantCode(p1.getParticipantCode());
                sub2.setTrialId(p1.getTrialId());
                sub2.setTrialCode(p1.getTrialCode());
                sub2.setFormTitle("Ayurveda Clinical Efficacy Form");
                sub2.setFormType("Clinical");
                sub2.setFormData("{\"stressScale\":3,\"sleepQuality\":\"Improved\",\"agniStatus\":\"Sama Agni\",\"koshthaStatus\":\"Madhyama\"}");
                sub2.setStatus("Submitted");
                sub2.setSubmittedBy("Dr. Anand Sharma");
                sub2.setSubmittedAt(LocalDate.now().minusMonths(1));
                ecrfSubmissionRepository.save(sub2);
            }
        }

        // Seed Prakriti Assessments if empty
        if (prakritiRepository.count() == 0) {
            Participant p1 = participantRepository.findByParticipantCode("P-101").orElse(null);
            if (p1 != null) {
                PrakritiAssessment pa1 = new PrakritiAssessment();
                pa1.setParticipantId(p1.getId());
                pa1.setParticipantCode(p1.getParticipantCode());
                pa1.setVataScore(42);
                pa1.setPittaScore(36);
                pa1.setKaphaScore(22);
                pa1.setPrimaryDosha("Vata");
                pa1.setSecondaryDosha("Pitta");
                pa1.setPrakritiType("Vata-Pitta");
                pa1.setResponsesJson("{\"bodyFrame\":\"Slender/Light\",\"skinType\":\"Dry and rough\",\"hairType\":\"Thin, dark\",\"appetite\":\"Variable/irregular\",\"sleepPattern\":\"Light, easily disturbed\"}");
                pa1.setAssessedAt(LocalDate.now().minusMonths(2));
                prakritiRepository.save(pa1);
            }

            Participant p2 = participantRepository.findByParticipantCode("P-102").orElse(null);
            if (p2 != null) {
                PrakritiAssessment pa2 = new PrakritiAssessment();
                pa2.setParticipantId(p2.getId());
                pa2.setParticipantCode(p2.getParticipantCode());
                pa2.setVataScore(24);
                pa2.setPittaScore(45);
                pa2.setKaphaScore(31);
                pa2.setPrimaryDosha("Pitta");
                pa2.setSecondaryDosha("Kapha");
                pa2.setPrakritiType("Pitta-Kapha");
                pa2.setResponsesJson("{\"bodyFrame\":\"Medium, athletic\",\"skinType\":\"Warm, reddish, prone to flushing\",\"hairType\":\"Fine, brownish\",\"appetite\":\"Strong, sharp\",\"sleepPattern\":\"Moderate, sound\"}");
                pa2.setAssessedAt(LocalDate.now().minusMonths(1));
                prakritiRepository.save(pa2);
            }
        }

        // Seed Adverse Events if empty
        if (adverseEventRepository.count() == 0) {
            Participant p1 = participantRepository.findByParticipantCode("P-101").orElse(null);
            AdverseEvent ae = new AdverseEvent();
            ae.setTrialCode("CT-2024-001");
            ae.setParticipantCode("P-101");
            if (p1 != null) {
                ae.setTrialId(p1.getTrialId());
                ae.setParticipantId(p1.getId());
            }
            ae.setEventTerm("Mild Gastric Discomfort & Acidity");
            ae.setOnsetDate(LocalDate.now().minusDays(18));
            ae.setResolvedDate(LocalDate.now().minusDays(14));
            ae.setSeverity("Mild");
            ae.setIsSae(false);
            ae.setCausality("Possible");
            ae.setOutcome("Recovered");
            ae.setReportedDate(LocalDate.now().minusDays(17));
            ae.setNdctReported(true);
            ae.setActionTaken("Advised post-meal drug administration with lukewarm water");
            ae.setDetails("Patient reported slight heartburn when taken on empty stomach. Resolved completely with dietary adjustment.");
            adverseEventRepository.save(ae);

            AdverseEvent sae = new AdverseEvent();
            sae.setTrialCode("CT-2024-001");
            sae.setParticipantCode("P-102");
            sae.setEventTerm("Severe Allergic Urticaria & Angioedema");
            sae.setOnsetDate(LocalDate.now().minusDays(2));
            sae.setSeverity("Severe");
            sae.setIsSae(true);
            sae.setSeriousnessCriteria("Hospitalization");
            sae.setCausality("Probable");
            sae.setOutcome("Ongoing");
            sae.setReportedDate(LocalDate.now().minusDays(1));
            sae.setNdctReported(false); // Flagged for immediate 24h regulatory notice
            sae.setActionTaken("Study Drug Discontinued");
            sae.setDetails("Patient admitted to AIIA Emergency Observation. Intravenous antihistamines administered. Investigational medicinal product quarantined.");
            adverseEventRepository.save(sae);
        }

        // Seed Notifications if empty
        if (notificationRepository.count() == 0) {
            notificationRepository.save(new Notification(
                    "Ethics Committee Renewal Due",
                    "Trial CT-2024-001 annual ethical approval validity requires periodic status report submission within 60 days.",
                    "Warning", "Ethics Committee", "/app/regulatory-compliance"
            ));

            notificationRepository.save(new Notification(
                    "Upcoming Protocol Visits",
                    "3 participant visits are scheduled for this week under trial CT-2024-001.",
                    "Info", "Study Coordinator", "/app/visits"
            ));

            notificationRepository.save(new Notification(
                    "ACTION REQUIRED: SAE Regulatory Deadline (NDCT 2019)",
                    "Serious Adverse Event for participant P-102 requires 24-hour initial notice submission to CDSCO and Ethics Committee.",
                    "Urgent", "Pharmacovigilance Officer", "/app/adverse-events"
            ));
        }

        // Seed Audit Logs if empty
        if (auditLogRepository.count() == 0) {
            auditLogRepository.save(new AuditLog("System", "SYSTEM", "SYSTEM_INIT", "System", "0", "AIIA Clinical Trial Management System core database initialized."));
            auditLogRepository.save(new AuditLog("admin@aiia.gov.in", "Admin", "CONFIG_AUDIT", "Settings", "CTMS", "Regulatory rule engine: NDCT Rules 2019 and GCP safety tracking active."));
        }
    }
}
