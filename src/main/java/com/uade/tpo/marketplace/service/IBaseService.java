package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


public interface IBaseService<T, C , U> {
    
    public List<T> getAll();
    public Optional<T> getById(Long id);
    public Optional<T> create(C entity);
    public Optional<T> update(U entity, Long id);
    public boolean delete(Long id);
}
