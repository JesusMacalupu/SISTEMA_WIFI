import platform
import subprocess

def get_wifi_name():
    system = platform.system()
    try:
        if system == "Windows":
            result = subprocess.check_output(["netsh", "wlan", "show", "interfaces"], shell=True).decode('utf-8', errors="ignore")
            for line in result.split('\n'):
                if "SSID" in line and "BSSID" not in line:
                    return line.split(":")[1].strip()
        elif system == "Darwin":  # macOS
            cmd = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I"
            result = subprocess.check_output(cmd, shell=True).decode('utf-8')
            for line in result.split('\n'):
                if " SSID:" in line:
                    return line.split(":")[1].strip()
        elif system == "Linux":
            try:
                result = subprocess.check_output(["iwgetid", "-r"], stderr=subprocess.DEVNULL).decode('utf-8').strip()
                if result:
                    return result
            except:
                result = subprocess.check_output(["nmcli", "-t", "-f", "active,ssid", "dev", "wifi"], stderr=subprocess.DEVNULL).decode('utf-8')
                for line in result.split('\n'):
                    if "yes:" in line:
                        return line.split(":")[1].strip()
    except:
        return None
    return None

wifi_name = get_wifi_name()
if wifi_name:
    print(wifi_name)