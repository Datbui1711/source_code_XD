package com.careermate.candidate.controller;

import com.careermate.candidate.dto.ProfileResponse;
import com.careermate.candidate.entity.Badge;
import com.careermate.candidate.entity.Profile;
import com.careermate.candidate.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(candidateService.getProfile(email));
    }

    @PostMapping("/profile")
    public ResponseEntity<ProfileResponse> createProfile(@RequestBody Profile profile) {
        return ResponseEntity.ok(candidateService.createProfile(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(@RequestParam String email, @RequestBody Profile profile) {
        return ResponseEntity.ok(candidateService.updateProfile(email, profile));
    }

    @GetMapping("/badges")
    public ResponseEntity<List<Badge>> getBadges(@RequestParam Long userId) {
        return ResponseEntity.ok(candidateService.getBadges(userId));
    }

    @PostMapping("/cv/upload")
    public ResponseEntity<String> uploadCV() {
        return ResponseEntity.ok("{\"message\":\"CV upload feature coming soon\"}");
    }

    @GetMapping("/quizzes")
    public ResponseEntity<String> getQuizzes() {
        return ResponseEntity.ok(
                "[{\"id\":1,\"title\":\"JavaScript Fundamentals\",\"duration\":30},{\"id\":2,\"title\":\"React Advanced\",\"duration\":45}]");
    }
}
