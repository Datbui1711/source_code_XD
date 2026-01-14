package com.careermate.job.repository;

import com.careermate.job.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByCandidateEmail(String candidateEmail);
    Optional<Application> findByJobIdAndCandidateEmail(Long jobId, String candidateEmail);
}
