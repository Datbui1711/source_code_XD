package com.careermate.auth.controller;

import com.careermate.auth.dto.TokenResponse;
import com.careermate.auth.service.OAuth2Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/oauth2")
@CrossOrigin(origins = "*")
public class OAuth2Controller {
    
    private final OAuth2Service oauth2Service;
    
    public OAuth2Controller(OAuth2Service oauth2Service) {
        this.oauth2Service = oauth2Service;
    }
    
    @PostMapping("/google")
    public ResponseEntity<TokenResponse> googleLogin(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        TokenResponse response = oauth2Service.authenticateWithGoogle(idToken);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/google/url")
    public ResponseEntity<Map<String, String>> getGoogleAuthUrl() {
        String authUrl = oauth2Service.getGoogleAuthUrl();
        return ResponseEntity.ok(Map.of("authUrl", authUrl));
    }
}
