CREATE DATABASE UACH_AS;

use UACH_AS;

create table login
(
id int unsigned primary key not null,
correo varchar (25) not null,
contraseña varchar(45) not null
);
CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido1 VARCHAR(100) NOT NULL,
    apellido2 VARCHAR(100),
    matricula VARCHAR(20) NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    semestre INT NOT NULL,
    materias varchar(255)not null,
    asesorias varchar(255)
);
CREATE TABLE docentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido1 VARCHAR(100) NOT NULL,
    apellido2 VARCHAR(100),
    matricula VARCHAR(20) NOT NULL,
    materias_en_asesoramiento VARCHAR(255)not null,
    asesorados varchar (255) 
);
CREATE TABLE foro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id)
);

CREATE TABLE administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_docente INT NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id),
    FOREIGN KEY (id_docente) REFERENCES docentes(id)
);
