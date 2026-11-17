-- AIIA Clinical Trial Management System (CTMS)
-- Database Schema for MySQL 8.x

CREATE DATABASE IF NOT EXISTS aiia_ctms;
USE aiia_ctms;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone BIGINT,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    date_created DATE,
    role VARCHAR(100) DEFAULT 'Principal Investigator',
    designation VARCHAR(255)
);

-- 2. Clinical Trials Table
CREATE TABLE IF NOT EXISTS trials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trial_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    phase VARCHAR(50),
    status VARCHAR(50),
    principal_investigator VARCHAR(255),
    site_location VARCHAR(255),
    ctri_number VARCHAR(100),
    ethics_approval_date DATE,
    start_date DATE,
    end_date DATE,
    target_enrollment INT,
    current_enrollment INT DEFAULT 0,
    description TEXT
);

-- 3. Regulatory Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trial_id BIGINT,
    trial_code VARCHAR(100),
    approval_type VARCHAR(100),
    reference_number VARCHAR(100),
    status VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
    document_url VARCHAR(255),
    remarks TEXT,
    FOREIGN KEY (trial_id) REFERENCES trials(id) ON DELETE CASCADE
);

-- 4. Participants Table
CREATE TABLE IF NOT EXISTS participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_code VARCHAR(100) NOT NULL UNIQUE,
    trial_id BIGINT,
    trial_code VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    contact_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Screened',
    consent_status VARCHAR(50) DEFAULT 'Pending',
    consent_date DATE,
    dosha_type VARCHAR(100),
    randomized_group VARCHAR(255),
    enrollment_date DATE,
    FOREIGN KEY (trial_id) REFERENCES trials(id) ON DELETE SET NULL
);

-- 5. Visits Table
CREATE TABLE IF NOT EXISTS visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT,
    participant_code VARCHAR(100),
    trial_id BIGINT,
    trial_code VARCHAR(100),
    visit_name VARCHAR(255) NOT NULL,
    visit_type VARCHAR(100),
    scheduled_date DATE,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'Scheduled',
    vitals VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- 6. eCRF Submissions Table
CREATE TABLE IF NOT EXISTS ecrf_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT,
    participant_code VARCHAR(100),
    trial_id BIGINT,
    trial_code VARCHAR(100),
    visit_id BIGINT,
    form_title VARCHAR(255) NOT NULL,
    form_type VARCHAR(100),
    form_data TEXT,
    status VARCHAR(50) DEFAULT 'Submitted',
    submitted_by VARCHAR(255),
    submitted_at DATE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- 7. Prakriti Assessments (Ayurveda) Table
CREATE TABLE IF NOT EXISTS prakriti_assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT,
    participant_code VARCHAR(100),
    vata_score INT DEFAULT 0,
    pitta_score INT DEFAULT 0,
    kapha_score INT DEFAULT 0,
    primary_dosha VARCHAR(50),
    secondary_dosha VARCHAR(50),
    prakriti_type VARCHAR(100),
    responses_json TEXT,
    assessed_at DATE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- 8. Adverse Events and SAE Table
CREATE TABLE IF NOT EXISTS adverse_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trial_id BIGINT,
    trial_code VARCHAR(100),
    participant_id BIGINT,
    participant_code VARCHAR(100),
    event_term VARCHAR(255) NOT NULL,
    onset_date DATE,
    resolved_date DATE,
    severity VARCHAR(50),
    is_sae BOOLEAN DEFAULT FALSE,
    seriousness_criteria VARCHAR(255),
    causality VARCHAR(100),
    outcome VARCHAR(100),
    reported_date DATE,
    ndct_reported BOOLEAN DEFAULT FALSE,
    action_taken VARCHAR(255),
    details TEXT
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    username VARCHAR(255),
    role VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    details TEXT
);

-- 10. System Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'Info',
    target_role VARCHAR(100) DEFAULT 'ALL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME,
    action_url VARCHAR(255)
);

