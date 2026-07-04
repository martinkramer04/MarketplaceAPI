USE marketplace;

SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- DUMMY DATA — BoxExperiences (temática Argentina)
-- Tags cubiertos: ARGENTINA, FUTBOL, COPAMUNDIAL, UADE, MCDONALDS,
--                 STARBUCKS, BA, EXPERIENCE, BOCA, TANGO, RIVER, EMPANADA
--                 + ASADO, MALBEC, MUNDIAL, PARRILLA, SAN TELMO
-- Contraseña de todos los usuarios: password (BCrypt rounds=10)
-- =====================================================================

-- =====================================================================
-- LIMPIEZA TOTAL
-- =====================================================================
TRUNCATE TABLE marketplace.order_details;
TRUNCATE TABLE marketplace.reviews;
TRUNCATE TABLE marketplace.orders;
TRUNCATE TABLE marketplace.box_products;
TRUNCATE TABLE marketplace.image_table;
TRUNCATE TABLE marketplace.box_solicitation_images;
TRUNCATE TABLE marketplace.box_solicitations;
TRUNCATE TABLE marketplace.boxes;
TRUNCATE TABLE marketplace.provider_solicitations;
TRUNCATE TABLE marketplace.payment_methods;
TRUNCATE TABLE marketplace.discounts;
TRUNCATE TABLE marketplace.products;
TRUNCATE TABLE marketplace.categories;
TRUNCATE TABLE marketplace.user;

