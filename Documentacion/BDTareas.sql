CREATE DATABASE BDTareas;
USE BDTareas;

CREATE TABLE Usuario (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,             
    email VARCHAR(255) NOT NULL UNIQUE,      
    clave VARCHAR(255) NOT NULL              
);

CREATE TABLE Tareas (
    IdTarea INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,                           
    nombre VARCHAR(255) NOT NULL,             
    descripcion VARCHAR(500),                
    fecha DATETIME,                          
    fecEdicion DATETIME,                     
    fecFinalizacion DATETIME,                
    IdPrioridad INT,                         
    IdEstado INT,                            
    IdCategoria INT,                         
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
    FOREIGN KEY (IdPrioridad) REFERENCES Prioridad(IdPrioridad),
    FOREIGN KEY (IdEstado) REFERENCES Estado(IdEstado),
    FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria)
);

CREATE TABLE Estado (
    IdEstado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL              
);

CREATE TABLE Prioridad (
    IdPrioridad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL              
);

CREATE TABLE Categoria (
    IdCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL             
);
