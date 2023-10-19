from flask import Flask, jsonify, request
import speedtest
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

@app.route('/speedtest')
def perform_speed_test():
    st = speedtest.Speedtest()
    servers = st.get_best_server()

    print("Testing download speed...")
    download_speed = st.download() / 1000000  # Convert to Mbps
    print("Testing upload speed...")
    upload_speed = st.upload() / 1000000  # Convert to Mbps
    print(st.results.client)

    ip_address = st.results.client['ip']
    isp = st.results.client['isp']
    country = st.results.client['country']
    lat = st.results.client['lat']
    lon = st.results.client['lon']


    return jsonify({
        'downloadSpeed': download_speed,
        'uploadSpeed': upload_speed,
        'ipAddress': ip_address,
        'isp': isp,
        'country': country,
        'lat': lat,
        'lon': lon
    })

if __name__ == '__main__':
    app.run()