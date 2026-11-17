package com.coderx.clinic.repository;

import com.coderx.clinic.Entity.Trial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrialRepository extends JpaRepository<Trial, Long> {
    Optional<Trial> findByTrialCode(String trialCode);
}

