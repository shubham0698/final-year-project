package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findByParticipantId(Long participantId);
    List<Visit> findByTrialId(Long trialId);
    List<Visit> findByStatus(String status);
}

