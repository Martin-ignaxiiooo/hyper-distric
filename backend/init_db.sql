DROP DATABASE IF EXISTS hyper_db;
CREATE DATABASE hyper_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hyper_db;
SET NAMES utf8mb4;


CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    precio INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria_id INT,
    descripcion TEXT,
    color VARCHAR(50),
    estilo VARCHAR(100),
    material VARCHAR(100),
    badge VARCHAR(50),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS imagenes_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    principal BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS estados_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    estado_id INT NOT NULL,
    total INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_id) REFERENCES estados_pedido(id) ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);







INSERT IGNORE INTO roles (id, nombre) VALUES 
(1, 'admin'),
(2, 'cliente');


INSERT IGNORE INTO usuarios (id, nombre, email, password, rol_id) VALUES 
(1, 'Administrador', 'admin@hyperdistric.cl', '1234', 1),
(2, 'Cliente Demo', 'cliente@hyperdistric.cl', '1234', 2);


INSERT IGNORE INTO categorias (id, nombre) VALUES 
(1, 'Poleras'),
(2, 'Hoodies'),
(3, 'Pantalones'),
(4, 'Chaquetas');


INSERT IGNORE INTO estados_pedido (id, nombre) VALUES 
(1, 'Pendiente'),
(2, 'Pagado'),
(3, 'En preparación'),
(4, 'Enviado'),
(5, 'Entregado'),
(6, 'Cancelado');


INSERT IGNORE INTO productos (id, nombre, slug, precio, stock, categoria_id, descripcion, color, estilo, material, badge) VALUES 
(1, 'Polera Oversize Negra', 'polera-oversize-negra', 14990, 10, 1, 'Polera negra de corte oversize ideal para look urbano.', 'Negro', 'Oversized fit', 'Algodón', 'Streetwear'),
(2, 'Hoodie Street Gris', 'hoodie-street-gris', 29990, 8, 2, 'Hoodie gris con capucha, estilo streetwear premium.', 'Gris', 'Streetwear urbano', 'Algodón Premium', 'Nuevo Drop'),
(3, 'Pantalón Cargo Beige', 'pantalon-cargo-beige', 24990, 6, 3, 'Pantalón cargo de tela resistente color beige.', 'Beige', 'Drop urbano', 'Tela resistente', 'Nueva colección'),
(4, 'Chaqueta Denim Azul', 'chaqueta-denim-azul', 34990, 5, 4, 'Chaqueta de mezclilla azul clásico.', 'Azul', 'Streetwear denim', 'Denim', 'Colección'),
(5, 'Polera Boxy Fit Blanca', 'polera-boxy-blanca', 15990, 15, 1, 'Polera blanca con ajuste boxy fit.', 'Blanco', 'Boxy fit', 'Algodón grueso', 'Básico'),
(6, 'Polera Washed Gris', 'polera-washed-gris', 16990, 12, 1, 'Polera color gris desgastado (washed).', 'Gris', 'Washed', 'Algodón', 'Vintage'),
(7, 'Hoodie Oversize Negro', 'hoodie-oversize-negro', 31990, 7, 2, 'Hoodie oversize color negro profundo.', 'Negro', 'Oversized', 'French Terry', 'Premium'),
(8, 'Hoodie Zip Grafito', 'hoodie-zip-grafito', 32990, 9, 2, 'Hoodie con cierre frontal en color gris grafito.', 'Grafito', 'Zip up', 'Algodón / Poliéster', 'Nuevo'),
(9, 'Pantalón Cargo Negro', 'pantalon-cargo-negro', 25990, 6, 3, 'Pantalón cargo color negro con múltiples bolsillos.', 'Negro', 'Tactical', 'Ripstop', 'Restock'),
(10, 'Chaqueta Bomber Negra', 'chaqueta-bomber-negra', 39990, 4, 4, 'Chaqueta bomber clásica color negro.', 'Negro', 'Bomber', 'Nylon', 'Invierno');


INSERT IGNORE INTO imagenes_producto (producto_id, url, principal) VALUES 
(1, './img/polera-oversize-negra.webp', TRUE),
(2, './img/hoodie-street-gris.webp', TRUE),
(3, './img/pantalon-cargo-beige.webp', TRUE),
(4, './img/chaqueta-denim-azul.webp', TRUE),
(5, './img/polera-boxy-blanca.webp', TRUE),
(6, './img/polera-washed-gris.webp', TRUE),
(7, './img/hoodie-oversize-negro.webp', TRUE),
(8, './img/hoodie-zip-grafito.webp', TRUE),
(9, './img/pantalon-cargo-negro.webp', TRUE),
(10, './img/chaqueta-bomber-negra.webp', TRUE);
