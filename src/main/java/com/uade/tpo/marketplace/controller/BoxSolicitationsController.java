package com.uade.tpo.marketplace.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.marketplace.entity.BoxSolicitation;
import com.uade.tpo.marketplace.entity.dto.BoxSolicitation.BoxSolicitationDto;
import com.uade.tpo.marketplace.entity.dto.BoxSolicitation.CreateBoxSolicitationRequest;
import com.uade.tpo.marketplace.entity.dto.BoxSolicitation.UpdateBoxSolicitationRequest;
import com.uade.tpo.marketplace.entity.enums.BoxSolicitationStatusEnum;
import com.uade.tpo.marketplace.service.BoxSolicitationService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/box-solicitations")
public class BoxSolicitationsController {

    @Autowired
    private BoxSolicitationService solicitationService;

    // GET /api/box-solicitations
    @GetMapping
    public ResponseEntity<List<BoxSolicitationDto>> getAll() {
        return ResponseEntity.ok(
                solicitationService.getAll().stream().map(BoxSolicitationDto::convertToDto).toList());
    }

    // GET /api/box-solicitations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BoxSolicitationDto> getById(@PathVariable Long id) {
        Optional<BoxSolicitation> result = solicitationService.getById(id);
        return result.map(BoxSolicitationDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/box-solicitations/provider/{userId}
    @GetMapping("/provider/{userId}")
    public ResponseEntity<List<BoxSolicitationDto>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                solicitationService.getByUser(userId).stream().map(BoxSolicitationDto::convertToDto).toList());
    }

    // GET /api/box-solicitations/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BoxSolicitationDto>> getByStatus(@PathVariable BoxSolicitationStatusEnum status) {
        return ResponseEntity.ok(
                solicitationService.getByStatus(status).stream().map(BoxSolicitationDto::convertToDto).toList());
    }

    // POST /api/box-solicitations  (multipart/form-data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BoxSolicitationDto> create(
            @RequestParam("title") String title,
            @RequestParam("shortDescription") String shortDescription,
            @RequestParam("detailedDescription") String detailedDescription,
            @RequestParam("price") BigDecimal price,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("cancellationPolicy") String cancellationPolicy,
            @RequestParam(value = "subProviders", required = false) String subProviders,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        CreateBoxSolicitationRequest request = new CreateBoxSolicitationRequest();
        request.setTitle(title);
        request.setShortDescription(shortDescription);
        request.setDetailedDescription(detailedDescription);
        request.setPrice(price);
        request.setCategoryId(categoryId);
        request.setCancellationPolicy(cancellationPolicy);
        request.setSubProviders(subProviders);

        Optional<BoxSolicitation> result = solicitationService.create(request, images);
        return result.map(BoxSolicitationDto::convertToDto)
                .map(dto -> ResponseEntity.status(HttpStatus.CREATED).body(dto))
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT /api/box-solicitations/{id}  → admin approves / rejects
    @PutMapping("/{id}")
    public ResponseEntity<BoxSolicitationDto> update(
            @PathVariable Long id,
            @RequestBody UpdateBoxSolicitationRequest request) {
        Optional<BoxSolicitation> result = solicitationService.update(request, id);
        return result.map(BoxSolicitationDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/box-solicitations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = solicitationService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
