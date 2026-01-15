package com.careermate.recruiter.dto;

import java.util.List;
import java.util.Map;

public class CVAnalysisResult {
    private Integer cvId;
    private String filename;
    private Double overallScore;
    private Map<String, Double> categoryScores;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> weaknesses;

    // Getters and Setters
    public Integer getCvId() { return cvId; }
    public void setCvId(Integer cvId) { this.cvId = cvId; }
    
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    
    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
    
    public Map<String, Double> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(Map<String, Double> categoryScores) { this.categoryScores = categoryScores; }
    
    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }
    
    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }
    
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    
    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
}
