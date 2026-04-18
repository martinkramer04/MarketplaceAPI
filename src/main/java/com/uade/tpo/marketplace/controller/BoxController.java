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
 
import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.dto.Box.CreateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Box.UpdateBoxRequest;
import com.uade.tpo.marketplace.service.BoxService;
 
@RestController
@RequestMapping("/api/boxes")
public class BoxController {
 
    @Autowired
    private BoxService boxService;
 
    //GET
    @GetMapping
    public ResponseEntity<List<Box>> getAll() {
        return ResponseEntity.ok(boxService.getAll());
    }
 
    //GET 
    @GetMapping("/available")
    public ResponseEntity<List<Box>> getAvailable() {
        return ResponseEntity.ok(boxService.getAvailable());
    }
 
    //GET
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Box>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(boxService.getByCategory(categoryId));
    }
 
    //GET
    @GetMapping("/{id}")
    public ResponseEntity<Box> getById(@PathVariable Long id) {
        Optional<Box> result = boxService.getById(id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    //POST
    @PostMapping
    public ResponseEntity<Box> create(@RequestBody CreateBoxRequest request) {
        request.setUserId(1L); //MODIFICAR LUEGO DE IMPLEMENTAR JWT
        Optional<Box> result = boxService.create(request);
        return result.map(b -> ResponseEntity.status(HttpStatus.CREATED).body(b))
            .orElse(ResponseEntity.badRequest().build());
}
 
    //PUT
    @PutMapping("/{id}")
    public ResponseEntity<Box> update(
            @PathVariable Long id,
            @RequestBody UpdateBoxRequest request) {
        Optional<Box> result = boxService.update(request, id);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 
    //DELETE 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = boxService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}