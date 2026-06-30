USE marketplace;

SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- LIMPIEZA TOTAL
-- =====================================================================
TRUNCATE TABLE marketplace.order_details;
TRUNCATE TABLE marketplace.reviews;
TRUNCATE TABLE marketplace.orders;
TRUNCATE TABLE marketplace.box_products;
TRUNCATE TABLE marketplace.image_table;
TRUNCATE TABLE marketplace.boxes;
TRUNCATE TABLE marketplace.provider_solicitations;
TRUNCATE TABLE marketplace.payment_methods;
TRUNCATE TABLE marketplace.discounts;
TRUNCATE TABLE marketplace.products;
TRUNCATE TABLE marketplace.categories;
TRUNCATE TABLE marketplace.user;

-- =====================================================================
-- USUARIOS
-- Contraseña de todos: password (hasheada con BCrypt rounds=10)
-- =====================================================================
INSERT INTO marketplace.user (firstname, lastname, email, username, password, role) VALUES
('Admin', 'BigBox', 'admin@bigbox.com', 'admin', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'ADMIN'),
('Carlos', 'Mendoza', 'carlos@bigbox.com', 'carlos', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Ana', 'Beltrán', 'ana@bigbox.com', 'ana', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Lucas', 'Torres', 'lucas@bigbox.com', 'lucas', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'USER'),
('Sofía', 'Ramírez', 'sofia@bigbox.com', 'sofia', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'USER');
-- =====================================================================
-- CATEGORÍAS
-- =====================================================================
INSERT INTO marketplace.categories (name, description, user_id) VALUES
('Gastronomía', 'Cenas, maridajes y experiencias culinarias', 1),
('Aventura', 'Paracaidismo, trekking y adrenalina pura', 1),
('Bienestar', 'Tratamientos de spa, masajes y relax holístico', 1),
('Entretenimiento', 'Shows, eventos y actividades culturales', 1),
('Estadías', 'Hoteles y escapadas de fin de semana', 1),
('Cursos y Talleres', 'Aprendé algo nuevo con expertos', 1),
('Delivery y Take Away', 'Experiencias para disfrutar en casa', 1),
('Ocasiones especiales', 'Regalos pensados para momentos únicos', 1);

-- =====================================================================
-- DESCUENTOS
-- =====================================================================
INSERT INTO marketplace.discounts (name, percentage, is_active, code, discount_type) VALUES
('Descuento de Bienvenida', 10, 1, 'BIENVENIDA10', 'CUPON'),
('Especial Gastro', 15, 1, 'GASTRO15', 'GENERAL'),
('Promo Aventura', 20, 1, 'AVENTURA20', 'CUPON');

-- =====================================================================
-- PRODUCTOS
-- =====================================================================
INSERT INTO marketplace.products (name, description, price, stock, category_id, user_id) VALUES
('Cena de Pasos Premium', 'Menú degustación de 7 pasos con maridaje de vinos seleccionados.', 89.00, 50, 1, 2),
('Masaje Descontracturante', 'Sesión de 60 minutos con aceites esenciales importados.', 65.00, 30, 3, 3),
('Salto en Paracaídas', 'Salto biplaza a 3500 metros de altura con instructor certificado.', 180.00, 20, 2, 2),
('Clase de Cocina Italiana', 'Aprendé a preparar pasta fresca y tiramisú con chef profesional.', 55.00, 15, 6, 3),
('Noche en Hotel Boutique', 'Una noche para dos con desayuno incluido en hotel 5 estrellas.', 220.00, 10, 5, 2),
('Caja Gourmet Delivery', 'Selección de quesos, fiambres y vinos premium a domicilio.', 75.00, 40, 7, 3);

-- =====================================================================
-- CAJAS (BOXES)
-- PROVIDER 1 = Carlos (id=2) → Gastronomía y Aventura
-- PROVIDER 2 = Ana (id=3) → Bienestar y Talleres
-- =====================================================================
INSERT INTO marketplace.boxes (name, description, price, stock, category_id, user_id, status) VALUES

