 package com.uade.tpo.marketplace.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.marketplace.entity.dto.Auth.AuthAuthenticateRequest;
import com.uade.tpo.marketplace.entity.dto.Auth.AuthAuthenticateResponse;
import com.uade.tpo.marketplace.entity.dto.Auth.AuthRegisterRequest;
import com.uade.tpo.marketplace.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthAuthenticateResponse> register(@RequestBody AuthRegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthAuthenticateResponse> authenticate(@RequestBody AuthAuthenticateRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    
    
}