# AIIA Clinical Trial Management System (CTMS)

**A Digital Platform for Managing Ayurveda Clinical Trials**

![Project Status](https://img.shields.io/badge/Project-In%20Development-orange)
![Frontend](https://img.shields.io/badge/Frontend-React.js-blue)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-green)
![Database](https://img.shields.io/badge/Database-MySQL%208-blue)
![Language](https://img.shields.io/badge/Java-17%2B-orange)

---

## 1. Project Overview

The **AIIA Clinical Trial Management System (CTMS)** is a web-based platform designed to streamline and digitize the management of Ayurveda clinical trials.

The platform aims to provide a centralized environment for managing the complete clinical trial lifecycle, including trial creation, regulatory approvals, participant recruitment, informed consent, randomization, visit scheduling, electronic clinical data collection, adverse event monitoring, and trial reporting.

The system will provide role-based access to different stakeholders, ensuring secure access to clinical trial information and maintaining a complete, timestamped audit trail of user activities.

It will also support Ayurveda-specific clinical assessments, including Prakriti assessment, and facilitate standardized clinical research data exchange through CDISC-aligned and HL7 FHIR-compatible exports.

The primary objective is to improve clinical trial efficiency, data quality, transparency, traceability, and regulatory compliance.

## 2. Problem Statement

Clinical trial management involves several interconnected activities, including participant recruitment, regulatory documentation, clinical data collection, safety monitoring, and reporting.

When these activities are managed through disconnected spreadsheets, paper-based records, or independent applications, organizations may face challenges such as:

- Difficulty managing multiple clinical trials.
- Fragmented participant information.
- Manual tracking of regulatory approvals and expiry dates.
- Inefficient participant screening and enrollment.
- Difficulties in scheduling and tracking clinical visits.
- Inconsistent clinical data collection.
- Delayed identification and reporting of adverse events.
- Limited visibility into trial performance.
- Insufficient traceability of changes made to clinical records.
- Challenges in exchanging clinical research data using standardized formats.

The proposed system addresses these challenges through a centralized, secure, and integrated clinical trial management platform.

## 3. Project Objectives

The primary objectives of the proposed system are:

1. To provide secure authentication and role-based access control for all authorized system users.
2. To maintain a complete, timestamped, and traceable audit trail of user activities.
3. To create and manage clinical trials throughout their lifecycle.
4. To track Ethics Committee, CTRI, and applicable NDCT Rules 2019 regulatory requirements and approvals.
5. To prevent participant enrollment when required approvals are missing, invalid, or expired.
6. To manage participants through screening, eligibility verification, informed consent, and randomization.
7. To automatically generate participant visit schedules and monitor visit completion.
8. To capture clinical information using Electronic Case Report Forms (eCRFs).
9. To implement clinical data validation, range checks, and data query management.
10. To support Ayurveda-specific assessments such as Prakriti.
11. To record and monitor Adverse Events (AE) and Serious Adverse Events (SAE).
12. To provide role-wise dashboards, performance indicators, and timely notifications.
13. To support clinical research data exchange through CDISC-aligned and HL7 FHIR-compatible formats.

## 4. Key Features and Modules

### 4.1 Authentication and User Management

- Secure user login and logout.
- JWT-based authentication.
- Password hashing using BCrypt.
- Role-Based Access Control (RBAC).
- Permission-based resource access.
- User account management.
- Protected API endpoints.
- Secure session and token management.

### 4.2 Trial Lifecycle Management

- Clinical trial creation and configuration.
- Trial protocol management.
- Investigator and trial site management.
- Trial status tracking.
- Trial milestone management.
- Recruitment and enrollment monitoring.
- Trial lifecycle management from initiation to close-out.

### 4.3 Regulatory and Compliance Management

- Ethics Committee approval tracking.
- CTRI registration tracking.
- Applicable NDCT Rules 2019 requirements.
- Approval reference and validity tracking.
- Approval document management.
- Approval renewal and amendment history.
- Approval expiry notifications.
- Automated enrollment eligibility checks based on required approvals.

### 4.4 Participant Management

- Participant registration.
- Unique participant identification.
- Screening management.
- Inclusion and exclusion criteria verification.
- Eligibility assessment.
- Informed consent recording.
- Consent document and version management.
- Participant status tracking.
- Controlled participant randomization.

### 4.5 Visit Management

- Protocol-based visit templates.
- Automatic visit schedule generation.
- Participant-specific visit tracking.
- Visit completion status.
- Missed visit identification.
- Overdue visit identification.
- Follow-up reminders.
- Visit deviation tracking.

### 4.6 Electronic Clinical Data Management

- Electronic Case Report Form (eCRF) management.
- Dynamic clinical data entry forms.
- eCRF template and version management.
- Required field validation.
- Minimum and maximum range checks.
- Data type validation.
- Missing data identification.
- Data query creation and resolution.
- Clinical data review and locking.
- Traceable clinical data corrections.

### 4.7 Ayurveda-Specific Assessments

- Prakriti assessment management.
- Questionnaire-based assessment.
- Individual response recording.
- Assessment scoring and classification.
- Storage of Ayurveda-specific clinical observations.
- Integration of Ayurveda assessments into eCRF workflows.

### 4.8 Adverse Event and Safety Management

- Adverse Event (AE) recording.
- Serious Adverse Event (SAE) identification.
- Severity and seriousness classification.
- Relationship assessment.
- Event outcome tracking.
- SAE reporting deadline monitoring.
- Safety report management.
- Follow-up report tracking.
- Safety-related alerts and notifications.

### 4.9 Dashboard and Analytics

- Role-based dashboards.
- Active clinical trial statistics.
- Participant recruitment analytics.
- Trial progress monitoring.
- Visit completion statistics.
- Pending clinical data queries.
- AE and SAE statistics.
- Regulatory approval status.
- Upcoming deadlines and overdue activities.
- Performance indicators and visual reports.

### 4.10 Audit Trail and Notifications

- Timestamped user activity records.
- User action tracking.
- Before-and-after value tracking for relevant changes.
- Clinical record change history.
- Approval expiry alerts.
- Upcoming and overdue visit reminders.
- Pending data query notifications.
- SAE reporting deadline alerts.
- Notification delivery and acknowledgement tracking where applicable.

### 4.11 Data Export and Interoperability

- CDISC-aligned clinical research data exports.
- SDTM-oriented data mapping.
- HL7 FHIR-compatible data exports.
- Standardized JSON data exchange.
- Export validation.
- Export history and status tracking.

## 5. Technology Stack

The project uses the following technologies:

### Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface development |
| JavaScript (JSX) | Frontend programming |
| React Router | Client-side navigation |
| Axios | REST API communication |
| Charting Library | Data visualization and analytics |
| HTML5 | Web page structure |
| CSS3 | Styling and responsive layouts |

### Backend

| Technology | Purpose |
|---|---|
| Java 17 or later | Backend programming |
| Spring Boot | Backend application framework |
| Spring Web | REST API development |
| Spring Security | Authentication and authorization |
| JWT | Token-based authentication |
| Spring Data JPA | Database operations |
| Hibernate | Object-relational mapping |
| Maven | Dependency and build management |

### Database

| Technology | Purpose |
|---|---|
| MySQL 8.x | Relational database |
| MySQL Workbench | Database design and administration |

### Testing and Documentation

| Technology | Purpose |
|---|---|
| JUnit 5 | Unit testing |
| Mockito | Mock-based testing |
| Postman | REST API testing |
| Swagger / OpenAPI | API documentation |

### Development Tools

| Tool | Purpose |
|---|---|
| IntelliJ IDEA / Eclipse | Java backend development |
| Visual Studio Code | React frontend development |
| Node.js | JavaScript runtime and tooling |
| npm | Frontend package management |
| Git | Version control |
| GitHub | Source code hosting and collaboration |

## 6. System Architecture

The application follows a **Modular Monolith Architecture** with a layered backend structure.

The React frontend communicates with the Spring Boot backend through REST APIs. Spring Security validates incoming requests, while Spring Data JPA and Hibernate handle database operations.

### Architecture Overview

```text
                  SYSTEM USERS
                       |
                       v
              REACT.JS FRONTEND
                   (JSX)
                       |
              +--------+--------+
              |                 |
         React Router        Axios
              |                 |
              +--------+--------+
                       |
                       v
              SPRING BOOT BACKEND
                       |
                SPRING SECURITY
                  + JWT
                       |
                 REST CONTROLLERS
                       |
                  SERVICE LAYER
                       |
                REPOSITORY LAYER
                       |
               SPRING DATA JPA
                       |
                   HIBERNATE
                       |
                       v
                  MYSQL 8.x
```

### Backend Layer Responsibilities

| Layer | Responsibility |
|---|---|
| Controller | Handles HTTP requests and responses |
| Service | Implements application business logic |
| Repository | Performs database operations |
| Entity | Represents database entities |
| DTO | Transfers data between frontend and backend |
| Security | Handles authentication and authorization |
| Configuration | Manages application configurations |

## 7. Project Directory Structure

The project is organized into separate frontend and backend applications within a single repository.

```text
AIIA-Clinical-Trial-System/
│
├── backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aiia/ctms/
│   │   │   │   │
│   │   │   │   ├── config/
│   │   │   │   ├── security/
│   │   │   │   ├── auth/
│   │   │   │   ├── user/
│   │   │   │   ├── trial/
│   │   │   │   ├── compliance/
│   │   │   │   ├── participant/
│   │   │   │   ├── consent/
│   │   │   │   ├── randomization/
│   │   │   │   ├── visit/
│   │   │   │   ├── edc/
│   │   │   │   ├── safety/
│   │   │   │   ├── audit/
│   │   │   │   ├── notification/
│   │   │   │   ├── analytics/
│   │   │   │   ├── integration/
│   │   │   │   └── common/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/
│   │   │           └── migration/
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── documentation/
│   ├── architecture/
│   ├── api/
│   └── diagrams/
│
├── .gitignore
└── README.md
```

Individual backend modules will contain their own controllers, services, repositories, entities, and DTOs.

## 8. Database Design

The application uses MySQL 8.x as its relational database.

The database is designed around the major functional modules of the clinical trial management system.

### Main Database Entities

| Module | Main Tables |
|---|---|
| Authentication | users, roles, permissions, user_roles |
| Audit | audit_logs |
| Trial | trials, trial_sites, trial_protocols, trial_milestones |
| Compliance | approvals, approval_documents, approval_history |
| Participants | participants, screenings, eligibility_assessments |
| Consent | consent_records, consent_versions |
| Randomization | randomization_assignments, randomization_sequences |
| Visits | visit_templates, visit_schedules, visit_records |
| Clinical Data | ecrf_templates, ecrf_versions, ecrf_fields, ecrf_submissions |
| Data Quality | data_queries, query_responses, data_reviews |
| Ayurveda | prakriti_assessments, prakriti_responses |
| Safety | adverse_events, sae_reports, safety_followups |
| Notifications | notifications, notification_preferences |
| Documents | documents, document_versions |
| Integration | export_jobs, export_records, integration_logs |

The final database schema will include appropriate primary keys, foreign keys, indexes, constraints, and relationships.

## 9. User Roles

The application will support role-based access for the following users:

| Role | Responsibilities |
|---|---|
| Admin | User management and system configuration |
| Principal Investigator | Trial supervision and clinical oversight |
| Study Coordinator | Participant and visit management |
| Clinical Monitor | Trial monitoring and data review |
| Ethics Committee | Ethics approval and review |
| Pharmacovigilance Officer | AE/SAE monitoring and safety reporting |
| Leadership | Organization-level analytics and monitoring |
| Regulator | Authorized read-only access |

Access permissions will be enforced on the backend using Spring Security, not only through frontend navigation.

## 10. Installation and Setup

Follow the instructions below to set up the project locally.

### Prerequisites

Install the following software:

- Java Development Kit (JDK 17 or later).
- Apache Maven.
- Node.js and npm.
- MySQL Server 8.x.
- MySQL Workbench.
- IntelliJ IDEA or Eclipse.
- Visual Studio Code.
- Git.

Verify the installations:

```bash
java -version
mvn -version
node -v
npm -v
git --version
```

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd AIIA-Clinical-Trial-System
```

### Step 2: Configure the Database

For **quick prototype evaluation & demonstration**, the Spring Boot backend comes pre-configured with a **zero-setup embedded database** with rich sample AIIA clinical trial data seeded automatically upon startup.

For **production deployment with MySQL 8.x**:
1. Start MySQL Server and open MySQL Workbench.
2. Execute the schema script located at [database/schema.sql](file:///c:/Users/Shubham/Desktop/project/database/schema.sql):
   ```sql
   CREATE DATABASE aiia_ctms;
   ```
3. In `BackEnd/src/main/resources/application.properties`, uncomment the MySQL datasource properties:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/aiia_ctms?createDatabaseIfNotExist=true&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### Step 3: Configure and Run the Backend

Navigate to the `BackEnd` directory:

```bash
cd BackEnd
```

Build and run using the included Maven wrapper script (which automatically detects installed Maven or IDE runtime):

```bash
# On Windows PowerShell / Command Prompt:
.\mvnw.cmd spring-boot:run

# Or with global Maven:
mvn spring-boot:run
```

The backend REST API will run at:
```text
http://localhost:8080
```
- **H2 Web Console**: `http://localhost:8080/h2-console`
- **REST Endpoints**: `http://localhost:8080/api/...`

### Step 4: Configure and Run the Frontend

Open another terminal and navigate to the `FrontEnd` directory:

```bash
cd FrontEnd
```

Install dependencies (already scaffolded):

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will run at:
```text
http://localhost:5173
```

### Step 5: Connect Frontend and Backend

Configure the Axios API base URL to point to the Spring Boot backend.

Example:

```javascript
// src/services/api.js

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
```

Configure backend CORS policies to allow the frontend development origin.

## 11. API Documentation

The backend exposes RESTful APIs for communication between the frontend and backend.

The following are proposed API endpoints.

| Module | HTTP Method | Endpoint |
|---|---|---|
| Authentication | POST | /api/auth/login |
| Authentication | POST | /api/auth/refresh |
| Users | GET | /api/users |
| Trials | GET | /api/trials |
| Trials | POST | /api/trials |
| Trials | GET | /api/trials/{id} |
| Approvals | POST | /api/trials/{id}/approvals |
| Participants | POST | /api/trials/{id}/participants |
| Screening | POST | /api/participants/{id}/screening |
| Consent | POST | /api/participants/{id}/consent |
| Randomization | POST | /api/participants/{id}/randomize |
| Visits | GET | /api/participants/{id}/visits |
| eCRF | POST | /api/ecrf/submissions |
| Safety | POST | /api/adverse-events |
| Analytics | GET | /api/dashboard/kpis |
| Audit | GET | /api/audit-logs |
| Export | POST | /api/exports/cdisc |
| Export | POST | /api/exports/fhir |

API specifications will be documented using Swagger / OpenAPI.

## 12. Security Considerations

Since the platform handles sensitive clinical research information, security is a fundamental requirement.

The application will implement:

- JWT-based authentication.
- Spring Security authorization.
- BCrypt password hashing.
- Role-based and permission-based access control.
- Secure token handling and expiration.
- HTTPS for data transmission.
- Input validation and sanitization.
- Protection against unauthorized database access.
- Secure document access.
- Timestamped audit logging.
- Traceable clinical data modifications.
- Database backup and recovery procedures.
- Appropriate encryption for stored sensitive information.

Clinical records and audit logs must not be silently modified or deleted through ordinary application operations.

## 13. Testing Strategy

Testing will be performed at different levels.

| Testing Type | Tools | Purpose |
|---|---|---|
| Unit Testing | JUnit 5 | Test individual application components |
| Mock Testing | Mockito | Test services and dependencies |
| Integration Testing | Spring Boot Test | Verify module integration |
| API Testing | Postman | Validate REST endpoints |
| Security Testing | Spring Security tests | Verify access restrictions |
| Frontend Testing | React Testing Library | Test UI components |
| End-to-End Testing | Selected browser testing tools | Validate complete user workflows |

### Important Test Scenarios

1. Users cannot access endpoints without authentication.
2. Unauthorized roles cannot access restricted resources.
3. Enrollment is blocked when required approvals are expired.
4. Participants cannot be enrolled without valid informed consent.
5. Ineligible participants cannot be randomized.
6. Invalid eCRF values are rejected or flagged.
7. Clinical data modifications generate audit events.
8. Missed and overdue visits are identified correctly.
9. SAE reporting deadlines are monitored correctly.
10. Generated data exports pass the relevant format validation.

## 14. Development Roadmap

The project will be developed incrementally.

| Phase | Development Activities |
|---|---|
| Phase 1 | Project setup and database configuration |
| Phase 2 | JPA entities and database relationships |
| Phase 3 | REST API development |
| Phase 4 | JWT authentication and Spring Security |
| Phase 5 | Trial and regulatory management |
| Phase 6 | Participant, consent and randomization |
| Phase 7 | Visit management |
| Phase 8 | eCRF and Ayurveda assessments |
| Phase 9 | AE/SAE management |
| Phase 10 | Audit trail and notifications |
| Phase 11 | React frontend integration |
| Phase 12 | Role-based dashboards and analytics |
| Phase 13 | CDISC and HL7 FHIR integration |
| Phase 14 | Testing and deployment |

## 15. Regulatory and Standards Considerations

The system is intended to support clinical research workflows and relevant regulatory documentation.

The implementation will consider:

- New Drugs and Clinical Trials Rules, 2019, where applicable.
- Central Drugs Standard Control Organisation (CDSCO) requirements.
- Clinical Trials Registry - India (CTRI).
- Applicable Ethics Committee requirements.
- Good Clinical Practice (GCP).
- Applicable Indian data protection requirements.
- CDISC clinical research data standards.
- HL7 FHIR interoperability standards.

Regulatory applicability and reporting obligations must be verified against current official requirements, amendments, trial protocols, and applicable guidance.

**Note:** Implementing software controls does not independently establish regulatory approval or guarantee GCP compliance. Appropriate organizational procedures, validation, and authorized oversight remain necessary.

## 16. Future Enhancements

Potential future improvements include:

- Advanced clinical research analytics.
- Configurable eCRF form builder.
- Automated data quality analysis.
- Advanced regulatory reporting.
- Integration with external healthcare information systems.
- Expanded Ayurveda-specific assessment libraries.
- Enhanced trial monitoring and deviation management.
- Electronic signatures and validated electronic record workflows.
- Advanced reporting and visualization.
- Multi-center clinical trial support.

## 17. Contribution Guidelines

Contributions to the project should follow a structured development workflow.

1. Fork the repository.
2. Create a new feature branch.
3. Implement the required functionality.
4. Test the changes.
5. Commit the changes with meaningful messages.
6. Push the branch to GitHub.
7. Submit a Pull Request.

Example:

```bash
git checkout -b feature/trial-management

git add .

git commit -m "Add clinical trial management module"

git push origin feature/trial-management
```

All contributions should follow the project's coding conventions and security requirements.

## 18. Project Status

**Current Status:** Under Development

The application is planned as a modular clinical trial management platform. Individual modules will be implemented and integrated incrementally.

## 19. License

The licensing terms for this project are yet to be finalized.

Do not assume that the project is open-source or redistribute it under an open-source license until the project owners have selected and approved the applicable license.

## 20. Acknowledgement

This project is developed as part of the Smart India Hackathon (SIH) initiative.

**Project:** AIIA Clinical Trial Management System

**Domain:** Healthcare / Clinical Research / Ayurveda

**Focus:** Digitalization of Clinical Trial Management and Research Data Management

---

**AIIA Clinical Trial Management System**

*Streamlining Clinical Research Through Secure, Integrated, and Intelligent Digital Solutions.*