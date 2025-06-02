import psutil

for nombre, stats in psutil.net_if_stats().items():
    if stats.isup and "wi" in nombre.lower():
        print(f"{stats.speed} Mbps")
        break
    
