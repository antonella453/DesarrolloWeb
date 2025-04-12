CREATE DATABASE DBLTareas;
USE DBLTareas;

CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE estado (
    id INT(5) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO estado (nombre) VALUES 
    ('Pendiente'),
    ('En progreso'),
    ('Completado');

CREATE TABLE prioridad (
    id INT(5) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO prioridad (nombre) VALUES 
    ('Importante'),
    ('Urgente'),
    ('No Importante'),
    ('No Urgente'),
    ('Puede Esperar');

CREATE TABLE categoria (
    id INT(5) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO categoria (nombre) VALUES 
    ('Proyecto'),
    ('Tarea'),
    ('Reunion');

CREATE TABLE tareas (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    user_id INT(11),
    categoria_id INT(5),
    prioridad_id INT(5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecfinal DATE,
    estado_id INT(5),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (prioridad_id) REFERENCES prioridad(id),
    FOREIGN KEY (estado_id) REFERENCES estado(id)
);

-- INSERT INTO users (username, password, fullname) VALUES
--    ('usuario1', 'password1', 'Usuario Uno'),
--    ('usuario2', 'password2', 'Usuario Dos');


DESCRIBE tareas;

SELECT * FROM tareas;
SELECT * FROM estado;
SELECT * FROM prioridad;
SELECT * FROM categoria;
SELECT * FROM users;