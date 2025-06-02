import subprocess

def get_wifi_protocol_windows():
    protocol_map = {
        "802.11n": "Wi-Fi 4",
        "802.11ac": "Wi-Fi 5",
        "802.11ax": "Wi-Fi 6"
    }

    result = subprocess.run(["netsh", "wlan", "show", "interfaces"], capture_output=True, text=True)
    for line in result.stdout.splitlines():
        if "Tipo de radio" in line or "Radio type" in line:
            protocol = line.split(":")[-1].strip()
            wifi_version = protocol_map.get(protocol, "Protocolo desconocido")
            print(f"{protocol} ({wifi_version})")
            return

    print("No se pudo detectar el protocolo Wi-Fi.")

get_wifi_protocol_windows()
