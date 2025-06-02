import socket

def get_wifi_ip():
    try:
        # Crea un socket para conectarse a un servidor externo
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()
        return ip_address
    except Exception as e:
        return f"No se pudo obtener la IP: {e}"

print(get_wifi_ip())