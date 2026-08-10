CREATE DATABASE IF NOT EXISTS db_cinecraft_g3;
USE db_cinecraft_g3;


-- ============================================
-- TABLA: trol
-- ============================================

CREATE TABLE trol (
    cod_rol INT NOT NULL,
    nombre_rol VARCHAR(70) NOT NULL,

    CONSTRAINT trol_pk PRIMARY KEY (cod_rol),
    CONSTRAINT trol_nombre_uk UNIQUE (nombre_rol)
);


-- ============================================
-- TABLA: testado
-- ============================================

CREATE TABLE testado (
    cod_estado INT NOT NULL,
    tipo_estado VARCHAR(15) NOT NULL,

    CONSTRAINT testado_pk PRIMARY KEY (cod_estado),
    CONSTRAINT testado_tipo_uk UNIQUE (tipo_estado)
);


-- ============================================
-- TABLA: tusuario
-- ============================================

CREATE TABLE tusuario (
    cod_usuario INT NOT NULL AUTO_INCREMENT,
    genero CHAR(1) NOT NULL,
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    cod_rol INT NOT NULL,
    correo VARCHAR(100) NOT NULL,
    password VARCHAR(150) NOT NULL,
    sn_activo TINYINT(1) NOT NULL DEFAULT 0,

    CONSTRAINT tusuario_pk PRIMARY KEY (cod_usuario),

    CONSTRAINT tusuario_correo_uk UNIQUE (correo),

    CONSTRAINT tusuario_trol_fk
        FOREIGN KEY (cod_rol)
        REFERENCES trol (cod_rol),

    CONSTRAINT tusuario_sn_activo_ck
        CHECK (sn_activo IN (0, 1))
);


-- ============================================
-- TABLA: tresenia
-- ============================================

CREATE TABLE tresenia (
    cod_resena INT NOT NULL AUTO_INCREMENT,
    cod_usuario INT NOT NULL,
    titulo_pelicula VARCHAR(70) NOT NULL,
    calificacion INT NOT NULL,
    comentario VARCHAR(150) NOT NULL,
    destacada CHAR(1) DEFAULT 'N',
    archivada CHAR(1) DEFAULT 'N',
    fec_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fec_modificacion TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT tresenia_pk PRIMARY KEY (cod_resena),

    CONSTRAINT tresenia_tusuario_fk
        FOREIGN KEY (cod_usuario)
        REFERENCES tusuario (cod_usuario),

    CONSTRAINT tresenia_calificacion_ck
        CHECK (calificacion BETWEEN 1 AND 5),

    CONSTRAINT tresenia_destacada_ck
        CHECK (destacada IN ('S', 'N')),

    CONSTRAINT tresenia_archivada_ck
        CHECK (archivada IN ('S', 'N'))
);


-- ============================================
-- TABLA: tetiqueta
-- ============================================

CREATE TABLE tetiqueta (
    cod_etiqueta INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,

    CONSTRAINT tetiqueta_pk PRIMARY KEY (cod_etiqueta),

    CONSTRAINT tetiqueta_nombre_uk UNIQUE (nombre)
);


-- ============================================
-- TABLA: tresenia_etiqueta
-- ============================================

CREATE TABLE tresenia_etiqueta (
    cod_resenia INT NOT NULL,
    cod_etiqueta INT NOT NULL,

    CONSTRAINT tresenia_etiqueta_pk
        PRIMARY KEY (cod_resenia, cod_etiqueta),

    CONSTRAINT tresenia_etiqueta_tresenia_fk
        FOREIGN KEY (cod_resenia)
        REFERENCES tresenia (cod_resena),

    CONSTRAINT tresenia_etiqueta_tetiqueta_fk
        FOREIGN KEY (cod_etiqueta)
        REFERENCES tetiqueta (cod_etiqueta)
);


-- ============================================
-- TABLA: tsol_registro
-- ============================================

CREATE TABLE tsol_registro (
    cod_solicitud INT NOT NULL AUTO_INCREMENT,
    cod_usuario INT NOT NULL,
    fec_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_estado INT NOT NULL,
    motivo_rechazo VARCHAR(60) NULL,
    fec_respuesta TIMESTAMP NULL DEFAULT NULL,
    cod_admin INT NULL,

    CONSTRAINT tsol_registro_pk PRIMARY KEY (cod_solicitud),

    CONSTRAINT tsol_registro_tusuario_fk
        FOREIGN KEY (cod_usuario)
        REFERENCES tusuario (cod_usuario),

    CONSTRAINT tsol_registro_testado_fk
        FOREIGN KEY (cod_estado)
        REFERENCES testado (cod_estado),

    CONSTRAINT tsol_registro_admin_fk
        FOREIGN KEY (cod_admin)
        REFERENCES tusuario (cod_usuario)
);


-- ============================================
-- TABLA: tcompartida
-- ============================================

CREATE TABLE tcompartida (
    cod_compartida INT NOT NULL AUTO_INCREMENT,
    cod_resenia INT NOT NULL,
    cod_usuario_destino INT NOT NULL,
    fec_compartida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tcompartida_pk PRIMARY KEY (cod_compartida),

    CONSTRAINT tcompartida_tresenia_fk
        FOREIGN KEY (cod_resenia)
        REFERENCES tresenia (cod_resena),

    CONSTRAINT tcompartida_tusuario_fk
        FOREIGN KEY (cod_usuario_destino)
        REFERENCES tusuario (cod_usuario)
);