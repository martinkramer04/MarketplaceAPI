use marketplace
-- =====================================================================
-- 🔥 SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - MARKETPLACE BIGBOX
-- 💡 Instrucciones: Copiar y ejecutar todo el bloque junto en MySQL Workbench
-- =====================================================================

-- 🔓 Desactivamos el modo seguro y la verificación de claves foráneas temporalmente
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 🧹 PASO 1: LIMPIEZA TOTAL DE TABLAS
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
TRUNCATE TABLE marketplace.providers;         
TRUNCATE TABLE marketplace.role;              
TRUNCATE TABLE marketplace.user; 

-- =====================================================================
-- 👥 PASO 2: INSERCIÓN DE USUARIOS (Basado en tu Enum Role real)
-- =====================================================================
INSERT INTO marketplace.user (id, username, firstname, lastname, email, password, role) VALUES
(1, 'admin_bigbox', 'Admin', 'Principal', 'admin@bigbox.com', 's3cur3', 'ADMIN'),
(2, 'gourmet_partner', 'Gourmet', 'Partner SRL', 'proveedor.gourmet@bigbox.com', 's3cur3', 'PROVIDER'),
(3, 'spa_wellness', 'Spa', 'Wellness Inc', 'proveedor.spa@bigbox.com', 's3cur3', 'PROVIDER'),
(4, 'juan_perez', 'Juan', 'Pérez', 'juan.perez@gmail.com', 's3cur3', 'USER'),
(5, 'maria_rod', 'María', 'Rodriguez', 'maria.rod@gmail.com', 's3cur3', 'USER');
INSERT INTO marketplace.users (firstname, lastname, email, password, role) 
VALUES 
('Admin', 'General', 'admin@gmail.com', '$2a$10$v0vI4l7uG2w6N8fK8z.XTeG.mXlqXQ7z1Y7JOnD8rE3W2q2mJy8r2', 'ADMIN'),

('Proveedor', 'Oficial', 'provider@gmail.com', '$2a$10$v0vI4l7uG2w6N8fK8z.XTeG.mXlqXQ7z1Y7JOnD8rE3W2q2mJy8r2', 'PROVIDER'),

('Usuario', 'Común', 'user@gmail.com', '$2a$10$v0vI4l7uG2w6N8fK8z.XTeG.mXlqXQ7z1Y7JOnD8rE3W2q2mJy8r2', 'USER');

-- =====================================================================
-- 🗂️ PASO 3: CATEGORÍAS (Asegura los IDs para las cajas de la vidriera)
-- =====================================================================
INSERT INTO marketplace.categories (id, name, description, user_id) VALUES
(1, 'Experiencias Gastronómicas', 'Cenas, maridajes y experiencias culinarias', 1),
(2, 'Aventura', 'Paracaidismo, trekking y adrenalina pura', 1),
(3, 'Desayunos, Almuerzos y Tapeos', 'Experiencias de desayuno, brunch y tapas', 1),
(4, 'Estar Bien', 'Tratamientos de spa, masajes y relax holístico', 1),
(5, 'Ocasiones', 'Regalos pensados para momentos especiales', 1),
(6, 'Mix', 'Combinación de experiencias variadas', 1),
(7, 'Cursos y Talleres', 'Aprendé algo nuevo con expertos', 1),
(8, 'Delivery y Take Away', 'Experiencias para disfrutar en casa', 1),
(9, 'Entretenimiento', 'Shows, eventos y actividades culturales', 1),
(10, 'Estadías', 'Hoteles y escapadas de fin de semana', 1);

-- =====================================================================
-- 🏷️ PASO 4: CUPONES DE DESCUENTO (Mapeado con tu Enum real)
-- =====================================================================
INSERT INTO marketplace.discounts (id, name, percentage, is_active, code, discount_type) VALUES
(1, 'Descuento de Bienvenida', 10, 1, 'BIENVENIDA10', 'CUPON'),
(2, 'Especial Gastro', 15, 1, 'GASTRO15', 'GENERAL');

