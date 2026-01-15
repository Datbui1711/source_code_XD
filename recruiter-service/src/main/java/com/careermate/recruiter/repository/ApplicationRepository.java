package com.careermate.recruiter.repository;

import com.careermate.recruiter.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobPostingId(Long jobPostingId);
    List<Application> findByJobPostingIdOrderByMatchingScoreDesc(Long jobPostingId);
    List<Application> findByCandidateId(Long candidateId);
}
