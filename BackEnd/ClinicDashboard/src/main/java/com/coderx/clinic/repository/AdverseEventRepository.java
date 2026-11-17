package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.AdverseEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdverseEventRepository extends JpaRepository<AdverseEvent, Long> {
    List<AdverseEvent> findByTrialId(Long trialId);
    List<AdverseEvent> findByParticipantId(Long participantId);
    List<AdverseEvent> findByIsSae(Boolean isSae);
}

