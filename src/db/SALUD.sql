



CREATE DATABASE SALUD;
USE SALUD

CREATE TABLE roles (
    id_rol INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL,        -- Nombre del rol (Ej: Administrador, Medico, Recepcionista)  **** creado por adams****
    descripcion VARCHAR(255)        -- Descripcion del rol, para detallar sus permisos
);


-- Tabla de usuarios (pueden ser Administrador, Medico, Recepcionista o Paciente)
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    id_rol INT,  -- Relacionado con el rol del usuario
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,  -- Email unico para cada usuario
    password VARCHAR(255) NOT NULL,  -- Contrasesa para acceso
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);
ALTER TABLE usuarios
ALTER COLUMN password VARCHAR(255);

SELECT *  FROM usuarios 

-- Tabla de pacientes (relacionados con los usuarios)
CREATE TABLE pacientes (
    id_paciente INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT,  -- Relacion con el usuario de tipo paciente
    direccion VARCHAR(200),  -- Direccion del paciente (opcional)
    telefono VARCHAR(20),  -- Telefono del paciente (opcional)
    fecha_nacimiento DATE,  -- Fecha de nacimiento del paciente (opcional)
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)  -- Relacion con el usuario
);

CREATE TABLE medicos (
    id_medico INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT UNIQUE,  -- Relaciona al medico con un usuario
    especializacion VARCHAR(200) NOT NULL,
    fechaIngreso DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)  -- Relacion con la tabla de usuarios
);

-- Tabla de citas (relaciona pacientes y medicos)
CREATE TABLE citas (
    id_cita INT PRIMARY KEY IDENTITY(1,1),
    id_paciente INT,  -- Relacion con paciente
    id_medico INT,  -- Relacion con medico
    fecha DATETIME NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico),
    CONSTRAINT UQ_medico_fecha UNIQUE(id_medico, fecha)  -- No permite citas duplicadas para el mismo medico
);




--borrar tablas
DROP TABLE IF EXISTS paciente;
DROP TABLE IF EXISTS medicos;
DROP TABLE IF EXISTS citas;



INSERT INTO roles (nombre,descripcion)
VALUES ('Administrador','Encargado de solucinar problemas en la plataforma tiene acceso tolal')


INSERT INTO roles (nombre,descripcion)
VALUES ('Medico','solo puede ver los pacientes que esten asignado a el') 

SELECT * FROM roles