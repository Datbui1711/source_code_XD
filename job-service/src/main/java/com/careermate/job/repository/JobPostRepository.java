package com.careermate.job.repository;

import com.careermate.job.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    List<JobPost> findByIsActiveTrue();
    
    @Query("SELECT j FROM JobPost j WHERE j.isActive = true AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<JobPost> searchJobs(@Param("keyword") String keyword);
    
    List<JobPost> findByLocationContainingIgnoreCase(String location);
    
    List<JobPost> findByRecruiterId(Long recruiterId);
    
    List<JobPost> findByRecruiterEmailAndIsActiveTrue(String recruiterEmail);
}
