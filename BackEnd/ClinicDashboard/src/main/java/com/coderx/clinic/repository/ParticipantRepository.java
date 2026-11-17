package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Optional<Participant> findByParticipantCode(String participantCode);
    List<Participant> findByTrialId(Long trialId);
    List<Participant> findByTrialCode(String trialCode);
    List<Participant> findByStatus(String status);
}

