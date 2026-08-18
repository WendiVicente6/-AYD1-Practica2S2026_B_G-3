from functools import wraps
#from werkzeug.security import generate_password_hash

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
# REGISTRO DE USUARIO
# =========================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    nombres = data.get("nombres", "").strip()
    apellidos = data.get("apellidos", "").strip()
    genero = data.get("genero", "").strip()
    correo = data.get("correo", "").strip()
    password = data.get("password", "")
    confirmar_password = data.get("confirmar_password", "")

    if not nombres:
        return jsonify({
            "message": "Los nombres son obligatorios."
        }), 400

    if not apellidos:
        return jsonify({
            "message": "Los apellidos son obligatorios."
        }), 400

    if not genero:
        return jsonify({
            "message": "El género es obligatorio."
        }), 400

    if not correo:
        return jsonify({
            "message": "El correo es obligatorio."
        }), 400

    if not password:
        return jsonify({
            "message": "La contraseña es obligatoria."
        }), 400

    if password != confirmar_password:
        return jsonify({
            "message": "Las contraseñas no coinciden."
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT cod_usuario
            FROM tusuario
            WHERE correo = %s
        """, (correo,))

        usuario_existente = cursor.fetchone()

        if usuario_existente:
            return jsonify({
                "message": "El correo ya está registrado."
            }), 409

        # Aquí debes usar el mismo método de hash
        # que utiliza actualmente tu login/registro.
        #password_hash = generate_password_hash(password)

        cursor.execute("""
            INSERT INTO tusuario
            (
                genero,
                nombres,
                apellidos,
                cod_rol,
                correo,
                password,
                sn_activo
            )
            VALUES
            (
                %s,
                %s,
                %s,
                1,
                %s,
                %s,
                0
            )
        """, (
            genero,
            nombres,
            apellidos,
            correo,
            password
        ))

        cod_usuario = cursor.lastrowid

        cursor.execute("""
            INSERT INTO tsol_registro
            (
                cod_usuario,
                cod_estado
            )
            VALUES
            (
                %s,
                1
            )
        """, (cod_usuario,))

        conn.commit()

        return jsonify({
            "message":
                "Registro enviado correctamente. "
                "Espera la aprobación del administrador."
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()



        print("ERROR REGISTRO:", e)

        return jsonify({
            "success": False,
            "message": str(e)
            
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()
















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