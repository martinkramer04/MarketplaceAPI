package com.uade.tpo.marketplace.repository;
 
import java.util.List;
import java.util.Optional;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import com.uade.tpo.marketplace.entity.Discount;
 
@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
 
    // Buscar cupón por código (útil al aplicar descuento en una orden)
    Optional<Discount> findByCode(String code);
 
    // Listar descuentos activos
    List<Discount> findByIsActiveTrue();
}
