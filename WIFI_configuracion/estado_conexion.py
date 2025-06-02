import platform
import subprocess

def verificar_conexion_wifi():
    sistema = platform.system()
    
    try:
        if sistema == "Windows":
            resultado = subprocess.check_output(["netsh", "wlan", "show", "interfaces"], shell=True).decode('utf-8', errors="ignore")
            return "Conectado" if "Estado" in resultado and "conectado" in resultado.lower() else "Desconectado"
    
        elif sistema == "Linux":
            try:
                # Intenta con 'iwgetid' (requiere 'wireless-tools')
                subprocess.check_output(["iwgetid"], stderr=subprocess.DEVNULL)
                return "Conectado"
            except:
                # Si falla, usa 'nmcli' (alternativa moderna)
                resultado = subprocess.check_output(["nmcli", "-t", "-f", "active", "dev", "wifi"], stderr=subprocess.DEVNULL).decode('utf-8')
                return "Conectado" if "yes" in resultado else "Desconectado"
        
        elif sistema == "Darwin":  # macOS
            resultado = subprocess.check_output(["/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport", "-I"], stderr=subprocess.DEVNULL).decode('utf-8')
            return "Conectado" if "SSID:" in resultado else "Desconectado"
    
    except:
        return "Desconectado"  # Si hay error, asumimos desconexión

# Ejecutar y mostrar resultado
print(verificar_conexion_wifi())