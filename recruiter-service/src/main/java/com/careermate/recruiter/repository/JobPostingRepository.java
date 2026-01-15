package com.careermate.recruiter.repository;

import com.careermate.recruiter.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByRecruiterId(Long recruiterId);
    List<JobPosting> findByStatus(String status);
}
