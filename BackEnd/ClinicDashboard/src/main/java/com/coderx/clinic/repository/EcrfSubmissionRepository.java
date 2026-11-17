package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.EcrfSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcrfSubmissionRepository extends JpaRepository<EcrfSubmission, Long> {
    List<EcrfSubmission> findByParticipantId(Long participantId);
    List<EcrfSubmission> findByTrialId(Long trialId);
}

