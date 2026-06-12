package com.uade.tpo.marketplace.controller;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;
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

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.entity.dto.Box.BoxDto;
import com.uade.tpo.marketplace.entity.dto.Box.CreateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Box.UpdateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Image.AddImageBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Image.ImageResponse;
import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;
import com.uade.tpo.marketplace.repository.UserRepository;
import com.uade.tpo.marketplace.service.BoxService;
import com.uade.tpo.marketplace.service.ImageService;
import org.springframework.web.bind.annotation.CrossOrigin;
import io.jsonwebtoken.io.SerialException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/boxes")
public class BoxController {

    @Autowired
    private BoxService boxService;

    @Autowired
    private ImageService imageService;

    // GET
    @GetMapping
    public ResponseEntity<List<BoxDto>> getAll() {
        return ResponseEntity.ok(boxService.getAll().stream().map(BoxDto::convertToDto).toList());
    }

    // GET
    @GetMapping("/available")
    public ResponseEntity<List<BoxDto>> getAvailable() {
        return ResponseEntity.ok(boxService.getAvailable().stream().map(BoxDto::convertToDto).toList());
    }

    // GET
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BoxDto>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(boxService.getByCategory(categoryId).stream().map(BoxDto::convertToDto).toList());
    }

    // GET
    @GetMapping("/{id}")
    public ResponseEntity<BoxDto> getById(@PathVariable Long id) {
        Optional<Box> result = boxService.getById(id);
        return result.map(BoxDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST
    @PostMapping
    public ResponseEntity<BoxDto> create(@RequestBody CreateBoxRequest request) {
        Optional<Box> result = boxService.create(request);
        return result.map(BoxDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<BoxDto> update(
            @PathVariable Long id,
            @RequestBody UpdateBoxRequest request) {
        Optional<Box> result = boxService.update(request, id);
        return result.map(BoxDto::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = boxService.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/add-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addImageBox(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("boxId") Long boxId)
            throws IOException, SQLException {
        byte[] bytes = file.getBytes();
        Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);

        imageService.create(Image.builder()
                .image(blob)
                .name(name)
                .build(), boxId);
        return ResponseEntity.ok("created");
    }

    @CrossOrigin
    @GetMapping("/display-image")
    public ResponseEntity<ImageResponse> displayImage(@RequestParam("id") long id) throws IOException, SQLException {
        Image image = imageService.viewById(id);
        String encodedString = Base64.getEncoder()
                .encodeToString(image.getImage().getBytes(1, (int) image.getImage().length()));
        return ResponseEntity.ok().body(ImageResponse.builder().file(encodedString).id(id).build());
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<BoxDto>> getByStatus(@PathVariable BoxStatusEnum status) {
        return ResponseEntity.ok(boxService.getByStatus(status).stream()
            .map(BoxDto::convertToDto)
            .toList());
}
}