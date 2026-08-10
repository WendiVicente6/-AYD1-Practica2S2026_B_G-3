-- ============================================
-- DATOS INICIALES CINECRAFT
-- ============================================

-- Roles
INSERT INTO trol (cod_rol, nombre_rol)
SELECT 0, 'Administrador'
WHERE NOT EXISTS (
    SELECT 1
    FROM trol
    WHERE cod_rol = 0
);

INSERT INTO trol (cod_rol, nombre_rol)
SELECT 1, 'Usuario estándar'
WHERE NOT EXISTS (
    SELECT 1
    FROM trol
    WHERE cod_rol = 1
);


-- Estados de solicitud
INSERT INTO testado (cod_estado, tipo_estado)
SELECT 1, 'Pendiente'
WHERE NOT EXISTS (
    SELECT 1
    FROM testado
    WHERE cod_estado = 1
);

INSERT INTO testado (cod_estado, tipo_estado)
SELECT 2, 'Aceptada'
WHERE NOT EXISTS (
    SELECT 1
    FROM testado
    WHERE cod_estado = 2
);

INSERT INTO testado (cod_estado, tipo_estado)
SELECT 3, 'Rechazada'
WHERE NOT EXISTS (
    SELECT 1
    FROM testado
    WHERE cod_estado = 3
);


-- Usuario administrador
INSERT INTO tusuario (
    genero,
    nombres,
    apellidos,
    cod_rol,
    correo,
    password,
    sn_activo
)
SELECT
    'M',
    'Administrador',
    'CineCraft',
    0,
    'admin@cinecraft.com',
    'Admin123',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM tusuario
    WHERE correo = 'admin@cinecraft.com'
);