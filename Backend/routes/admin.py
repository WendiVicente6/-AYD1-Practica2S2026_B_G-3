from flask import Blueprint, request, jsonify
from config.db import get_connection

admin_bp = Blueprint("admin", __name__)

# ==================================================
# Listar solicitudes pendientes de aprobación o rechazo
# ==================================================

@admin_bp.route("/api/admin/solicitudes", methods=["GET"])
def listar_solicitudes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                s.cod_solicitud,
                s.cod_usuario,
                u.nombres,
                u.apellidos,
                u.correo,
                s.fec_solicitud,
                s.cod_estado,
                e.tipo_estado,
                s.motivo_rechazo,
                s.fec_respuesta,
                s.cod_admin
            FROM tsol_registro s
            INNER JOIN tusuario u
                ON u.cod_usuario = s.cod_usuario
            INNER JOIN testado e
                ON e.cod_estado = s.cod_estado
            WHERE s.cod_estado = 1
            ORDER BY s.fec_solicitud DESC 
        """)

        solicitudes = cursor.fetchall()

        return jsonify(solicitudes), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()

# ==================================================
#Aprueba una solicitud pendiente de aprobación
# ==================================================

@admin_bp.route("/api/admin/solicitudes/<int:cod_solicitud>/aprobar", methods=["PUT"])
def aprobar_solicitud(cod_solicitud):

    data = request.get_json() or {}
    cod_admin = data.get("cod_admin")

    if not cod_admin:
        return jsonify({
            "error": "Falta el administrador"
        }), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        # Verificar que quien responde sea administrador
        cursor.execute("""
            SELECT cod_usuario
            FROM tusuario
            WHERE cod_usuario = %s
              AND cod_rol = 0
              AND sn_activo = 1
        """, (cod_admin,))

        admin = cursor.fetchone()

        if not admin:
            return jsonify({
                "error": "El usuario no es un administrador activo"
            }), 403

        # Verificar que la solicitud exista y esté pendiente
        cursor.execute("""
            SELECT cod_solicitud
            FROM tsol_registro
            WHERE cod_solicitud = %s
              AND cod_estado = 1
        """, (cod_solicitud,))

        solicitud = cursor.fetchone()

        if not solicitud:
            return jsonify({
                "error": "La solicitud no existe o ya fue procesada"
            }), 404

        # Aprobar solicitud
        cursor.execute("""
    UPDATE tusuario u
    INNER JOIN tsol_registro s
        ON s.cod_usuario = u.cod_usuario
    SET u.sn_activo = 1
    WHERE s.cod_solicitud = %s
""", (cod_solicitud,))
        cursor.execute("""
            UPDATE tsol_registro
            SET
                cod_estado = 2,
                fec_respuesta = NOW(),
                cod_admin = %s,
                motivo_rechazo = NULL
            WHERE cod_solicitud = %s
        """, (cod_admin, cod_solicitud))

        conn.commit()

        return jsonify({
            "message": "Solicitud aprobada correctamente"
        }), 200

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()


# ==================================================
# Rechaza una solicitud pendiente de aprobación
# ==================================================

@admin_bp.route("/api/admin/solicitudes/<int:cod_solicitud>/rechazar", methods=["PUT"])
def rechazar_solicitud(cod_solicitud):

    data = request.get_json() or {}

    cod_admin = data.get("cod_admin")
    motivo = data.get("motivo_rechazo")

    if not cod_admin:
        return jsonify({
            "error": "Falta el administrador"
        }), 400

    if not motivo or not motivo.strip():
        return jsonify({
            "error": "Debe indicar el motivo del rechazo"
        }), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        # Verificar administrador
        cursor.execute("""
            SELECT cod_usuario
            FROM tusuario
            WHERE cod_usuario = %s
              AND cod_rol = 0
              AND sn_activo = 1
        """, (cod_admin,))

        admin = cursor.fetchone()

        if not admin:
            return jsonify({
                "error": "El usuario no es un administrador activo"
            }), 403

        # Verificar solicitud pendiente
        cursor.execute("""
            SELECT cod_solicitud
            FROM tsol_registro
            WHERE cod_solicitud = %s
              AND cod_estado = 1
        """, (cod_solicitud,))

        solicitud = cursor.fetchone()

        if not solicitud:
            return jsonify({
                "error": "La solicitud no existe o ya fue procesada"
            }), 404

        # Rechazar
        cursor.execute("""
            UPDATE tsol_registro
            SET
                cod_estado = 3,
                motivo_rechazo = %s,
                fec_respuesta = NOW(),
                cod_admin = %s
            WHERE cod_solicitud = %s
        """, (motivo.strip(), cod_admin, cod_solicitud))

        conn.commit()

        return jsonify({
            "message": "Solicitud rechazada correctamente"
        }), 200

    except Exception as e:
        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()



# ==================================================
# Lista las solicitudes aprobadas o rechazadas (muestra el historial)
# ==================================================


@admin_bp.route("/api/admin/solicitudes/historial", methods=["GET"])
def historial_solicitudes():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT
                s.cod_solicitud,
                s.cod_usuario,
                CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
                u.correo,
                s.fec_solicitud,
                s.cod_estado,
                e.tipo_estado,
                s.motivo_rechazo,
                s.fec_respuesta,
                s.cod_admin,
                CONCAT(a.nombres, ' ', a.apellidos) AS administrador
            FROM tsol_registro s

            INNER JOIN tusuario u
                ON u.cod_usuario = s.cod_usuario

            INNER JOIN testado e
                ON e.cod_estado = s.cod_estado

            LEFT JOIN tusuario a
                ON a.cod_usuario = s.cod_admin

            WHERE s.cod_estado IN (2, 3)

            ORDER BY s.fec_respuesta DESC
        """)

        historial = cursor.fetchall()

        return jsonify(historial), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()


# ==================================================
# REPORTE DEL TOP 5 DE USUARIOS CON MÁS RESEÑAS 
# ==================================================


@admin_bp.route("/api/admin/reportes/top-resenas", methods=["GET"])
def top_resenas():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                u.cod_usuario,
                CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
                u.correo,
                COUNT(r.cod_resena) AS total_resenas
            FROM tusuario u
            INNER JOIN tresenia r
                ON r.cod_usuario = u.cod_usuario
            WHERE u.cod_rol = 1
            GROUP BY
                u.cod_usuario,
                u.nombres,
                u.apellidos,
                u.correo
            ORDER BY total_resenas DESC
            LIMIT 5
        """)

        resultado = cursor.fetchall()

        return jsonify(resultado), 200

    except Exception as e:
        print("ERROR TOP RESEÑAS:", e)

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==================================================
# REPORTE DEL TOP 5 DE USUARIOS CON MÁS RESEÑAS COMPARTIDAS
# ==================================================


@admin_bp.route("/api/admin/reportes/top-compartidas", methods=["GET"])
def top_compartidas():
    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                u.cod_usuario,
                CONCAT(u.nombres, ' ', u.apellidos) AS usuario,
                u.correo,
                COUNT(c.cod_compartida) AS total_compartidas
            FROM tusuario u
            INNER JOIN tresenia r
                ON r.cod_usuario = u.cod_usuario
            INNER JOIN tcompartida c
                ON c.cod_resenia = r.cod_resena
            WHERE u.cod_rol = 1
            GROUP BY
                u.cod_usuario,
                u.nombres,
                u.apellidos,
                u.correo
            ORDER BY total_compartidas DESC
            LIMIT 5
        """)

        resultado = cursor.fetchall()

        return jsonify(resultado), 200

    except Exception as e:
        print("ERROR TOP COMPARTIDAS:", e)

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()