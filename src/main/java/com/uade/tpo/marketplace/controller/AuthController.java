package com.uade.tpo.marketplace.controller;

import com.uade.tpo.marketplace.entity.dto.Auth.AuthAuthenticateRequest;
import com.uade.tpo.marketplace.entity.dto.Auth.AuthAuthenticateResponse;
import com.uade.tpo.marketplace.entity.dto.Auth.AuthRegisterRequest;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository; 

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
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
        // 🟢 MEJORA DE SEGURIDAD NATIVA: 
        // Spring Security ya parseó el JWT en el filtro. Obtenemos el email/username directo de la sesión.
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }

        String email = authentication.getName(); // Trae el email del token validado
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); //

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "firstname", user.getFirstname(),
                "lastname", user.getLastname(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }
}