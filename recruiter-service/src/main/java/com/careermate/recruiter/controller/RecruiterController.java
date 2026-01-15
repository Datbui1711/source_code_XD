package com.careermate.recruiter.controller;

import com.careermate.recruiter.dto.CVAnalysisResult;
import com.careermate.recruiter.entity.Application;
import com.careermate.recruiter.entity.JobPosting;
import com.careermate.recruiter.repository.ApplicationRepository;
import com.careermate.recruiter.repository.JobPostingRepository;
import com.careermate.recruiter.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {
    
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;
    private final AIService aiService;
    
    public RecruiterController(JobPostingRepository jobPostingRepository, 
                              ApplicationRepository applicationRepository,
                              AIService aiService) {
        this.jobPostingRepository = jobPostingRepository;
        this.applicationRepository = applicationRepository;
        this.aiService = aiService;
    }
    
    @PostMapping("/jobs")
    public ResponseEntity<?> createJobPosting(@RequestBody JobPosting jobPosting) {
        // Upload JD to AI service
        Integer aiJdId = aiService.uploadJobDescription(jobPosting.getDescription(), jobPosting.getIndustry());
        jobPosting.setAiJdId(aiJdId);
        
        JobPosting saved = jobPostingRepository.save(jobPosting);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> getMyJobs(@RequestParam Long recruiterId) {
        return ResponseEntity.ok(jobPostingRepository.findByRecruiterId(recruiterId));
    }
    
    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobPosting> getJobById(@PathVariable Long id) {
        return jobPostingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/jobs/{jobId}/analyze-cvs")
    public ResponseEntity<?> analyzeCVsForJob(
            @PathVariable Long jobId,
            @RequestParam("files") List<MultipartFile> files) throws Exception {
        
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        // Analyze CVs using AI service
        List<CVAnalysisResult> results = aiService.analyzeCVs(job.getAiJdId(), files);
        
        // Save applications with AI analysis
        for (CVAnalysisResult result : results) {
            Application app = new Application();
            app.setJobPostingId(jobId);
            app.setCvFilename(result.getFilename());
            app.setMatchingScore(result.getOverallScore());
            app.setAiCvId(result.getCvId());
            app.setAiAnalysis(result.toString());
            app.setStatus("ANALYZED");
            applicationRepository.save(app);
        }
        
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepository.findByJobPostingIdOrderByMatchingScoreDesc(jobId));
    }
    
    @GetMapping("/jobs/{jobId}/rankings")
    public ResponseEntity<?> getCVRankings(@PathVariable Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        List<CVAnalysisResult> rankings = aiService.getRankings(job.getAiJdId());
        return ResponseEntity.ok(rankings);
    }
    
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        app.setStatus(status);
        return ResponseEntity.ok(applicationRepository.save(app));
    }
}
