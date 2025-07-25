-- Base de datos
CREATE DATABASE IF NOT EXISTS mantenimiento;
USE mantenimiento;

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('director', 'encargado', 'contador') NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

-- Tabla de ambulancias
CREATE TABLE ambulancias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_serie VARCHAR(50) NOT NULL,
    unidad VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(50),
    nombre_conductor VARCHAR(100)
);


-- Tabla de talleres
CREATE TABLE talleres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_taller VARCHAR(100) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20)
);

-- Tabla de mantenimientos
CREATE TABLE mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ambulancia_id INT NOT NULL,
    tipo_mantenimiento ENUM('preventivo','correctivo') NOT NULL,
    tipo_servicio ENUM('mayor','menor') NOT NULL,
    fecha DATETIME NOT NULL,
    descripcion TEXT,
    kilometraje INT,
    taller_id INT NOT NULL,
    factura VARCHAR(50) NOT NULL,
    FOREIGN KEY (ambulancia_id) REFERENCES ambulancias(id),
    FOREIGN KEY (taller_id) REFERENCES talleres(id)
);

CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    cantidad TINYINT, 
    costo_unitario DECIMAL NOT NULL,
    mantenimiento_id INT,
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimientosambulancias(id)
)
