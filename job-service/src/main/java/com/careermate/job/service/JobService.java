package com.careermate.job.service;

import com.careermate.job.dto.ApplicationResponse;
import com.careermate.job.dto.JobPostResponse;
import com.careermate.job.entity.Application;
import com.careermate.job.entity.JobPost;
import com.careermate.job.repository.ApplicationRepository;
import com.careermate.job.repository.JobPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {
    
    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<JobPostResponse> getAllJobs() {
        return jobPostRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<JobPostResponse> searchJobs(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllJobs();
        }
        return jobPostRepository.searchJobs(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<JobPostResponse> getMyJobs(String recruiterEmail) {
        return jobPostRepository.findByRecruiterEmailAndIsActiveTrue(recruiterEmail).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public JobPostResponse getJobById(Long id) {
        JobPost job = jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return convertToResponse(job);
    }

    public JobPostResponse createJob(JobPost jobPost) {
        jobPost.setIsActive(true);
        JobPost saved = jobPostRepository.save(jobPost);
        return convertToResponse(saved);
    }

    public ApplicationResponse applyForJob(Long jobId, String candidateEmail, String coverLetter, String cvContent, String cvFileName) {
        // Check if job exists
        JobPost job = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Check if already applied
        if (applicationRepository.findByJobIdAndCandidateEmail(jobId, candidateEmail).isPresent()) {
            throw new IllegalStateException("You have already applied for this job");
        }

        // Create application
        Application application = new Application();
        application.setJobId(jobId);
        application.setCandidateEmail(candidateEmail);
        application.setCoverLetter(coverLetter);
        application.setCvContent(cvContent);
        application.setCvFileName(cvFileName);
        application.setStatus("PENDING");

        Application saved = applicationRepository.save(application);
        return convertToApplicationResponse(saved);
    }

    public List<ApplicationResponse> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::convertToApplicationResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        // Validate status
        if (!status.equals("APPROVED") && !status.equals("REJECTED") && !status.equals("PENDING")) {
            throw new IllegalStateException("Invalid status. Must be APPROVED, REJECTED, or PENDING");
        }
        
        application.setStatus(status);
        Application updated = applicationRepository.save(application);
        
        // If approved, check if job slots are full and auto-reject others
        if (status.equals("APPROVED")) {
            autoRejectIfSlotsFull(application.getJobId());
        }
        
        return convertToApplicationResponse(updated);
    }

    public List<ApplicationResponse> getCandidateApplications(String candidateEmail) {
        return applicationRepository.findByCandidateEmail(candidateEmail).stream()
                .map(this::convertToApplicationResponse)
                .collect(Collectors.toList());
    }
    
    private void autoRejectIfSlotsFull(Long jobId) {
        // Get job and check available slots
        JobPost job = jobPostRepository.findById(jobId).orElse(null);
        if (job == null || job.getAvailableSlots() == null) {
            return;
        }
        
        // Count approved applications
        List<Application> allApplications = applicationRepository.findByJobId(jobId);
        long approvedCount = allApplications.stream()
                .filter(app -> "APPROVED".equals(app.getStatus()))
                .count();
        
        // If slots are full, auto-reject pending applications
        if (approvedCount >= job.getAvailableSlots()) {
            allApplications.stream()
                    .filter(app -> "PENDING".equals(app.getStatus()))
                    .forEach(app -> {
                        app.setStatus("REJECTED");
                        applicationRepository.save(app);
                    });
        }
    }

    private JobPostResponse convertToResponse(JobPost job) {
        JobPostResponse response = new JobPostResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setCompanyName(job.getCompanyName());
        response.setLocation(job.getLocation());
        response.setSalaryRange(job.getSalaryRange());
        response.setEmploymentType(job.getEmploymentType());
        response.setExperienceRequired(job.getExperienceRequired());
        response.setRequirements(job.getRequirements());
        response.setAvailableSlots(job.getAvailableSlots());
        response.setCreatedAt(job.getCreatedAt());
        return response;
    }

    private ApplicationResponse convertToApplicationResponse(Application app) {
        ApplicationResponse response = new ApplicationResponse(
            app.getId(),
            app.getJobId(),
            app.getCandidateEmail(),
            app.getCoverLetter(),
            app.getStatus(),
            app.getAppliedAt()
        );
        response.setCvContent(app.getCvContent());
        response.setCvFileName(app.getCvFileName());
        
        // Add job details
        JobPost job = jobPostRepository.findById(app.getJobId()).orElse(null);
        if (job != null) {
            response.setJobTitle(job.getTitle());
            response.setCompanyName(job.getCompanyName());
        }
        
        return response;
    }
}