-- =====================================================================
-- 🛠️ PASO 5: PRODUCTOS/PRESTACIONES (Los servicios dentro de las cajas)
-- =====================================================================
INSERT INTO marketplace.products (id, name, description, user_id) VALUES
(1, 'Cena de Pasos Premium', 'Menú degustación exclusivo con maridaje.', 2),
(2, 'Masaje Descontrasturante', 'Sesión de 60 minutos con aceites esenciales.', 3),
(3, 'Salto en Paracaídas', 'Salto biplaza a 3000 metros de altura.', 1),
(4, 'Pase Familiar Parque Temático', 'Acceso ilimitado para 4 personas.', 1);

-- =====================================================================
-- 📦 PASO 6: INSERCIÓN DE CAJAS (Boxes)
-- =====================================================================
INSERT INTO marketplace.boxes (id, name, description, price, stock, category_id, user_id) VALUES
(1, 'Escapada Gourmet', 'La máxima experiencia gastronómica para los entusiastas de la comida.', 149.00, 20, 1, 2),
(2, 'Retiro de Bienestar', 'Recargá energías con una selección de tratamientos de spa premium.', 199.00, 15, 6, 3),
(3, 'Inyección de Adrenalina', 'Para los buscadores de emociones extremas.', 249.00, 10, 2, 1),
(4, 'Diversión en Familia', 'Creá recuerdos duraderos con pases para parques temáticos y talleres.', 129.00, 30, 7, 1);

-- =====================================================================
-- 🖼️ PASO 7: IMÁGENES DE LAS CAJAS (image_table)
-- =====================================================================
INSERT INTO marketplace.image_table (id, created_at, is_deleted, updated_at, image, name, box_id) VALUES
(1, NULL, 0, NULL, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 'Portada Gourmet', 1),
(2, NULL, 0, NULL, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', 'Portada Bienestar', 2),
(3, NULL, 0, NULL, 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=400', 'Portada Adrenalina', 3),
(4, NULL, 0, NULL, 'https://saposyprincesas.elmundo.es/assets/2024/09/Experiencias-imprescindibles-en-familia-Destacada.jpg', 'Portada Familia', 4);

-- =====================================================================
-- ⚙️ PASO 8: RELACIÓN MUCHOS A MUCHOS (box_products)
-- =====================================================================
INSERT INTO marketplace.box_products (box_id, product_id) VALUES
(1, 1), 
(2, 2), 
(3, 3), 
(4, 4); 

-- =====================================================================
-- 🌟 PASO 9: RESEÑAS DE EXPERIENCIAS (Reviews)
-- =====================================================================
INSERT INTO marketplace.reviews (id, rating, status, comment, user_id, box_id) VALUES
(1, 5, 'REVIEWED', 'Increíble la cena de pasos, el restaurante asignado fue excelente.', 4, 1),
(2, 4, 'REVIEWED', 'El hotel de campo y los masajes fueron super relajantes.', 5, 2);

-- =====================================================================
-- 💳 PASO 10: MÉTODOS DE PAGO Y FLUJO DE COMPRA (Con status NULL seguro)
-- =====================================================================
INSERT INTO marketplace.payment_methods (id, name, description, user_id) VALUES
(1, 'Tarjeta de Crédito Visa', 'Terminada en 4321', 4);

INSERT INTO marketplace.orders (id, total_amount, status, card_holder_name, user_id, payment_method_id, discount_id) VALUES
(1, 149.00, NULL, 'JUAN PEREZ', 4, 1, NULL);

INSERT INTO marketplace.order_details (id, box_name, quantity, unit_price, subtotal, order_id, box_id) VALUES
(1, 'Escapada Gourmet', 1, 149.00, 149.00, 1, 1);

-- =====================================================================
-- 🔒 RE-ACTIVACIÓN DE SEGURIDAD
-- =====================================================================
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;


-- =====================================================================
-- NOTA: Cambiio para que funcione la solicitud de proveedor.
ALTER TABLE marketplace.provider_solicitations 
MODIFY COLUMN description TEXT;
-- =====================================================================
SELECT '✅ ¡Base de datos BigBox inicializada con éxito total!' AS Resultado;