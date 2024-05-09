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
CREATE TABLE horario(
	id INT auto_increment primary key,
	dias varchar(50) not null ,
    Hora varchar(50) not null,
    foreign key (id_alumno) references alumnos(id),
    foreign key (id_docente) references docentes(id)
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

insert into login(id,correo,contraseña) 
values (1,'a354312@uach.mx','contraseña1234');

insert into login(id,correo,contraseña) 
values (10,'JMDom@uach.mx','contraseña1234');

insert into alumnos(id,nombre,apellido1,apellido2,matricula,carrera,semestre,materias,asesorias)
values (1,'Pedro','Ruiz','Leiva',354312,'ICC',4,'Ing.software-POO-Algebra_superior-Calculo_vectorial','No tiene asesorias programadas');

insert into alumnos(id,nombre,apellido1,apellido2,matricula,carrera,semestre,materias,asesorias)
values (2,'Julian','Martinez','Perez',334210,'ISCH',3,'Lenguajes_2-Ecuaciones-Termodinamica','Lenguajes_2-Miguel_Dominguez');

insert into docentes(id,nombre,apellido1,apellido2,matricula,materias_en_asesoramiento,asesorados)
values (10,'Jesus_Miguel','Dominguez','Dominguez',12542,'Lenguajes_1-Lenguajes_2',334210);

select *from login;

select *from alumnos;

select *from docentes;

