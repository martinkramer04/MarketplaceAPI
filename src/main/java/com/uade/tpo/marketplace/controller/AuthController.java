package com.uade.tpo.marketplace.controller;

import com.uade.tpo.marketplace.entity.dto.Auth.AuthAuthenticateRequest;
import com.uade.tpo.marketplace.entity.dto.Auth.AuthAuthenticateResponse;
import com.uade.tpo.marketplace.entity.dto.Auth.AuthRegisterRequest;
import com.uade.tpo.marketplace.entity.dto.Auth.UpdateProfileRequest;
import com.uade.tpo.marketplace.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthAuthenticateResponse> register(@RequestBody AuthRegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthAuthenticateResponse> authenticate(@RequestBody AuthAuthenticateRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }

        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }

        return ResponseEntity.ok(authService.updateProfile(authentication.getName(), request));
    }
}