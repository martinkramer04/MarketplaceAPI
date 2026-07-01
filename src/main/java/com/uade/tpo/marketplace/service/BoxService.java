package com.uade.tpo.marketplace.service;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.marketplace.entity.Box;
import com.uade.tpo.marketplace.entity.Category;
import com.uade.tpo.marketplace.entity.Image;
import com.uade.tpo.marketplace.entity.Product;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.dto.Box.CartItemRequest;
import com.uade.tpo.marketplace.entity.dto.Box.CartItemValidationResult;
import com.uade.tpo.marketplace.entity.dto.Box.CartValidationResponse;
import com.uade.tpo.marketplace.entity.dto.Box.CreateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Box.UpdateBoxRequest;
import com.uade.tpo.marketplace.entity.dto.Box.ValidateCartRequest;
import com.uade.tpo.marketplace.entity.enums.BoxStatusEnum;
import com.uade.tpo.marketplace.repository.BoxRepository;
import com.uade.tpo.marketplace.repository.CategoryRepository;

@Service
public class BoxService implements IBaseService<Box, CreateBoxRequest, UpdateBoxRequest> {

    @Autowired
    private BoxRepository boxRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageService imageService;

    @Override
    public List<Box> getAll() {
        return boxRepository.findAll();
    }

    @Override
    public Optional<Box> getById(Long id) {
        return boxRepository.findById(id);
    }

    // Método extra: cajas por categoría
    public List<Box> getByCategory(Long categoryId) {
        return boxRepository.findByCategoryId(categoryId);
    }

    public List<Box> getByUserId(Long userId) {
        return boxRepository.findByUserId(userId);
    }

    // Método extra: cajas con stock disponible
    public List<Box> getAvailable() {
        return boxRepository.findByIsDeletedFalseAndStockGreaterThan(0);
    }

    @Override
    public Optional<Box> create(CreateBoxRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }

        if (entity.getName() == null || entity.getPrice() == null
                || entity.getStock() == null || entity.getCategoryId() == null) {
            return Optional.empty();
        }

        Optional<Category> category = categoryRepository.findById(entity.getCategoryId());
        if (category.isEmpty()) {
            return Optional.empty();
        }

        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Box box = new Box();
        box.setCategory(category.get());
        box.setName(entity.getName());
        box.setDescription(entity.getDescription());
        box.setPrice(entity.getPrice());
        box.setStock(entity.getStock());
        box.setUser(currentUser);
        box.setStatus(BoxStatusEnum.PENDING);

        box.setProducts(entity.getProductIds() != null
                ? Arrays.stream(entity.getProductIds())
                        .map(productId -> {
                            Product product = new Product();
                            product.setId(productId);
                            return product;
                        })
                        .toList()
                : List.of());

        try {
            boxRepository.save(box);
        } catch (Exception e) {
            throw new RuntimeException("Error creating box: " + e.getMessage());
        }

        return Optional.of(box);
    }

    public Optional<Box> addStock(Long id, Integer amount) {
        return boxRepository.findById(id)
                .map(box -> {
                    box.setStock(box.getStock() + amount);
                    return boxRepository.save(box);
                });
    }
    public Optional<Box> ReduceStock(Long id, Integer amount) {
    return boxRepository.findById(id)
            .map(box -> {
                if (box.getStock() <= 0) {
                    throw new IllegalStateException("No hay stock disponible.");
                }

                if (box.getStock() < amount) {
                    throw new IllegalStateException("Stock insuficiente.");
                }

                box.setStock(box.getStock() - amount);
                return boxRepository.save(box);
            });
}

    @Override
    public Optional<Box> update(UpdateBoxRequest entity, Long id) {
        Box box = boxRepository.findById(id)
                .orElse(null);

        if (box == null) {
            return Optional.empty();
        }

        if (entity.getCategoryId() != null) {
            Optional<Category> category = categoryRepository.findById(entity.getCategoryId());
            if (category.isEmpty()) {
                return Optional.empty();
            }
            box.setCategory(category.get());
        }
        if (entity.getName() != null) {
            box.setName(entity.getName());
        }
        if (entity.getDescription() != null) {
            box.setDescription(entity.getDescription());
        }
        if (entity.getPrice() != null) {
            box.setPrice(entity.getPrice());
        }
        if (entity.getStock() != null) {
            box.setStock(entity.getStock());
        }
        if (entity.getStatus() != null) {
            box.setStatus(entity.getStatus());
        }
        box.setUpdatedAt(LocalDateTime.now());

        try {
            boxRepository.save(box);
        } catch (Exception e) {
            throw new RuntimeException("Error updating box: " + e.getMessage());
        }

        if (entity.getImages() != null) {
            for (MultipartFile file : entity.getImages()) {
                if (file == null || file.isEmpty()) {
                    continue;
                }
                try {
                    Blob blob = new SerialBlob(file.getBytes());
                    imageService.create(Image.builder()
                            .image(blob)
                            .name(file.getOriginalFilename())
                            .build(), box.getId());
                } catch (IOException | SQLException e) {
                    throw new RuntimeException("Error saving box image: " + e.getMessage());
                }
            }
        }

        return Optional.of(box);
    }

    @Override
    public boolean delete(Long id) {
        Box box = boxRepository.findById(id)
                .orElse(null);

        if (box == null) {
            return false;
        }

        try {
            boxRepository.delete(box);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting box: " + e.getMessage());
        }

        return true;
    }
    public List<Box> getByStatus(BoxStatusEnum status) {
        return boxRepository.findByStatus(status);
    }

    public CartValidationResponse validateCart(ValidateCartRequest request) {
        List<CartItemValidationResult> results = request.getItems().stream()
                .map(item -> {
                    Optional<Box> boxOpt = boxRepository.findById(item.getBoxId());

                    if (boxOpt.isEmpty() || Boolean.TRUE.equals(boxOpt.get().isDeleted())) {
                        return CartItemValidationResult.builder()
                                .boxId(item.getBoxId())
                                .valid(false)
                                .requestedQuantity(item.getQuantity())
                                .availableStock(null)
                                .action("REMOVE")
                                .reason("NOT_FOUND")
                                .build();
                    }

                    Box box = boxOpt.get();

                    if (box.getStock() == 0) {
                        return CartItemValidationResult.builder()
                                .boxId(item.getBoxId())
                                .valid(false)
                                .requestedQuantity(item.getQuantity())
                                .availableStock(0)
                                .action("REMOVE")
                                .reason("OUT_OF_STOCK")
                                .build();
                    }

                    if (box.getStock() < item.getQuantity()) {
                        return CartItemValidationResult.builder()
                                .boxId(item.getBoxId())
                                .valid(false)
                                .requestedQuantity(item.getQuantity())
                                .availableStock(box.getStock())
                                .action("UPDATE_QUANTITY")
                                .reason("INSUFFICIENT_STOCK")
                                .build();
                    }

                    return CartItemValidationResult.builder()
                            .boxId(item.getBoxId())
                            .valid(true)
                            .requestedQuantity(item.getQuantity())
                            .availableStock(box.getStock())
                            .action(null)
                            .reason(null)
                            .build();
                })
                .toList();

        return CartValidationResponse.builder().results(results).build();
    }
}
