package com.uade.tpo.marketplace.service;

import java.io.IOException;
import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.BoxSolicitation;
import com.uade.tpo.marketplace.entity.BoxSolicitationImage;
import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.BoxSolicitation.CreateBoxSolicitationRequest;
import com.uade.tpo.marketplace.entity.dto.BoxSolicitation.UpdateBoxSolicitationRequest;
import com.uade.tpo.marketplace.entity.enums.BoxSolicitationStatusEnum;
import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.BoxSolicitationImageRepository;
import com.uade.tpo.marketplace.repository.BoxSolicitationRepository;
import com.uade.tpo.marketplace.repository.CategoryRepository;
import com.uade.tpo.marketplace.repository.ImageRepository;
import com.uade.tpo.marketplace.repository.UserRepository;

@Service
public class BoxSolicitationService {

    @Autowired
    private BoxSolicitationRepository solicitationRepository;

    @Autowired
    private BoxSolicitationImageRepository imageRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BoxRepository boxRepository;

    @Autowired
    private ImageRepository boxImageRepository;

    public List<BoxSolicitation> getAll() {
        return solicitationRepository.findAll();
    }

    public Optional<BoxSolicitation> getById(Long id) {
        return solicitationRepository.findById(id);
    }

    public List<BoxSolicitation> getByUser(Long userId) {
        return solicitationRepository.findByUser_Id(userId);
    }

    public List<BoxSolicitation> getByStatus(BoxSolicitationStatusEnum status) {
        return solicitationRepository.findByStatus(status);
    }

    public Optional<BoxSolicitation> create(CreateBoxSolicitationRequest request, List<MultipartFile> imageFiles) {
        if (request == null) {
            return Optional.empty();
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + request.getCategoryId()));

        BoxSolicitation solicitation = new BoxSolicitation();
        solicitation.setUser(user);
        solicitation.setCategory(category);
        solicitation.setTitle(request.getTitle());
        solicitation.setShortDescription(request.getShortDescription());
        solicitation.setDetailedDescription(request.getDetailedDescription());
        solicitation.setPrice(request.getPrice());
        solicitation.setCancellationPolicy(request.getCancellationPolicy());
        solicitation.setSubProviders(request.getSubProviders());
        solicitation.setStatus(BoxSolicitationStatusEnum.PENDING);
        solicitation.setCreatedAt(LocalDateTime.now());

        BoxSolicitation saved = solicitationRepository.save(solicitation);

        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                if (file != null && !file.isEmpty()) {
                    try {
                        byte[] bytes = file.getBytes();
                        Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);
                        BoxSolicitationImage img = new BoxSolicitationImage();
                        img.setName(file.getOriginalFilename());
                        img.setImage(blob);
                        img.setSolicitation(saved);
                        img.setCreatedAt(LocalDateTime.now());
                        imageRepository.save(img);
                        saved.getImages().add(img);
                    } catch (IOException | java.sql.SQLException e) {
                        throw new RuntimeException("Error al procesar imagen: " + e.getMessage());
                    }
                }
            }
        }

        return Optional.of(saved);
    }

    public Optional<BoxSolicitation> update(UpdateBoxSolicitationRequest request, Long id) {
        if (id == null || request == null) {
            return Optional.empty();
        }

        BoxSolicitation solicitation = solicitationRepository.findById(id).orElse(null);
        if (solicitation == null) {
            return Optional.empty();
        }

        solicitation.setStatus(request.getStatus());
        solicitation.setUpdatedAt(LocalDateTime.now());

        if (request.getStatus() == BoxSolicitationStatusEnum.APPROVED) {
            createBoxFromSolicitation(solicitation);
        }

        return Optional.of(solicitationRepository.save(solicitation));
    }

    public boolean delete(Long id) {
        BoxSolicitation solicitation = solicitationRepository.findById(id).orElse(null);
        if (solicitation == null) {
            return false;
        }
        solicitationRepository.delete(solicitation);
        return true;
    }

    private void createBoxFromSolicitation(BoxSolicitation solicitation) {
        Box box = new Box();
        box.setName(solicitation.getTitle());
        box.setDescription(solicitation.getShortDescription() + "\n\n" + solicitation.getDetailedDescription());
        box.setPrice(solicitation.getPrice());
        box.setCategory(solicitation.getCategory());
        box.setUser(solicitation.getUser());
        box.setStatus(BoxStatusEnum.APPROVED);
        box.setStock(0);
        box.setCreatedAt(LocalDateTime.now());
        Box savedBox = boxRepository.save(box);

        for (BoxSolicitationImage solImg : solicitation.getImages()) {
            try {
                Image img = Image.builder()
                        .name(solImg.getName())
                        .image(solImg.getImage())
                        .box(savedBox)
                        .build();
                boxImageRepository.save(img);
            } catch (Exception e) {
                // Non-fatal: box is created even if an image copy fails
                System.out.println("⚠️ No se pudo copiar imagen al box: " + e.getMessage());
            }
        }
    }
}
