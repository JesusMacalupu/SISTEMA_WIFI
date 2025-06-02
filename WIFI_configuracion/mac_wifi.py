import platform
import subprocess
import re

def obtener_mac_wifi():
    sistema = platform.system()

    if sistema == "Windows":
        resultado = subprocess.run(['netsh', 'wlan', 'show', 'interfaces'], capture_output=True, text=True)
        match = re.search(r'BSSID\s+:\s+([0-9a-fA-F:-]{17})', resultado.stdout)
        if match:
            return match.group(1)

    elif sistema == "Linux":
        resultado = subprocess.run(['iw', 'dev'], capture_output=True, text=True)
        match_iface = re.search(r'Interface\s+(\w+)', resultado.stdout)
        if not match_iface:
            return None
        interfaz = match_iface.group(1)

        resultado = subprocess.run(['iw', 'dev', interfaz, 'link'], capture_output=True, text=True)
        match_mac = re.search(r'Connected to ([0-9a-fA-F:]{17})', resultado.stdout)
        if match_mac:
            return match_mac.group(1)

    elif sistema == "Darwin":  # macOS
        comando = ['/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport', '-I']
        resultado = subprocess.run(comando, capture_output=True, text=True)
        match = re.search(r'BSSID: ([0-9a-fA-F:]{17})', resultado.stdout)
        if match:
            return match.group(1)

    return None

mac = obtener_mac_wifi()
if mac:
    print(mac)
else:
    print("No se pudo obtener la MAC del AP WiFi.")
