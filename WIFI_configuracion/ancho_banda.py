import speedtest

st = speedtest.Speedtest()
download = st.download()

print(f"{download / 1_000_000:.2f} Mbps") 

