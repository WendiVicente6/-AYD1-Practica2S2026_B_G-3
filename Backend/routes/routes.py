from flask import Blueprint, request, jsonify
from config.db import get_connection

resenas_bp = Blueprint("resenas", __name__)


def obtener_o_crear_etiqueta(cursor, nombre_etiqueta):
    cursor.execute("SELECT cod_etiqueta FROM tetiqueta WHERE nombre = %s", (nombre_etiqueta,))
    row = cursor.fetchone()
    if row:
        return row[0]
    cursor.execute("INSERT INTO tetiqueta (nombre) VALUES (%s)", (nombre_etiqueta,))
    return cursor.lastrowid


@resenas_bp.route("/api/resenas", methods=["POST"])
def crear_resena():
    data = request.get_json()
    titulo = data.get("titulo_pelicula")
    calificacion = data.get("calificacion")
    comentario = data.get("comentario")
    etiquetas = data.get("etiquetas", [])
    cod_usuario = data.get("cod_usuario")

    if not titulo or not titulo.strip():
        return jsonify({"error": "El título no puede estar vacío"}), 400
    if not comentario or not comentario.strip():
        return jsonify({"error": "El comentario no puede estar vacío"}), 400
    if not calificacion or not (1 <= int(calificacion) <= 5):
        return jsonify({"error": "La calificación debe ser entre 1 y 5"}), 400
    if not cod_usuario:
        return jsonify({"error": "Falta el usuario"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO tresenia (cod_usuario, titulo_pelicula, calificacion, comentario, "
            "destacada, archivada) VALUES (%s, %s, %s, %s, 'N', 'N')",
            (cod_usuario, titulo, calificacion, comentario)
        )
        cod_resena = cursor.lastrowid

        for nombre_etiqueta in etiquetas:
            cod_etiqueta = obtener_o_crear_etiqueta(cursor, nombre_etiqueta)
            cursor.execute(
                "INSERT INTO tresenia_etiqueta (cod_resenia, cod_etiqueta) VALUES (%s, %s)",
                (cod_resena, cod_etiqueta)
            )

        conn.commit()
        return jsonify({"cod_resena": cod_resena, "message": "Reseña creada"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@resenas_bp.route("/api/resenas/<int:cod_resena>", methods=["PUT"])
def modificar_resena(cod_resena):
    data = request.get_json()
    titulo = data.get("titulo_pelicula")
    calificacion = data.get("calificacion")
    comentario = data.get("comentario")
    etiquetas = data.get("etiquetas", [])

    if not titulo or not titulo.strip():
        return jsonify({"error": "El título no puede estar vacío"}), 400
    if not comentario or not comentario.strip():
        return jsonify({"error": "El comentario no puede estar vacío"}), 400
    if not calificacion or not (1 <= int(calificacion) <= 5):
        return jsonify({"error": "La calificación debe ser entre 1 y 5"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE tresenia SET titulo_pelicula=%s, calificacion=%s, comentario=%s, "
            "fec_modificacion=NOW() WHERE cod_resena=%s",
            (titulo, calificacion, comentario, cod_resena)
        )
        if cursor.rowcount == 0:
            return jsonify({"error": "Reseña no encontrada"}), 404

        cursor.execute("DELETE FROM tresenia_etiqueta WHERE cod_resenia=%s", (cod_resena,))
        for nombre_etiqueta in etiquetas:
            cod_etiqueta = obtener_o_crear_etiqueta(cursor, nombre_etiqueta)
            cursor.execute(
                "INSERT INTO tresenia_etiqueta (cod_resenia, cod_etiqueta) VALUES (%s, %s)",
                (cod_resena, cod_etiqueta)
            )

        conn.commit()
        return jsonify({"message": "Reseña modificada"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@resenas_bp.route("/api/resenas/<int:cod_resena>", methods=["DELETE"])
def eliminar_resena(cod_resena):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT cod_resena FROM tresenia WHERE cod_resena=%s", (cod_resena,))
        if cursor.fetchone() is None:
            return jsonify({"error": "Reseña no encontrada"}), 404

        cursor.execute("DELETE FROM tresenia_etiqueta WHERE cod_resenia=%s", (cod_resena,))
        cursor.execute("DELETE FROM tcompartida WHERE cod_resenia=%s", (cod_resena,))
        cursor.execute("DELETE FROM tresenia WHERE cod_resena=%s", (cod_resena,))

        conn.commit()
        return jsonify({"message": "Reseña eliminada"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# COMPARTIR RESEÑAS ENTRE USUARIOS

@resenas_bp.route("/api/resenas/<int:cod_resena>/compartir", methods=["POST"])
def compartir_resena(cod_resena):
    data = request.get_json()
    cod_usuario_origen = data.get("cod_usuario_origen")
    cod_usuario_destino = data.get("cod_usuario_destino")

    if not cod_usuario_origen or not cod_usuario_destino:
        return jsonify({"error": "Faltan datos del usuario"}), 400

    if int(cod_usuario_origen) == int(cod_usuario_destino):
        return jsonify({"error": "No puedes compartir una reseña contigo mismo"}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT cod_usuario FROM tresenia WHERE cod_resena = %s",
            (cod_resena,)
        )
        resena = cursor.fetchone()
        if not resena:
            return jsonify({"error": "Reseña no encontrada"}), 404
        if resena[0] != int(cod_usuario_origen):
            return jsonify({"error": "No tienes permiso para compartir esta reseña"}), 403

        cursor.execute(
            "SELECT cod_usuario FROM tusuario WHERE cod_usuario = %s AND sn_activo = 1",
            (cod_usuario_destino,)
        )
        if not cursor.fetchone():
            return jsonify({"error": "El usuario destino no existe o no está activo"}), 404

        cursor.execute(
            "SELECT cod_compartida FROM tcompartida "
            "WHERE cod_resenia = %s AND cod_usuario_destino = %s",
            (cod_resena, cod_usuario_destino)
        )
        if cursor.fetchone():
            return jsonify({"error": "Ya compartiste esta reseña con ese usuario"}), 409

        cursor.execute(
            "INSERT INTO tcompartida (cod_resenia, cod_usuario_destino) VALUES (%s, %s)",
            (cod_resena, cod_usuario_destino)
        )
        conn.commit()
        return jsonify({"message": "Reseña compartida correctamente"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@resenas_bp.route("/api/resenas/<int:cod_resena>/compartir/<int:cod_usuario_destino>", methods=["DELETE"])
def dejar_de_compartir(cod_resena, cod_usuario_destino):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM tcompartida WHERE cod_resenia = %s AND cod_usuario_destino = %s",
            (cod_resena, cod_usuario_destino)
        )
        if cursor.rowcount == 0:
            return jsonify({"error": "No se encontró ese registro de compartido"}), 404

        conn.commit()
        return jsonify({"message": "Se dejó de compartir la reseña"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@resenas_bp.route("/api/compartidas-conmigo/<int:cod_usuario>", methods=["GET"])
def compartidas_conmigo(cod_usuario):
    """Reseñas que otros usuarios han compartido con cod_usuario."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT
                tc.cod_compartida,
                r.cod_resena,
                r.titulo_pelicula,
                r.calificacion,
                r.comentario,
                tc.fec_compartida,
                u.cod_usuario AS propietario_cod,
                u.nombres AS propietario_nombres,
                u.apellidos AS propietario_apellidos
            FROM tcompartida tc
            INNER JOIN tresenia r ON r.cod_resena = tc.cod_resenia
            INNER JOIN tusuario u ON u.cod_usuario = r.cod_usuario
            WHERE tc.cod_usuario_destino = %s
            ORDER BY tc.fec_compartida DESC
            """,
            (cod_usuario,)
        )
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@resenas_bp.route("/api/mis-compartidas/<int:cod_usuario>", methods=["GET"])
def mis_compartidas(cod_usuario):
    """Reseñas propias que cod_usuario ha compartido, agrupadas con sus destinatarios."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT
                tc.cod_compartida,
                r.cod_resena,
                r.titulo_pelicula,
                tc.fec_compartida,
                d.cod_usuario AS destino_cod,
                d.nombres AS destino_nombres,
                d.apellidos AS destino_apellidos
            FROM tcompartida tc
            INNER JOIN tresenia r ON r.cod_resena = tc.cod_resenia
            INNER JOIN tusuario d ON d.cod_usuario = tc.cod_usuario_destino
            WHERE r.cod_usuario = %s
            ORDER BY r.cod_resena, tc.fec_compartida DESC
            """,
            (cod_usuario,)
        )
        filas = cursor.fetchall()

        resenas = {}
        for fila in filas:
            cod = fila["cod_resena"]
            if cod not in resenas:
                resenas[cod] = {
                    "cod_resena": cod,
                    "titulo_pelicula": fila["titulo_pelicula"],
                    "destinatarios": []
                }
            resenas[cod]["destinatarios"].append({
                "cod_usuario": fila["destino_cod"],
                "nombre_completo": f"{fila['destino_nombres']} {fila['destino_apellidos']}",
                "fec_compartida": fila["fec_compartida"]
            })

        return jsonify(list(resenas.values())), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@resenas_bp.route("/api/usuarios/buscar", methods=["GET"])
def buscar_usuarios():
    """Búsqueda de usuarios activos para compartir una reseña (autocomplete)."""
    termino = request.args.get("q", "").strip()
    cod_usuario_actual = request.args.get("cod_usuario_actual", 0)

    if len(termino) < 2:
        return jsonify([]), 200

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        like = f"%{termino}%"
        cursor.execute(
            """
            SELECT cod_usuario, nombres, apellidos, correo
            FROM tusuario
            WHERE sn_activo = 1
              AND cod_usuario != %s
              AND (nombres LIKE %s OR apellidos LIKE %s OR correo LIKE %s)
            LIMIT 10
            """,
            (cod_usuario_actual, like, like, like)
        )
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@resenas_bp.route("/api/resenas/obtener/usuario/<int:cod_usuario>", methods=["GET"])
def obtener_resenas_del_usuario(cod_usuario):
    """Obtiene todas las reseñas de un usuario específico."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT
                r.cod_resena,
                r.titulo_pelicula,
                r.calificacion,
                r.comentario,
                r.destacada
            FROM tresenia r
            WHERE r.cod_usuario = %s AND r.destacada = 'S'
            ORDER BY r.cod_resena DESC
            """,
            (cod_usuario,)
        )
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@resenas_bp.route("/api/resenas/destacar/<int:cod_usuario>/<int:cod_resena>/<int:check>", methods=["POST"])
def destacar_resena(cod_usuario, cod_resena, check):
    """Destaca una reseña específica de un usuario."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Verificar si la reseña pertenece al usuario
        cursor.execute(
            "SELECT cod_resena FROM tresenia WHERE cod_resena = %s AND cod_usuario = %s",
            (cod_resena, cod_usuario)
        )
        if cursor.fetchone() is None:
            return jsonify({"error": "La reseña no pertenece al usuario"}), 403
        
        # Si check es 0, desmarcar la reseña
        if check == 0:
            cursor.execute(
                "UPDATE tresenia SET destacada = 'N', fec_modificacion = NOW() WHERE cod_resena = %s AND cod_usuario = %s",
                (cod_resena, cod_usuario)
            )
        elif check == 1:
            # Destacar la resenia si le pertenece al usuario
            cursor.execute(
                "UPDATE tresenia SET destacada = 'S', fec_modificacion = NOW() WHERE cod_resena = %s AND cod_usuario = %s",
                (cod_resena, cod_usuario)
            )
        else:
            return jsonify({"error": "Valor de check inválido"}), 400
        conn.commit()
        return jsonify({"message": "Reseña destacada correctamente"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@resenas_bp.route("/api/resenas/archivadas/<int:cod_usuario>", methods=["GET"])
def obtener_resenas_archivadas(cod_usuario):
    """Obtiene todas las reseñas archivadas de un usuario específico."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT
                r.cod_resena,
                r.titulo_pelicula,
                r.calificacion,
                r.comentario,
                r.archivada
            FROM tresenia r
            WHERE r.cod_usuario = %s AND r.archivada = 'S'
            ORDER BY r.cod_resena DESC
            """,
            (cod_usuario,)
        )
        return jsonify(cursor.fetchall()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@resenas_bp.route("/api/resenas/archivar/<int:cod_usuario>/<int:cod_resena>/<int:check>", methods=["POST"])
def archivar_resena(cod_usuario, cod_resena, check):
    """Archiva o desarchiva una reseña específica de un usuario."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Verificar si la reseña pertenece al usuario
        cursor.execute(
            "SELECT cod_resena FROM tresenia WHERE cod_resena = %s AND cod_usuario = %s",
            (cod_resena, cod_usuario)
        )
        if cursor.fetchone() is None:
            return jsonify({"error": "La reseña no pertenece al usuario"}), 403
        
        # Si check es 0, desarchivar la reseña
        if check == 0:
            cursor.execute(
                "UPDATE tresenia SET archivada = 'N', fec_modificacion = NOW() WHERE cod_resena = %s AND cod_usuario = %s",
                (cod_resena, cod_usuario)
            )
        elif check == 1:
            # Archivar la resenia si le pertenece al usuario
            cursor.execute(
                "UPDATE tresenia SET archivada = 'S', fec_modificacion = NOW() WHERE cod_resena = %s AND cod_usuario = %s",
                (cod_resena, cod_usuario)
            )
        else:
            return jsonify({"error": "Valor de check inválido"}), 400
        conn.commit()
        return jsonify({"message": "Reseña archivada correctamente"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()