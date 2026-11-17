-- AIIA Clinical Trial Management System (CTMS)
-- Dummy Data Script for Evaluation & Testing
-- To run: USE aiia_ctms; SOURCE seed_dummy_data.sql;

USE aiia_ctms;

-- 1. Seed System Users
INSERT INTO user (id, full_name, email, phone, password, status, date_created, role, designation)
VALUES
(1, 'Dr. Anand Sharma', 'admin@aiia.gov.in', 9876543210, 'Admin@123', 'Active', '2026-05-15', 'Admin', 'Director / Principal Administrator'),
(2, 'Prof. Rajeshwari Nair', 'pi@aiia.gov.in', 9811223344, 'Doctor@123', 'Active', '2026-07-20', 'Principal Investigator', 'Head of Kayachikitsa'),
(3, 'Dr. Sunita Kulkarni', 'ethics@aiia.gov.in', 9833445566, 'Ethics@123', 'Active', '2026-08-10', 'Ethics Committee', 'Member Secretary, IEC'),
(4, 'Rahul Verma', 'coordinator@aiia.gov.in', 9876501234, 'Coord@123', 'Active', '2026-09-01', 'Study Coordinator', 'Clinical Research Coordinator')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 2. Seed Clinical Trials
INSERT INTO trials (id, trial_code, title, phase, status, principal_investigator, site_location, ctri_number, ethics_approval_date, start_date, end_date, target_enrollment, current_enrollment, description)
VALUES
(1, 'CT-2024-001', 'Evaluation of Ashwagandha Formulation in Generalized Anxiety & Stress', 'Phase II', 'Active', 'Prof. Rajeshwari Nair', 'AIIA Hospital, New Delhi - OPD 4', 'CTRI/2024/03/064120', '2026-06-15', '2026-08-15', '2027-08-15', 120, 38, 'A randomized double-blind placebo-controlled study to evaluate standardized Ashwagandha extract.'),
(2, 'CT-2024-002', 'Clinical Efficacy of Haridra-Guduchi Kwatha in Metabolic Syndrome', 'Phase III', 'Recruiting', 'Dr. Anand Sharma', 'Center for Integrative Medicine, AIIA', 'CTRI/2024/05/067891', '2026-09-10', '2026-10-15', '2027-10-15', 150, 24, 'Multicentric trial evaluating glycemic markers, lipid profile and oxidative markers.'),
(3, 'CT-2024-003', 'Guduchi and Yashtimadhu in Post-Viral Fatigue Management', 'Phase II', 'Pending Approval', 'Dr. Sunita Kulkarni', 'Clinical Research Wing, AIIA', 'CTRI/2024/09/071234', NULL, NULL, NULL, 80, 0, 'Assessment of immunomodulatory actions in persistent viral convalescence.')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 3. Seed Regulatory Approvals
INSERT INTO approvals (id, trial_id, trial_code, approval_type, reference_number, status, issue_date, expiry_date, document_url, remarks)
VALUES
(1, 1, 'CT-2024-001', 'Ethics Committee', 'IEC/AIIA/2024/04-01', 'Approved', '2026-06-15', '2027-06-14', NULL, 'Institutional Ethics Committee clearance granted unconditionally.'),
(2, 1, 'CT-2024-001', 'CTRI', 'CTRI/2024/03/064120', 'Approved', '2026-07-01', '2028-07-01', NULL, 'CTRI public portal registration verified.'),
(3, 3, 'CT-2024-003', 'Ethics Committee', 'IEC/AIIA/2024/09-12-REV', 'Under Review', '2026-10-25', NULL, NULL, 'Protocol amendment requested by EC regarding bio-waste disposal.')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 4. Seed Participants
INSERT INTO participants (id, participant_code, trial_id, trial_code, full_name, age, gender, contact_number, status, consent_status, consent_date, dosha_type, randomized_group, enrollment_date)
VALUES
(1, 'P-101', 1, 'CT-2024-001', 'Ramesh Chandra', 42, 'Male', '+91 98100 12345', 'Active', 'Signed', '2026-09-10', 'Vata-Pitta', 'Group A - Ashwagandha Formulation', '2026-09-10'),
(2, 'P-102', 1, 'CT-2024-001', 'Kavita Menon', 35, 'Female', '+91 98200 67890', 'Active', 'Signed', '2026-10-05', 'Pitta-Kapha', 'Group B - Placebo Control', '2026-10-05'),
(3, 'P-103', 1, 'CT-2024-001', 'Sunil Deshmukh', 50, 'Male', '+91 98711 22334', 'Screened', 'Pending', NULL, NULL, NULL, '2026-11-10')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 5. Seed Visits
INSERT INTO visits (id, participant_id, participant_code, trial_id, trial_code, visit_name, visit_type, scheduled_date, completed_date, status, vitals, notes)
VALUES
(1, 1, 'P-101', 1, 'CT-2024-001', 'Baseline Assessment', 'Baseline', '2026-09-10', '2026-09-10', 'Completed', 'BP: 122/80 mmHg, Pulse: 74 bpm, Weight: 71 kg', 'Baseline blood panel collected, consent document verified.'),
(2, 1, 'P-101', 1, 'CT-2024-001', 'Follow-up Visit (Week 4)', 'Follow-up', '2026-10-10', '2026-10-10', 'Completed', 'BP: 118/78 mmHg, Pulse: 70 bpm, Weight: 70.5 kg', 'Self-reported HAM-A anxiety score dropped by 4 points.'),
(3, 1, 'P-101', 1, 'CT-2024-001', 'Interim Visit (Week 8)', 'Follow-up', '2026-11-26', NULL, 'Scheduled', NULL, 'Scheduled visit for HAM-A assessment and pill count.')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 6. Seed eCRF Submissions
INSERT INTO ecrf_submissions (id, participant_id, participant_code, trial_id, trial_code, visit_id, form_title, form_type, form_data, status, submitted_by, submitted_at)
VALUES
(1, 1, 'P-101', 1, 'CT-2024-001', 1, 'Vital Signs & Anthropometry', 'Vitals', '{"systolicBp":122,"diastolicBp":80,"pulseRate":74,"weight":71,"height":175}', 'Locked', 'Prof. Rajeshwari Nair', '2026-09-10'),
(2, 1, 'P-101', 1, 'CT-2024-001', 2, 'Ayurveda Clinical Efficacy Form', 'Clinical', '{"stressScale":3,"sleepQuality":"Improved","agniStatus":"Sama Agni","koshthaStatus":"Madhyama"}', 'Submitted', 'Dr. Anand Sharma', '2026-10-10')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 7. Seed Prakriti Assessments
INSERT INTO prakriti_assessments (id, participant_id, participant_code, vata_score, pitta_score, kapha_score, primary_dosha, secondary_dosha, prakriti_type, responses_json, assessed_at)
VALUES
(1, 1, 'P-101', 42, 36, 22, 'Vata', 'Pitta', 'Vata-Pitta', '{"bodyFrame":"Slender/Light","skinType":"Dry and rough","appetite":"Variable/irregular"}', '2026-09-10'),
(2, 2, 'P-102', 24, 45, 31, 'Pitta', 'Kapha', 'Pitta-Kapha', '{"bodyFrame":"Medium, athletic","skinType":"Warm, reddish","appetite":"Strong, sharp"}', '2026-10-05')
ON DUPLICATE KEY UPDATE prakriti_type = VALUES(prakriti_type);

