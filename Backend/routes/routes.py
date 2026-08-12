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