-- =====================================================================
-- USUARIOS
-- 1 admin, 6 providers (cada uno especializado en una temática) y
-- 4 usuarios compradores.
-- =====================================================================
INSERT INTO marketplace.user (firstname, lastname, email, username, password, role) VALUES
('Admin', 'BoxExperiences', 'admin@boxexperiences.com', 'admin', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'ADMIN'),
('Carlos', 'Almada', 'carlos@boxexperiences.com', 'calmada', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Renata', 'Duarte', 'renata@boxexperiences.com', 'rduarte', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Diego', 'Sosa', 'diego@boxexperiences.com', 'dsosa', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Martina', 'Ibanez', 'martina@boxexperiences.com', 'mibanez', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Franco', 'Bianchi', 'franco@boxexperiences.com', 'fbianchi', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Valentina', 'Cruz', 'valentina@boxexperiences.com', 'vcruz', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'PROVIDER'),
('Lucas', 'Fernandez', 'lucas@boxexperiences.com', 'lfernandez', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'USER'),
('Sofia', 'Gomez', 'sofia@boxexperiences.com', 'sgomez', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'USER'),
('Julian', 'Torres', 'julian@boxexperiences.com', 'jtorres', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'USER'),
('Camila', 'Herrera', 'camila@boxexperiences.com', 'cherrera', '$2a$10$951OyvbXiZTcFA8gAnsK4OY5PZuo7fBHrZonvSyux2nZOU3.AFleu', 'USER');

-- IDs resultantes: 1=Admin, 2=Carlos, 3=Renata, 4=Diego, 5=Martina, 6=Franco, 7=Valentina,
--                  8=Lucas, 9=Sofia, 10=Julian, 11=Camila

-- =====================================================================
-- CATEGORÍAS
-- =====================================================================
INSERT INTO marketplace.categories (name, description, user_id, is_deleted) VALUES
('Futbol y Estadios', 'Vivi la pasion albiceleste: Boca, River y la fiebre mundialista', 1, 0),
('Gastronomia Portena', 'Asado, empanadas y los sabores mas autenticos de Buenos Aires', 1, 0),
('Tango y Cultura', 'Milongas, San Telmo y el alma tanguera porteña', 1, 0),
('Turismo BA', 'Recorre Buenos Aires como un porteño mas', 1, 0),
('Cafes y Fast Food', 'Combos y meriendas con las marcas internacionales que amas', 1, 0),
('Experiencias UADE', 'Vida universitaria y experiencias pensadas para estudiantes', 1, 0),
('Vinos y Bodegas', 'Malbec argentino y rutas del vino porteñas', 1, 0),
('Ocasiones Mundialistas', 'Ediciones limitadas para vivir la Copa del Mundo', 1, 0);

-- IDs: 1=Futbol, 2=Gastronomia, 3=Tango, 4=Turismo BA, 5=Cafes, 6=UADE, 7=Vinos, 8=Mundial

-- =====================================================================
-- DESCUENTOS
-- =====================================================================
INSERT INTO marketplace.discounts (name, percentage, is_active, code, discount_type, is_deleted) VALUES
('Bienvenida Albiceleste', 10, 1, 'ARGENTINA10', 'CUPON', 0),
('Fiebre Mundialista', 15, 1, 'COPAMUNDIAL15', 'GENERAL', 0),
('Promo Superclasico', 20, 1, 'SUPERCLASICO20', 'CUPON', 0),
('Descuento Estudiantil UADE', 12, 1, 'UADE12', 'CUPON', 0);

-- IDs: 1=ARGENTINA10, 2=COPAMUNDIAL15, 3=SUPERCLASICO20, 4=UADE12

-- =====================================================================
-- PRODUCTOS (componentes que arman las cajas de experiencia)
-- =====================================================================
INSERT INTO marketplace.products (name, description, user_id, is_deleted) VALUES
('Entrada Cancha Boca Juniors', 'Entrada popular para partido de local en la Bombonera.', 2, 0),
('Camiseta Retro Boca 10', 'Camiseta retro edicion homenaje, talles a eleccion.', 2, 0),
('Tour Museo de la Pasion Boquense', 'Visita guiada al museo y recorrido por el estadio.', 2, 0),
('Clase de Tango en San Telmo', 'Clase grupal de una hora con instructores profesionales.', 3, 0),
('Show de Tango con Cena', 'Cena show en salon tradicional de San Telmo.', 3, 0),
('Docena de Empanadas Criollas', 'Docena surtida: carne, pollo y jamon y queso.', 4, 0),
('Asado Completo para 4 Personas', 'Asado tradicional argentino con achuras y chorizo.', 4, 0),
('Clase de Parrilla Argentina', 'Aprende las tecnicas del asador criollo con parrillero experto.', 4, 0),
('City Tour Buenos Aires', 'Recorrido por Caminito, Recoleta y Palermo en van privada.', 5, 0),
('Visita Guiada Campus UADE + Charla Motivacional', 'Recorrido por el campus y charla con egresados destacados.', 5, 0),
('Combo Starbucks Grande + Postre', 'Bebida grande a eleccion mas postre del dia.', 6, 0),
('Combo Familiar McDonalds', 'Combo para 4 personas con hamburguesas, papas y bebidas.', 6, 0),
('Cata de Malbec Premium', 'Degustacion de 4 etiquetas de Malbec con sommelier.', 7, 0),
('Kit Coleccionable Copa Mundial', 'Set coleccionable oficial rumbo al Mundial.', 7, 0);

-- IDs 1..14 en el orden de arriba

-- =====================================================================
-- CAJAS (BOXES) — el producto principal que se vende en la plataforma
-- =====================================================================
INSERT INTO marketplace.boxes (name, description, price, stock, category_id, user_id, status, is_deleted) VALUES

-- Carlos (id=2) - Futbol
('Dia Xeneize Total', 'Vivi un dia completo como hincha de Boca Juniors: entrada popular para el partido, recorrido por el Museo de la Pasion Boquense y una camiseta retro de regalo. Ideal para el hincha que quiere sentir la Bombonera desde adentro.', 180.00, 20, 1, 2, 'APPROVED', 0),
('Superclasico BA Experience', 'La rivalidad mas grande del futbol argentino en una sola experiencia: tour neutral por ambos estadios, museo y merchandising de recuerdo. Pensado para turistas y fanaticos del futbol que quieren conocer la pasion de Boca y River.', 260.00, 12, 1, 2, 'APPROVED', 0),
('Mini Boca: Recorrido Familiar', 'Una version reducida y familiar del tour por el mundo Xeneize, pensada para ir con chicos. Incluye museo y una merienda tematica.', 90.00, 25, 1, 2, 'PENDING', 0),
('Previa Futbolera Nocturna', 'Recorrido por bares futboleros de la zona sur con primera consumicion incluida.', 70.00, 10, 1, 2, 'REJECTED', 0),

-- Renata (id=3) - Tango
('Noche de Tango en San Telmo', 'Sumergite en el tango porteño con una clase grupal de una hora seguida de un show en vivo con cena de tres pasos en un salon tradicional de San Telmo. Una experiencia imperdible para descubrir el alma de Buenos Aires.', 130.00, 18, 3, 3, 'APPROVED', 0),
('Milonga Portena Autentica', 'Vivi una milonga real junto a bailarines locales, con clase de iniciacion incluida y una copa de bienvenida. La forma mas autentica de conocer la cultura tanguera.', 95.00, 22, 3, 3, 'APPROVED', 0),
('Clase Privada de Tango para Parejas', 'Una clase personalizada de tango para parejas con instructor exclusivo, ideal para aniversarios y ocasiones especiales.', 150.00, 8, 3, 3, 'PENDING', 0),

-- Diego (id=4) - Gastronomia
('Asado Argentino Experience', 'La experiencia gastronomica argentina por excelencia: asado completo con achuras, chorizo y morcilla, acompañado de vinos de la casa y sobremesa con mate. Todo en una parrilla tradicional portena.', 140.00, 15, 2, 4, 'APPROVED', 0),
('Ruta de la Empanada Portena', 'Recorre los mejores puestos de empanadas de Buenos Aires y descubri las variedades de carne, pollo, humita y jamon y queso en un tour guiado a pie.', 75.00, 30, 2, 4, 'APPROVED', 0),
('Clase Magistral de Parrilla', 'Aprende los secretos del asador criollo de la mano de un parrillero profesional: cortes, tiempos de coccion y el fuego perfecto.', 110.00, 12, 2, 4, 'PENDING', 0),
('Fernet y Asado Nocturno', 'Una noche de fernet con cola y asado al aire libre en un patio portenio con musica en vivo.', 85.00, 20, 2, 4, 'REJECTED', 0),

-- Martina (id=5) - Turismo BA / UADE
('Buenos Aires en un Dia: Caminito, Recoleta y Palermo', 'Un recorrido completo por los barrios mas emblematicos de Buenos Aires: los colores de Caminito en La Boca, el cementerio de Recoleta y los bosques de Palermo, con guia turistico incluido.', 100.00, 25, 4, 5, 'APPROVED', 0),
('Experiencia UADE: Un Dia de Universitario', 'Vivi un dia como estudiante de la UADE: recorrido por el campus, charla con egresados destacados y almuerzo en el comedor universitario. Pensado para futuros ingresantes.', 60.00, 40, 6, 5, 'APPROVED', 0),

-- Franco (id=6) - Cafes y Fast Food
('Merienda Starbucks + City Walk', 'Una merienda en Starbucks seguida de una caminata guiada por el microcentro portenio, ideal para recargar energias entre recorridos turisticos.', 45.00, 35, 5, 6, 'APPROVED', 0),
('Combo McDonalds Family Fun', 'Un combo familiar de McDonalds para disfrutar despues de una tarde de paseo, pensado para toda la familia.', 55.00, 30, 5, 6, 'PENDING', 0),

-- Valentina (id=7) - Vinos / Mundial
('Ruta del Malbec en Buenos Aires', 'Descubri el mejor vino argentino sin salir de la ciudad: cata guiada de Malbec premium con sommelier y maridaje de quesos artesanales.', 160.00, 15, 7, 7, 'APPROVED', 0),
('Fiebre Mundialista: Edicion Copa del Mundo', 'Una caja coleccionable pensada para los fanaticos del Mundial: kit oficial, remera de la seleccion argentina y acceso a una previa con transmision en pantalla gigante.', 200.00, 10, 8, 7, 'APPROVED', 0);

-- IDs 1..17 en el orden de arriba

-- =====================================================================
-- IMÁGENES (URLs de Unsplash — verificar que carguen antes de usar en prod)
-- =====================================================================
INSERT INTO marketplace.image_table (created_at, is_deleted, updated_at, image, name, box_id) VALUES
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&q=80', 'Portada Superclasico', 2),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', 'Portada Mini Boca', 3),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80', 'Portada Previa Futbolera', 4),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80', 'Portada Noche de Tango', 5),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80', 'Portada Milonga', 6),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=800&q=80', 'Portada Clase Tango Privada', 7),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', 'Portada Asado Argentino', 8),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'Portada Ruta Empanadas', 9),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80', 'Portada Clase Parrilla', 10),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80', 'Portada Fernet y Asado', 11),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80', 'Portada Buenos Aires', 12),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', 'Portada Merienda Starbucks', 14),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 'Portada Combo McDonalds', 15),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', 'Portada Ruta del Malbec', 16),
(NOW(), 0, NOW(), 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=800&q=80', 'Portada Fiebre Mundialista', 17);

-- =====================================================================
-- RELACIÓN BOX - PRODUCTOS
-- =====================================================================
INSERT INTO marketplace.box_products (box_id, product_id) VALUES
(1, 1),  -- Dia Xeneize Total -> Entrada Cancha Boca
(1, 2),  -- Dia Xeneize Total -> Camiseta Retro
(2, 3),  -- Superclasico BA -> Tour Museo de la Pasion
(5, 4),  -- Noche de Tango -> Clase de Tango
(6, 5),  -- Milonga Portena -> Show de Tango con Cena
(8, 7),  -- Asado Argentino Experience -> Asado Completo
(9, 6),  -- Ruta de la Empanada -> Docena de Empanadas
(10, 8), -- Clase Magistral de Parrilla -> Clase de Parrilla
(12, 9), -- Buenos Aires en un Dia -> City Tour BA
(13, 10),-- Experiencia UADE -> Visita Guiada Campus
(14, 11),-- Merienda Starbucks -> Combo Starbucks
(15, 12),-- Combo McDonalds Family Fun -> Combo Familiar McDonalds
(16, 13),-- Ruta del Malbec -> Cata de Malbec
(17, 14);-- Fiebre Mundialista -> Kit Coleccionable Mundial

-- =====================================================================
-- MÉTODOS DE PAGO
-- =====================================================================
INSERT INTO marketplace.payment_methods (name, description, user_id, is_deleted) VALUES
('Tarjeta de Credito', 'Visa, Mastercard y American Express', 1, 0),
('Tarjeta de Debito', 'Todas las tarjetas de debito', 1, 0),
('Mercado Pago', 'Pago a traves de la billetera virtual Mercado Pago', 1, 0),
('Transferencia Bancaria', 'CBU o CVU', 1, 0);

-- IDs: 1=Credito, 2=Debito, 3=Mercado Pago, 4=Transferencia

-- =====================================================================
-- SOLICITUDES DE PROVEEDOR (flujo become-provider)
-- =====================================================================
INSERT INTO marketplace.provider_solicitations
(solicitation_status, user_id, business_name, owner_name, email, phone, website, category, location, address, description, experience_name, experience_description, min_price, max_price, capacity, duration, is_deleted) VALUES
('GENERADA', 10, 'Parrilla El Rincon Porteno', 'Julian Torres', 'julian.parrilla@gmail.com', '+54 11 4444-5555', 'www.parrillaelrincon.com.ar', 'Gastronomia', 'Palermo, CABA', 'Av. Santa Fe 3456', 'Somos una parrilla familiar con 15 años de trayectoria en el corazon de Palermo, especializados en cortes argentinos y asado tradicional.', 'Clase de Asado y Vinos Argentinos', 'Aprende a hacer el asado perfecto junto a nuestro parrillero, maridado con Malbec de la region.', 60.00, 120.00, 12, '3 horas', 0),
('RECHAZADA', 11, 'Buenos Aires Free Walks', 'Camila Herrera', 'camila.tours@gmail.com', '+54 11 3333-2222', 'www.bafreewalks.com', 'Turismo', 'San Telmo, CABA', 'Defensa 1234', 'Ofrecemos recorridos a pie por los barrios historicos de Buenos Aires con guias locales certificados.', 'Recorrido Nocturno: Fantasmas de San Telmo', 'Un tour nocturno por las calles empedradas de San Telmo conociendo sus leyendas e historias de fantasmas.', 20.00, 30.00, 25, '2 horas', 0);

-- =====================================================================
-- SOLICITUDES DE NUEVAS CAJAS (flujo provider -> nueva box pendiente de aprobacion)
-- =====================================================================
INSERT INTO marketplace.box_solicitations
(title, short_description, detailed_description, price, category_id, cancellation_policy, sub_providers, status, user_id, is_deleted) VALUES
('Previa y Partido: Xeneize VIP', 'Vivi un partido de Boca con entrada VIP y previa incluida', 'Incluye traslado desde el microcentro, previa con choripan y entrada VIP para presenciar un partido de Boca Juniors en la Bombonera.', 220.00, 1, 'Reembolso completo hasta 48hs antes del evento', 'Transporte BA Tours, Bar La Bombonerita', 'PENDING', 2, 0),
('Ruta de Cafeterias Portenas', 'Recorrido por las cafeterias historicas y modernas de Buenos Aires', 'Un recorrido de medio dia por las cafeterias mas emblematicas de la ciudad, desde bares notables hasta las cadenas internacionales mas populares.', 50.00, 5, 'Reembolso completo hasta 24hs antes de la experiencia', 'Cafe Tortoni, Starbucks Recoleta', 'APPROVED', 6, 0),
('Fernet Fest Nocturno', 'Una noche a puro fernet y musica en vivo', 'Evento nocturno con barra libre de fernet con cola y food trucks de comida rapida, ambientado con bandas en vivo.', 65.00, 2, 'Sin reembolso a partir de las 72hs previas', NULL, 'REJECTED', 4, 0);

-- =====================================================================
-- IMÁGENES DE SOLICITUDES DE CAJAS
-- =====================================================================
INSERT INTO marketplace.box_solicitation_images (name, image, solicitation_id, is_deleted) VALUES
('Previa Xeneize VIP', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', 1, 0),
('Ruta de Cafeterias', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', 2, 0),
('Fernet Fest', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80', 3, 0);

-- =====================================================================
-- ÓRDENES DE EJEMPLO (se mantiene un volumen bajo a proposito)
-- =====================================================================
INSERT INTO marketplace.orders (total_amount, status, discount_percentage, discount_code, discount_id, card_holder_name, user_id, payment_method_id, is_deleted) VALUES
(180.00, 'CONFIRMADA', NULL, NULL, NULL, 'LUCAS FERNANDEZ', 8, 1, 0),
(260.00, 'CONFIRMADA', NULL, NULL, NULL, 'SOFIA GOMEZ', 9, 3, 0),
(233.75, 'GENERADA', 15, 'COPAMUNDIAL15', 2, 'JULIAN TORRES', 10, 1, 0),
(160.00, 'RECHAZADA', NULL, NULL, NULL, 'CAMILA HERRERA', 11, 2, 0);

-- IDs: 1=Lucas, 2=Sofia, 3=Julian, 4=Camila

INSERT INTO marketplace.order_details (box_name, quantity, unit_price, subtotal, discount_amount, order_id, box_id, is_deleted) VALUES
('Dia Xeneize Total', 1, 180.00, 180.00, 0.00, 1, 1, 0),
('Noche de Tango en San Telmo', 2, 130.00, 260.00, 0.00, 2, 5, 0),
('Ruta de la Empanada Portena', 1, 75.00, 63.75, 11.25, 3, 9, 0),
('Fiebre Mundialista: Edicion Copa del Mundo', 1, 200.00, 170.00, 30.00, 3, 17, 0),
('Ruta del Malbec en Buenos Aires', 1, 160.00, 160.00, 0.00, 4, 16, 0);

-- =====================================================================
-- RESEÑAS (volumen bajo, mezcla de REVIEWED y WAITING_REVIEW)
-- =====================================================================
INSERT INTO marketplace.reviews (rating, status, comment, user_id, box_id, is_deleted) VALUES
(5, 'REVIEWED', 'Una experiencia unica, senti la pasion de la Bombonera desde el primer minuto. El museo espectacular y la camiseta de regalo un lujo.', 8, 1, 0),
(4, 'REVIEWED', 'La clase de tango estuvo genial y la cena deliciosa. El show se sintio un poco corto pero lo recomiendo totalmente.', 9, 5, 0),
(5, 'REVIEWED', 'El asado estuvo espectacular, cortes de primera y la sobremesa con mate fue el broche perfecto. Volveria mil veces.', 10, 8, 0),
(4, 'REVIEWED', 'Excelente recorrido por Caminito y Recoleta, el guia muy conocedor. Palermo quedo un poco apurado en el tiempo.', 11, 12, 0),
(NULL, 'WAITING_REVIEW', NULL, 10, 9, 0),
(NULL, 'WAITING_REVIEW', NULL, 10, 17, 0),
(NULL, 'WAITING_REVIEW', NULL, 11, 16, 0);

-- =====================================================================
-- AJUSTES DE COLUMNAS (por si no están aplicados)
-- =====================================================================
ALTER TABLE marketplace.provider_solicitations MODIFY COLUMN description TEXT;
ALTER TABLE marketplace.boxes MODIFY COLUMN description TEXT;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

SELECT '✅ Base de datos BoxExperiences inicializada con exito.' AS Resultado;
