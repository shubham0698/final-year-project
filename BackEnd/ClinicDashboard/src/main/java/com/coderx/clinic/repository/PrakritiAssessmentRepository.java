package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.PrakritiAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrakritiAssessmentRepository extends JpaRepository<PrakritiAssessment, Long> {
    Optional<PrakritiAssessment> findByParticipantId(Long participantId);
}