-- Carlos - APPROVED (aparecen en Explore)
('Escapada Gourmet', 'Una noche mágica para los amantes de la gastronomía. Incluye cena de 7 pasos con maridaje de vinos en restaurante top, traslado en vehículo premium y recuerdo de la velada. Ideal para celebrar momentos especiales en pareja.', 149.00, 20, 1, 2, 'APPROVED'),
('Adrenalina Total', 'Para los que buscan el límite. Esta caja incluye un salto en paracaídas biplaza con instructor certificado, almuerzo post-aventura y foto profesional del salto. Una experiencia que no vas a olvidar nunca.', 249.00, 10, 2, 2, 'APPROVED'),
('Noche de Lujo', 'Regalate una noche en el mejor hotel boutique de la ciudad. Incluye habitación superior para dos personas, desayuno gourmet, una copa de bienvenida y late checkout. El descanso que merecés.', 320.00, 8, 5, 2, 'APPROVED'),

-- Carlos - PENDING
('Picnic al Atardecer', 'Una experiencia romántica al aire libre con canasta gourmet, manta, decoración floral y bebidas premium. Para disfrutar del atardecer en los mejores parques de la ciudad.', 95.00, 15, 8, 2, 'PENDING'),

-- Carlos - REJECTED
('Tour de Bares Secretos', 'Recorrido nocturno por los bares más exclusivos y escondidos de la ciudad con guía especializado y primera consumición incluida en cada parada.', 80.00, 25, 4, 2, 'REJECTED'),

-- Ana - APPROVED (aparecen en Explore)
('Spa Day Completo', 'Un día entero dedicado a tu bienestar. Incluye masaje descontracturante de 60 minutos, acceso al circuito de hidroterapia, facial express y merienda saludable. Salís renovada por completo.', 199.00, 15, 3, 3, 'APPROVED'),
('Taller de Pasta Fresca', 'Aprendé los secretos de la cocina italiana con un chef profesional. En 3 horas vas a dominar la pasta fresca, la salsa clásica y el tiramisú. Todo el material incluido, te llevás lo que cocinás.', 89.00, 12, 6, 3, 'APPROVED'),
('Caja Gourmet en Casa', 'Sin salir de tu hogar podés vivir una experiencia gastronómica de primer nivel. Recibís una selección curada de quesos artesanales, fiambres premium, conservas gourmet y una botella de vino de autor.', 110.00, 30, 7, 3, 'APPROVED'),

-- Ana - PENDING
('Retiro de Meditación', 'Una jornada completa de desconexión total. Incluye sesión de meditación guiada, yoga al amanecer, almuerzo vegetariano y taller de respiración consciente en entorno natural.', 145.00, 10, 3, 3, 'PENDING'),

-- Ana - REJECTED  
('Clase de Cerámica', 'Descubrí el arte de la cerámica con un taller de 4 horas con alfarero profesional. Todos los materiales incluidos y te llevás tu pieza terminada.', 70.00, 20, 6, 3, 'REJECTED');

-- =====================================================================
-- IMÁGENES (URLs de Unsplash que cargan correctamente)
-- =====================================================================
INSERT INTO marketplace.image_table (created_at, is_deleted, updated_at, image, name, box_id) VALUES
-- Escapada Gourmet
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', 'Portada Gourmet', 1),
-- Adrenalina Total
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=800&q=80', 'Portada Adrenalina', 2),
-- Noche de Lujo
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', 'Portada Hotel', 3),
-- Picnic al Atardecer
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800&q=80', 'Portada Picnic', 4),
-- Tour de Bares
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80', 'Portada Bares', 5),
-- Spa Day
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', 'Portada Spa', 6),
-- Taller de Pasta
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80', 'Portada Pasta', 7),
-- Caja Gourmet en Casa
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=80', 'Portada Delivery', 8),
-- Retiro de Meditación
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', 'Portada Meditacion', 9),
-- Clase de Cerámica
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', 'Portada Ceramica', 10);

