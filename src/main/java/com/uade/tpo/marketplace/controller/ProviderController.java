package com.uade.tpo.marketplace.controller;
 
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.uade.tpo.marketplace.entity.Provider;
import com.uade.tpo.marketplace.entity.dto.Provider.CreateProviderRequest;
import com.uade.tpo.marketplace.entity.dto.Provider.UpdateProviderRequest;
import com.uade.tpo.marketplace.service.ProviderService;
 
@RestController
@RequestMapping("/api/providers")
public class ProviderController {
 
    @Autowired
    private ProviderService providerService;
 
    // GET /api/providers
    @GetMapping
    public ResponseEntity<List<Provider>> getAll() {
        return ResponseEntity.ok(providerService.getAll());
    }
 
    // GET /api/providers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Provider> getById(@PathVariable Long id) {
        Optional<Provider> result = providerService.getById(id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 
    // GET /api/providers/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<Provider> getByUserId(@PathVariable Long userId) {
        Optional<Provider> result = providerService.getByUserId(userId);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 
    // POST /api/providers
    @PostMapping
    public ResponseEntity<Provider> create(@RequestBody CreateProviderRequest request) {
        Optional<Provider> result = providerService.create(request);
        return result.map(p -> ResponseEntity.status(HttpStatus.CREATED).body(p))
                .orElse(ResponseEntity.badRequest().build());
    }
 
    // PUT /api/providers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Provider> update(
            @PathVariable Long id,
            @RequestBody UpdateProviderRequest request) {
        Optional<Provider> result = providerService.update(request, id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 
    // DELETE /api/providers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = providerService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}