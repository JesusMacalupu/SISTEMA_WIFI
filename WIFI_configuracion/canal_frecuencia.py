import subprocess
import re

def obtener_canal_frecuencia():
    try:
        # Forzar salida en UTF-8
        resultado = subprocess.check_output(
            'chcp 65001 >nul && netsh wlan show interfaces',
            shell=True, text=True, encoding='utf-8', errors='ignore'
        )

        # Buscar línea de canal
        canal_match = re.search(r'Canal\s*:\s*(\d+)', resultado)
        if canal_match:
            canal = int(canal_match.group(1))

            # Determinar frecuencia según canal
            if 1 <= canal <= 14:
                frecuencia = '2.4GHz'
            elif 36 <= canal <= 165:
                frecuencia = '5GHz'
            elif 1 <= canal <= 233:  # 6GHz rango típico
                frecuencia = '6GHz'
            else:
                frecuencia = 'Desconocida'

            return f"Canal {canal} / {frecuencia}"
        else:
            return "No se encontró el canal. ¿Estás conectado por Wi-Fi?"

    except subprocess.CalledProcessError as e:
        return f"Error al ejecutar el comando: {e}"
    except Exception as e:
        return f"Error inesperado: {e}"

# Ejecutar
print(obtener_canal_frecuencia())
