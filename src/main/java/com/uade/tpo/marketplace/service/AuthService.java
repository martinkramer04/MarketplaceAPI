package com.uade.tpo.marketplace.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.dto.Auth.*;
import com.uade.tpo.marketplace.config.JwtService;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.repository.UserRepository;

import java.util.Map;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;


        public AuthAuthenticateResponse register(AuthRegisterRequest request) {

                if (repository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already in use");
                }

                var user = User.builder()
                                .firstname(request.getFirstname())
                                .lastname(request.getLastname())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole())
                                .build();

                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthAuthenticateResponse.builder()
                                .accessToken(jwtToken)
                                .build();
    }

    public AuthAuthenticateResponse authenticate(AuthAuthenticateRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthAuthenticateResponse.builder()
                                .accessToken(jwtToken)
                                .build();
    }

    public Map<String, Object> getCurrentUser(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return Map.of(
                "id", user.getId(),
                "firstname", user.getFirstname(),
                "lastname", user.getLastname(),
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }

    public Map<String, Object> updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = repository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getFirstname() != null && !request.getFirstname().isBlank()) {
            user.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null && !request.getLastname().isBlank()) {
            user.setLastname(request.getLastname());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank() && !request.getEmail().equals(currentEmail)) {
            if (repository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        repository.save(user);
        // Email may have changed, so we always issue a fresh token
        String newToken = jwtService.generateToken(user);

        return Map.of(
                "id", user.getId(),
                "firstname", user.getFirstname(),
                "lastname", user.getLastname(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "access_token", newToken
        );
    }

}
