package com.uade.tpo.marketplace.service;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.uade.tpo.marketplace.entity.Provider;
import com.uade.tpo.marketplace.entity.dto.Provider.CreateProviderRequest;
import com.uade.tpo.marketplace.entity.dto.Provider.UpdateProviderRequest;
import com.uade.tpo.marketplace.repository.ProviderRepository;
 
@Service
public class ProviderService implements IBaseService<
        Provider,
        CreateProviderRequest,
        UpdateProviderRequest> {
 
    @Autowired
    private ProviderRepository providerRepository;
 
    @Override
    public List<Provider> getAll() {
        return providerRepository.findAll();
    }
 
    @Override
    public Optional<Provider> getById(Long id) {
        return providerRepository.findById(id);
    }
 
    // Método extra: buscar provider por usuario
    public Optional<Provider> getByUserId(Long userId) {
        return providerRepository.findByUserId(userId);
    }
 
    @Override
    public Optional<Provider> create(CreateProviderRequest entity) {
        if (entity == null) {
            return Optional.empty();
        }
 
        if (entity.getUserId() == null || entity.getCompanyName() == null
                || entity.getEmail() == null) {
            return Optional.empty();
        }
 
        Provider provider = new Provider();
        provider.setUserId(entity.getUserId());
        provider.setCompanyName(entity.getCompanyName());
        provider.setEmail(entity.getEmail());
        provider.setPhone(entity.getPhone());
 
        try {
            providerRepository.save(provider);
        } catch (Exception e) {
            throw new RuntimeException("Error creating provider: " + e.getMessage());
        }
 
        return Optional.of(provider);
    }
 
    @Override
    public Optional<Provider> update(UpdateProviderRequest entity, Long id) {
        Provider provider = providerRepository.findById(id).orElse(null);
 
        if (provider == null) {
            return Optional.empty();
        }
 
        provider.setCompanyName(entity.getCompanyName());
        provider.setEmail(entity.getEmail());
        provider.setPhone(entity.getPhone());
        provider.setUpdatedAt(LocalDateTime.now());
 
        try {
            providerRepository.save(provider);
        } catch (Exception e) {
            throw new RuntimeException("Error updating provider: " + e.getMessage());
        }
 
        return Optional.of(provider);
    }
 
    @Override
    public boolean delete(Long id) {
        Provider provider = providerRepository.findById(id).orElse(null);
 
        if (provider == null) {
            return false;
        }
 
        try {
            providerRepository.delete(provider);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting provider: " + e.getMessage());
        }
 
        return true;
    }
}