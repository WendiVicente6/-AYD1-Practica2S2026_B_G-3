from config.db import get_connection

try:
    conexion = get_connection()

    print("=================================")
    print("CONEXIÓN EXITOSA")
    print("=================================")

    cursor = conexion.cursor()
    cursor.execute("SELECT DATABASE()")

    resultado = cursor.fetchone()

    print("Base de datos:", resultado[0])

    cursor.close()
    conexion.close()

except Exception as error:
    print("=================================")
    print("ERROR DE CONEXIÓN")
    print("=================================")
    print(error)