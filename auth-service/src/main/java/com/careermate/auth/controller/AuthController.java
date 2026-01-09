package com.careermate.auth.controller;

import com.careermate.auth.dto.*;
import com.careermate.auth.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and Authorization APIs")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<Void> logout(Authentication authentication) {
        authenticationService.logout(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(authenticationService.getAllUsers());
    }

    @PutMapping("/users/{userId}/deactivate")
    @Operation(summary = "Deactivate user (Admin only)")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        authenticationService.deactivateUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}")
    @Operation(summary = "Update user (Admin only)")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(authenticationService.updateUser(userId, request));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete user (Admin only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        authenticationService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }
}
