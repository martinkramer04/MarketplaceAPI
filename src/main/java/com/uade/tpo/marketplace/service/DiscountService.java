package com.uade.tpo.marketplace.service;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.uade.tpo.marketplace.entity.Discount;
import com.uade.tpo.marketplace.entity.enums.DiscountTypeEnum;
import com.uade.tpo.marketplace.entity.dto.Discount.CreateDiscountRequest;
import com.uade.tpo.marketplace.entity.dto.Discount.UpdateDiscountRequest;
import com.uade.tpo.marketplace.repository.DiscountRepository;
 
@Service
public class DiscountService implements IBaseService<
        Discount,
        CreateDiscountRequest,
        UpdateDiscountRequest> {
 
    @Autowired
    private DiscountRepository discountRepository;
 
    @Override
    public List<Discount> getAll() {
        return discountRepository.findAll();
    }
 
    @Override
    public Optional<Discount> getById(Long id) {
        return discountRepository.findById(id);
    }
 
    // Método extra: obtener solo los descuentos activos
    public List<Discount> getActive() {
        return discountRepository.findByIsActiveTrue();
    }
 
    // Método extra: validar y obtener un cupón por código (usado al crear una orden)
    public Optional<Discount> getByCode(String code) {
        Optional<Discount> discount = discountRepository.findByCode(code);
        if (discount.isPresent() && !discount.get().getIsActive()) {
            return Optional.empty();
        }
        return discount;
    }
 
    @Override
    public Optional<Discount> create(CreateDiscountRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }
 
        if (entity.getName() == null || entity.getPercentage() == null
                || entity.getIsActive() == null || entity.getDiscountType() == null
                || entity.getStartDate() == null || entity.getEndDate() == null) {
            return Optional.empty();
        }
 
        // Los cupones requieren un código
        if (DiscountTypeEnum.CUPON.equals(entity.getDiscountType())
                && (entity.getCode() == null || entity.getCode().isBlank())) {
            return Optional.empty();
        }
 
        Discount discount = new Discount();
        discount.setName(entity.getName());
        discount.setPercentage(entity.getPercentage());
        discount.setIsActive(entity.getIsActive());
        discount.setStartDate(entity.getStartDate());
        discount.setEndDate(entity.getEndDate());
        discount.setCode(entity.getCode());
        discount.setDiscountType(entity.getDiscountType());
 
        try {
            discountRepository.save(discount);
        } catch (Exception e) {
            throw new RuntimeException("Error creating discount: " + e.getMessage());
        }
 
        return Optional.of(discount);
    }
 
    @Override
    public Optional<Discount> update(UpdateDiscountRequest entity, Long id) {
        Discount discount = discountRepository.findById(id)
                .orElse(null);
 
        if (discount == null) {
            return Optional.empty();
        }
 
        discount.setName(entity.getName());
        discount.setPercentage(entity.getPercentage());
        discount.setIsActive(entity.getIsActive());
        discount.setStartDate(entity.getStartDate());
        discount.setEndDate(entity.getEndDate());
        discount.setCode(entity.getCode());
        discount.setDiscountType(entity.getDiscountType());
        discount.setUpdatedAt(LocalDateTime.now());
 
        try {
            discountRepository.save(discount);
        } catch (Exception e) {
            throw new RuntimeException("Error updating discount: " + e.getMessage());
        }
 
        return Optional.of(discount);
    }
 
    @Override
    public boolean delete(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElse(null);
 
        if (discount == null) {
            return false;
        }
 
        try {
            discountRepository.delete(discount);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting discount: " + e.getMessage());
        }
 
        return true;
    }
}
