-- =============================================
-- BigBox Marketplace — Script de datos iniciales
-- Ejecutar en MySQL Workbench antes de correr la app
-- =============================================

USE marketplace;

-- =============================================
-- CATEGORIAS
-- =============================================
-- Limpiar datos existentes respetando foreign keys
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO categories (id, name, description, user_id) VALUES 
(1, 'Experiencias Gastronómicas', 'Cenas, maridajes y experiencias culinarias', 0),
(2, 'Aventura', 'Deportes extremos y actividades al aire libre', 0),
(3, 'Desayunos, Almuerzos y Tapeos', 'Experiencias de desayuno, brunch y tapas', 0),
(4, 'Estar Bien', 'Bienestar, spa y relajación', 0),
(5, 'Ocasiones', 'Experiencias para momentos especiales', 0),
(6, 'Mix', 'Combinación de experiencias variadas', 0),
(7, 'Cursos y Talleres', 'Aprendé algo nuevo con expertos', 0),
(8, 'Delivery y Take Away', 'Experiencias para disfrutar en casa', 0),
(9, 'Entretenimiento', 'Shows, eventos y actividades culturales', 0),
(10, 'Estadías', 'Hoteles y escapadas de fin de semana', 0);

INSERT INTO boxes (id, name, description, price, stock, category_id, user_id) VALUES
(1, 'Escapada Gourmet', 'La máxima experiencia gastronómica para los entusiastas de la comida.', 149.00, 20, 1, 1),
(2, 'Retiro de Bienestar', 'Recargá energías con una selección de tratamientos de spa premium y terapias holísticas.', 199.00, 15, 6, 1),
(3, 'Inyección de Adrenalina', 'Para los buscadores de emociones. Elección entre paracaidismo, automovilismo o puenting.', 249.00, 10, 2, 1),
(4, 'Diversión en Familia', 'Creá recuerdos duraderos con pases para parques temáticos y días de talleres interactivos.', 129.00, 30, 7, 1);

INSERT INTO marketplace.image_table (id, created_at, is_deleted, updated_at, image, name, box_id) VALUES
(1, NULL, 0, NULL, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 'Portada Gourmet', 1),
(2, NULL, 0, NULL, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', 'Portada Bienestar', 2),
(3, NULL, 0, NULL, 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=400', 'Portada Adrenalina', 3),
(4, NULL, 0, NULL, 'https://saposyprincesas.elmundo.es/assets/2024/09/Experiencias-imprescindibles-en-familia-Destacada.jpg', 'Portada Familia', 4);