package com.uade.tpo.marketplace.service;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.uade.tpo.marketplace.entity.PaymentMethods;
import com.uade.tpo.marketplace.entity.dto.PaymentMethods.CreatePaymentMethodsRequest;
import com.uade.tpo.marketplace.entity.dto.PaymentMethods.UpdatePaymentMethodsRequest;
import com.uade.tpo.marketplace.repository.PaymentMethodsRepository;
 
@Service
public class PaymentMethodsService implements IBaseService<
        PaymentMethods,
        CreatePaymentMethodsRequest,
        UpdatePaymentMethodsRequest> {
 
    @Autowired
    private PaymentMethodsRepository paymentMethodsRepository;
 
    @Override
    public List<PaymentMethods> getAll() {
        return paymentMethodsRepository.findAll();
    }
 
    @Override
    public Optional<PaymentMethods> getById(Long id) {
        return paymentMethodsRepository.findById(id);
    }
    public List<PaymentMethods> getByUserId(Long userId) {
        return paymentMethodsRepository.findByUserId(userId);
    }
 
    @Override
    public Optional<PaymentMethods> create(CreatePaymentMethodsRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }
 
        if (entity.getName() == null) {
            return Optional.empty();
        }
 
        PaymentMethods paymentMethod = new PaymentMethods();
        paymentMethod.setName(entity.getName());
        paymentMethod.setDescription(entity.getDescription());
        paymentMethod.setUserId(entity.getUserId());

        try {
            paymentMethodsRepository.save(paymentMethod);
        } catch (Exception e) {
            throw new RuntimeException("Error creating payment method: " + e.getMessage());
        }
 
        return Optional.of(paymentMethod);
    }
 
    @Override
    public Optional<PaymentMethods> update(UpdatePaymentMethodsRequest entity, Long id) {
        PaymentMethods paymentMethod = paymentMethodsRepository.findById(id)
                .orElse(null);
 
        if (paymentMethod == null) {
            return Optional.empty();
        }
 
        paymentMethod.setName(entity.getName());
        paymentMethod.setDescription(entity.getDescription());
        paymentMethod.setUpdatedAt(LocalDateTime.now());
 
        try {
            paymentMethodsRepository.save(paymentMethod);
        } catch (Exception e) {
            throw new RuntimeException("Error updating payment method: " + e.getMessage());
        }
 
        return Optional.of(paymentMethod);
    }
 
    @Override
    public boolean delete(Long id) {
        PaymentMethods paymentMethod = paymentMethodsRepository.findById(id)
                .orElse(null);
 
        if (paymentMethod == null) {
            return false;
        }
 
        try {
            paymentMethodsRepository.delete(paymentMethod);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting payment method: " + e.getMessage());
        }
        return true;
    }
}
