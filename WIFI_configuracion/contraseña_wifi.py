import subprocess

def get_wifi_password_only():
    try:
        # Obtener el SSID actual
        current = subprocess.check_output("netsh wlan show interfaces", shell=True, text=True)
        ssid_line = [line for line in current.splitlines() if "SSID" in line and "BSSID" not in line]

        if not ssid_line:
            return "No conectado"
        ssid = ssid_line[0].split(":")[1].strip()

        # Obtener la contraseña
        profile = subprocess.check_output(f'netsh wlan show profile name="{ssid}" key=clear', shell=True, text=True)
        key_line = [line for line in profile.splitlines() if "Contenido de la clave" in line or "Key Content" in line]

        if key_line:
            return key_line[0].split(":")[1].strip()
        else:
            return "Sin Contraseña"

    except:
        return "Error"

print(get_wifi_password_only())
