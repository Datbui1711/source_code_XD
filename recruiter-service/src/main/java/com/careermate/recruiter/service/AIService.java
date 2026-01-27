package com.careermate.recruiter.service;

import com.careermate.recruiter.dto.CVAnalysisResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class AIService {
    
    @Value("${ai.service.url}")
    private String aiServiceUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    public Integer uploadJobDescription(String jdContent, String industry) {
        String url = aiServiceUrl + "/api/ai/upload-jd";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("text", jdContent);
        body.add("industry", industry);
        
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        return (Integer) response.getBody().get("jd_id");
    }
    
    public List<CVAnalysisResult> analyzeCVs(Integer jdId, List<MultipartFile> cvFiles) throws IOException {
        String url = aiServiceUrl + "/api/ai/analyze-cvs";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("jd_id", jdId);
        
        for (MultipartFile file : cvFiles) {
            File tempFile = File.createTempFile("cv_", file.getOriginalFilename());
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(file.getBytes());
            }
            body.add("files", new FileSystemResource(tempFile));
        }
        
        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        
        ResponseEntity<List> response = restTemplate.postForEntity(url, request, List.class);
        return (List<CVAnalysisResult>) response.getBody();
    }
    
    public List<CVAnalysisResult> getRankings(Integer jdId) {
        String url = aiServiceUrl + "/api/ai/rankings/" + jdId;
        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
        return (List<CVAnalysisResult>) response.getBody();
    }
}