-- =====================================================================
-- RELACIÓN BOX - PRODUCTOS
-- =====================================================================
INSERT INTO marketplace.box_products (box_id, product_id) VALUES
(1, 1), -- Escapada Gourmet → Cena de Pasos
(2, 3), -- Adrenalina Total → Salto en Paracaídas
(3, 5), -- Noche de Lujo → Noche en Hotel
(6, 2), -- Spa Day → Masaje
(7, 4), -- Taller de Pasta → Clase de Cocina
(8, 6); -- Caja Gourmet en Casa → Delivery

-- =====================================================================
-- MÉTODOS DE PAGO
-- =====================================================================
INSERT INTO marketplace.payment_methods (name, description, user_id) VALUES
('Tarjeta de Crédito', 'Visa, Mastercard y American Express', 1),
('Tarjeta de Débito', 'Todas las tarjetas de débito', 1),
('Transferencia Bancaria', 'CBU o CVU', 1);

-- =====================================================================
-- RESEÑAS
-- =====================================================================
INSERT INTO marketplace.reviews (rating, status, comment, user_id, box_id) VALUES
(5, 'REVIEWED', 'La cena fue absolutamente increíble, el servicio impecable y los vinos seleccionados perfectamente. ¡Lo recomiendo a todos!', 4, 1),
(4, 'REVIEWED', 'El spa estuvo muy bien, el masaje fue relajante y el circuito de agua una maravilla. Le faltó un poco más de tiempo libre.', 5, 6),
(5, 'REVIEWED', 'El salto fue una experiencia única. El instructor muy profesional y la foto quedó espectacular. ¡Volvería a hacerlo!', 4, 2),
(4, 'REVIEWED', 'El taller de pasta estuvo buenísimo, aprendí muchísimo y el chef fue muy paciente. Me llevé todo lo que cociné.', 5, 7);

-- =====================================================================
-- SOLICITUDES DE PROVEEDOR (para demo del flujo become-provider)
-- Lucas quiere convertirse en proveedor - GENERADA (pendiente)
-- Sofía intentó pero fue rechazada
-- =====================================================================
INSERT INTO marketplace.provider_solicitations (solicitation_status, description, user_id) VALUES
('GENERADA', 'Soy instructor de deportes extremos con 10 años de experiencia. Me gustaría ofrecer experiencias de kayak, escalada y rappel en la zona de Mendoza. Cuento con todos los permisos y certificaciones necesarias.', 4),
('RECHAZADA', 'Quisiera ofrecer clases de pintura y arte abstracto para adultos y niños en mi taller del centro.', 5);

-- =====================================================================
-- ORDEN DE EJEMPLO
-- =====================================================================
INSERT INTO marketplace.orders (total_amount, status, card_holder_name, user_id, payment_method_id) VALUES
(149.00, 'GENERADA', 'LUCAS TORRES', 4, 1);

INSERT INTO marketplace.order_details (box_name, quantity, unit_price, subtotal, order_id, box_id) VALUES
('Escapada Gourmet', 1, 149.00, 149.00, 1, 1);

-- =====================================================================
-- AJUSTES DE COLUMNAS (por si no están aplicados)
-- =====================================================================
ALTER TABLE marketplace.provider_solicitations MODIFY COLUMN description TEXT;
ALTER TABLE marketplace.boxes MODIFY COLUMN description TEXT;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

SELECT '✅ Base de datos BigBox inicializada con éxito.' AS Resultado;
--CAMBIO PARA ACTUALIZAR LA BASE DE DATOS CON LA NUEVA COLUMNA isDeleted EN LA TABLA user Y boxes, PARA QUE NO HAYA PROBLEMAS CON EL FILTRO DE ENTIDADES ELIMINADAS.
UPDATE boxes SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE provider_solicitations SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE reviews SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE products SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE orders SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE payment_methods SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE discounts SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE box_solicitation_images SET is_deleted = false WHERE is_deleted IS NULL;

UPDATE box_solicitations SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE order_details SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE categories SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE providers SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE image_table SET is_deleted = false WHERE is_deleted IS NULL;
UPDATE discounts SET is_deleted = false WHERE is_deleted IS NULL;