-- 8. Seed Adverse Events
INSERT INTO adverse_events (id, trial_id, trial_code, participant_id, participant_code, event_term, onset_date, resolved_date, severity, is_sae, seriousness_criteria, causality, outcome, reported_date, ndct_reported, action_taken, details)
VALUES
(1, 1, 'CT-2024-001', 1, 'P-101', 'Mild Gastric Discomfort & Acidity', '2026-10-28', '2026-11-02', 'Mild', FALSE, NULL, 'Possible', 'Recovered', '2026-10-29', TRUE, 'Advised post-meal drug administration with lukewarm water', 'Patient reported slight heartburn when taken on empty stomach. Resolved completely.'),
(2, 1, 'CT-2024-001', 2, 'P-102', 'Severe Allergic Urticaria & Angioedema', '2026-11-14', NULL, 'Severe', TRUE, 'Hospitalization', 'Probable', 'Ongoing', '2026-11-15', FALSE, 'Study Drug Discontinued', 'Admitted to observation ward. Intravenous antihistamines given. 24h NDCT regulatory alert active.')
ON DUPLICATE KEY UPDATE event_term = VALUES(event_term);

-- 9. Seed Notifications
INSERT INTO notifications (id, title, message, type, target_role, is_read, created_at, action_url)
VALUES
(1, 'Ethics Committee Renewal Due', 'Trial CT-2024-001 annual ethical approval validity requires periodic status report submission within 60 days.', 'Warning', 'Ethics Committee', FALSE, NOW() - INTERVAL 2 DAY, '/app/regulatory-compliance'),
(2, 'Upcoming Protocol Visits', '3 participant visits are scheduled for this week under trial CT-2024-001.', 'Info', 'Study Coordinator', TRUE, NOW() - INTERVAL 4 DAY, '/app/visits'),
(3, 'ACTION REQUIRED: SAE Regulatory Deadline (NDCT 2019)', 'Serious Adverse Event for participant P-102 requires 24-hour initial notice submission to CDSCO and Ethics Committee.', 'Urgent', 'Pharmacovigilance Officer', FALSE, NOW() - INTERVAL 1 DAY, '/app/adverse-events')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 10. Seed Audit Logs
INSERT INTO audit_logs (id, timestamp, username, role, action, module, record_id, details)
VALUES
(1, NOW() - INTERVAL 5 DAY, 'System', 'SYSTEM', 'SYSTEM_INIT', 'System', '0', 'AIIA Clinical Trial Management System core database initialized.'),
(2, NOW() - INTERVAL 3 DAY, 'admin@aiia.gov.in', 'Admin', 'CONFIG_AUDIT', 'Settings', 'CTMS', 'Regulatory rule engine: NDCT Rules 2019 and GCP safety tracking active.'),
(3, NOW() - INTERVAL 1 DAY, 'Prof. Rajeshwari Nair', 'Principal Investigator', 'REPORT_SAE', 'Safety', 'AE #2', 'Urgent Serious Adverse Event recorded for participant P-102: Severe Allergic Urticaria')
ON DUPLICATE KEY UPDATE details = VALUES(details);

