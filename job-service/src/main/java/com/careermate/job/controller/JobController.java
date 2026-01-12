package com.careermate.job.controller;

import com.careermate.job.dto.ApplicationRequest;
import com.careermate.job.dto.ApplicationResponse;
import com.careermate.job.dto.JobPostResponse;
import com.careermate.job.entity.JobPost;
import com.careermate.job.service.JobService;
import com.careermate.job.util.DocumentParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/search")
    public ResponseEntity<List<JobPostResponse>> searchJobs(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobPostResponse>> getMyJobs(@RequestHeader("X-User-Email") String recruiterEmail) {
        return ResponseEntity.ok(jobService.getMyJobs(recruiterEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping
    public ResponseEntity<JobPostResponse> createJob(@RequestBody JobPost jobPost) {
        return ResponseEntity.ok(jobService.createJob(jobPost));
    }

    @PostMapping(value = "/{id}/apply", consumes = {"multipart/form-data"})
    public ResponseEntity<ApplicationResponse> applyForJob(
            @PathVariable Long id,
            @RequestParam(required = false) String coverLetter,
            @RequestParam(required = false) String candidateEmail,
            @RequestParam(required = false) String cvText,
            @RequestParam(required = false) MultipartFile cvFile,
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail) throws IOException {
        
        // If email not in header, use from request param
        if (headerEmail == null || headerEmail.isEmpty()) {
            candidateEmail = candidateEmail != null ? candidateEmail : headerEmail;
        } else {
            candidateEmail = headerEmail;
        }
        
        // Get CV content from file or text
        String cvContent = cvText;
        String cvFileName = null;
        
        if (cvFile != null && !cvFile.isEmpty()) {
            cvFileName = cvFile.getOriginalFilename();
            
            try {
                // Use DocumentParser to extract text from various file formats
                cvContent = DocumentParser.extractTextFromFile(cvFile);
            } catch (Exception e) {
                cvContent = "Error reading file: " + e.getMessage();
            }
        }
        
        return ResponseEntity.ok(jobService.applyForJob(id, candidateEmail, coverLetter, cvContent, cvFileName));
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<ApplicationResponse>> getJobApplications(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobApplications(id));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {
        return ResponseEntity.ok(jobService.updateApplicationStatus(applicationId, status));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getCandidateApplications(
            @RequestParam String candidateEmail) {
        return ResponseEntity.ok(jobService.getCandidateApplications(candidateEmail));
    }
}
