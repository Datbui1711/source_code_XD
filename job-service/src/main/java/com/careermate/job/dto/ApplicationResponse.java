package com.careermate.job.dto;

import java.time.LocalDateTime;

public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String candidateEmail;
    private String coverLetter;
    private String cvContent;
    private String cvFileName;
    private String status;
    private LocalDateTime appliedAt;
    private String jobTitle;
    private String companyName;

    public ApplicationResponse(Long id, Long jobId, String candidateEmail, String coverLetter, String status, LocalDateTime appliedAt) {
        this.id = id;
        this.jobId = jobId;
        this.candidateEmail = candidateEmail;
        this.coverLetter = coverLetter;
        this.status = status;
        this.appliedAt = appliedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public String getCvContent() { return cvContent; }
    public void setCvContent(String cvContent) { this.cvContent = cvContent; }

    public String getCvFileName() { return cvFileName; }
    public void setCvFileName(String cvFileName) { this.cvFileName = cvFileName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}
