from flask import Blueprint, request, jsonify, session
from config.db import get_connection

user_bp = Blueprint("usuario", __name__, url_prefix="/api/usuario")

@user_bp.route("/perfil", methods=["GET"])
def obtener_perfil():
    cod_usuario = session.get("user_id")
    print("Usuario en sesión:", cod_usuario)  # Debugging line

    if not cod_usuario:
        return jsonify({
            "success": False,
            "message": "No hay sesión activa o el usuario no tiene permiso para acceder a este perfil."
        }), 401

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT cod_usuario, nombres, apellidos, correo, cod_rol, genero, password "
            "FROM tusuario "
            "WHERE cod_usuario = %s",
            (cod_usuario,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Usuario no encontrado."
            }), 404

        return jsonify({
            "data": {
                "id": user["cod_usuario"],
                "nombres": user["nombres"],
                "apellidos": user["apellidos"],
                "email": user["correo"],
                "role_id": user["cod_rol"],
                "gender": user["genero"],
                "password": user["password"]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al obtener el perfil: {str(e)}"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@user_bp.route("/perfil/actualizar", methods=["PUT"])
def actualizar_perfil():
    cod_usuario = session.get("user_id")
    print("Usuario en sesión:", cod_usuario)  # Debugging line

    if not cod_usuario:
        return jsonify({
            "success": False,
            "message": "No hay sesión activa o el usuario no tiene permiso para actualizar este perfil."
        }), 401

    data = request.get_json()
    nombres = data.get("nombres")
    apellidos = data.get("apellidos")
    correo = data.get("correo")
    genero = data.get("genero")
    password = data.get("password")
    cod_rol = data.get("cod_rol")

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "UPDATE tusuario SET nombres = %s, apellidos = %s, correo = %s, genero = %s, password = %s, cod_rol = %s "
            "WHERE cod_usuario = %s",
            (nombres, apellidos, correo, genero, password, cod_rol, cod_usuario)
        )
        connection.commit()

        return jsonify({
            "success": True,
            "message": "Perfil actualizado correctamente."
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error al actualizar el perfil: {str(e)}"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()