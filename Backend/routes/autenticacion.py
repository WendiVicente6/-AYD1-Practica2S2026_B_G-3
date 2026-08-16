from functools import wraps

from flask import (
    Blueprint,
    request,
    jsonify,
    session
)

from werkzeug.security import (
    check_password_hash,
    generate_password_hash
)

from config.db import get_connection


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# =========================================================
# VALIDAR CONTRASEÑA
# =========================================================

def verify_password(stored_password, entered_password):

    # Si ya es un hash generado por Werkzeug
    if stored_password.startswith(
        ("scrypt:", "pbkdf2:", "argon2:")
    ):
        try:
            return check_password_hash(
                stored_password,
                entered_password
            )
        except ValueError:
            return False

    # Compatibilidad temporal con contraseñas
    # antiguas almacenadas en texto plano.
    return stored_password == entered_password


# =========================================================
# LOGIN
# =========================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No se recibieron datos."
        }), 400

    email = data.get("email", "").strip()
    password = data.get("password", "")

    # -------------------------
    # Validaciones
    # -------------------------

    if not email:
        return jsonify({
            "success": False,
            "message": "El correo electrónico es obligatorio."
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "message": "La contraseña es obligatoria."
        }), 400

    connection = None
    cursor = None

    try:

        connection = get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        # =================================================
        # CONSULTAR USUARIO
        # =================================================

        query = """
            SELECT
                u.cod_usuario,
                u.nombres,
                u.apellidos,
                u.correo,
                u.password,
                u.cod_rol,
                u.sn_activo,
                r.nombre_rol
            FROM tusuario u
            INNER JOIN trol r
                ON u.cod_rol = r.cod_rol
            WHERE u.correo = %s
        """

        cursor.execute(
            query,
            (email,)
        )

        user = cursor.fetchone()

        # =================================================
        # USUARIO NO EXISTE
        # =================================================

        if not user:

            return jsonify({
                "success": False,
                "message":
                    "El correo o la contraseña son incorrectos."
            }), 401

        # =================================================
        # CUENTA INACTIVA
        # =================================================

        if user["sn_activo"] != 1:

            return jsonify({
                "success": False,
                "message":
                    "Tu cuenta no está activa. "
                    "Espera la aprobación del administrador."
            }), 403

        # =================================================
        # VALIDAR PASSWORD
        # =================================================

        if not verify_password(
            user["password"],
            password
        ):

            return jsonify({
                "success": False,
                "message":
                    "El correo o la contraseña son incorrectos."
            }), 401

        # =================================================
        # ACTUALIZAR PASSWORD A HASH
       # =================================================
#
        #if not user["password"].startswith(
        #    ("scrypt:", "pbkdf2:", "argon2:")
        #):
#
        #    new_hash = generate_password_hash(
        #        password
        #    )
#
        #    update_query = """
        #        UPDATE tusuario
        #        SET password = %s
        #        WHERE cod_usuario = %s
        #    """
#
        #    cursor.execute(
        #        update_query,
        #        (
        #            new_hash,
        #            user["cod_usuario"]
        #        )
        #    )
#
        #    connection.commit()
#
        ## =================================================
        # CREAR SESIÓN
        # =================================================

        session.clear()

        session["user_id"] = user["cod_usuario"]
        session["role_id"] = user["cod_rol"]

        # =================================================
        # DETERMINAR ROL
        # =================================================

        if user["cod_rol"] == 0:

            role = "admin"

        elif user["cod_rol"] == 1:

            role = "user"

        else:

            return jsonify({
                "success": False,
                "message": "El rol del usuario no es válido."
            }), 403

        # =================================================
        # RESPUESTA
        # =================================================

        return jsonify({

            "success": True,

            "message":
                "Inicio de sesión exitoso.",

            "user": {

                "id":
                    user["cod_usuario"],

                "nombres":
                    user["nombres"],

                "apellidos":
                    user["apellidos"],

                "email":
                    user["correo"],

                "role":
                    role,

                "role_name":
                    user["nombre_rol"]
            }

        }), 200

    except Exception as error:

        print(
            "ERROR LOGIN:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Ocurrió un error interno "
                "al iniciar sesión."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# SESIÓN ACTUAL
# =========================================================

@auth_bp.route("/me", methods=["GET"])
def current_user():

    user_id = session.get("user_id")
    role_id = session.get("role_id")

    if not user_id:

        return jsonify({
            "authenticated": False
        }), 401

    return jsonify({

        "authenticated": True,

        "user": {
            "id": user_id,
            "role_id": role_id
        }

    }), 200


# =========================================================
# LOGOUT
# =========================================================

@auth_bp.route("/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({

        "success": True,

        "message":
            "Sesión cerrada correctamente."

    }), 200