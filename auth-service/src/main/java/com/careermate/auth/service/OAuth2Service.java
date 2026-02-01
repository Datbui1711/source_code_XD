package com.careermate.auth.service;

import com.careermate.auth.dto.TokenResponse;
import com.careermate.auth.entity.Role;
import com.careermate.auth.entity.User;
import com.careermate.auth.repository.UserRepository;
import com.careermate.auth.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class OAuth2Service {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
    
    public OAuth2Service(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    public TokenResponse authenticateWithGoogle(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), 
                GsonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(googleClientId))
            .build();
            
            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                throw new RuntimeException("Invalid Google ID token");
            }
            
            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleId = payload.getSubject();
            
            // Find or create user
            User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setPasswordHash(""); // OAuth users don't need password
                    newUser.setOauthProvider("GOOGLE");
                    newUser.setOauthId(googleId);
                    newUser.setRole(Role.CANDIDATE); // Default role
                    newUser.setIsActive(true);
                    return userRepository.save(newUser);
                });
            
            // Update OAuth info if needed
            if (user.getOauthId() == null) {
                user.setOauthProvider("GOOGLE");
                user.setOauthId(googleId);
                userRepository.save(user);
            }
            
            // Generate JWT tokens
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
            );
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
            
            return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .role(user.getRole().name())
                .email(user.getEmail())
                .build();
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to authenticate with Google: " + e.getMessage());
        }
    }
    
    public String getGoogleAuthUrl() {
        return "https://accounts.google.com/o/oauth2/v2/auth?" +
               "client_id=" + googleClientId +
               "&redirect_uri=http://localhost:3000/oauth2/callback" +
               "&response_type=token id_token" +
               "&scope=openid email profile" +
               "&nonce=" + System.currentTimeMillis();
    }
}
