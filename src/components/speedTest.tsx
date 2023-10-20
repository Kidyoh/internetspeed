import { Component } from 'react';
import axios from 'axios';
import './speedtest.css';
import Speedometer from "react-d3-speedometer";

class SpeedTestComponent extends Component {
  state = {
    downloadSpeed: null as number | null,
    uploadSpeed: null as number | null,
    isTesting: false,
    displayDownloadSpeed: null as number | null,
    displayUploadSpeed: null as number | null,
    ipAddress: '',
    isp: '',
    country: '',
    lat: '',
    lon: '',
    isDarkMode: false
  };



  componentDidMount() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      this.setState({ isDarkMode: true });
    }
  }

  toggleDarkMode = () => {
    const { isDarkMode } = this.state;
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      this.setState({ isDarkMode: false });
    } else {
      document.body.classList.add('dark-mode');
      this.setState({ isDarkMode: true });
    }
  };

  runSpeedTest = () => {
    this.setState({ isTesting: true });

    axios
      .get('http://127.0.0.1:5000/speedtest')
      .then((response) => {
        const { downloadSpeed, uploadSpeed, ipAddress, isp, country, lat, lon } = response.data;
        this.setState({
          downloadSpeed,
          uploadSpeed,
          ipAddress,
          isTesting: false,
          isp,
          country,
          lat,
          lon
        });

        this.animateSpeeds(downloadSpeed, uploadSpeed);
      })
      .catch((error) => {
        console.error('Error fetching data from Flask API:', error);
        this.setState({ isTesting: false });
      });
  };
  animateSpeeds = (downloadSpeed: number | null, uploadSpeed: number | null) => {
    let downloadCounter = 0;
    let uploadCounter = 0;

    const downloadTarget = downloadSpeed || 0;
    const uploadTarget = uploadSpeed || 0;

    const downloadInterval = setInterval(() => {
      if (downloadCounter < downloadTarget) {
        downloadCounter += 0.1;
        this.setState({ displayDownloadSpeed: downloadCounter });
      } else {
        clearInterval(downloadInterval);
        this.setState({ displayDownloadSpeed: downloadTarget });
      }
    }, 100);

    const uploadInterval = setInterval(() => {
      if (uploadCounter < uploadTarget) {
        uploadCounter += 0.1;
        this.setState({ displayUploadSpeed: uploadCounter });
      } else {
        clearInterval(uploadInterval);
        this.setState({ displayUploadSpeed: uploadTarget });
      }
    }, 100);
  };

  render() {
    const { displayDownloadSpeed, displayUploadSpeed, isTesting, ipAddress, isp, country, lat, lon, isDarkMode } = this.state;
    const formattedDownloadSpeed = displayDownloadSpeed ? displayDownloadSpeed.toFixed(2) : 0;
    const formattedUploadSpeed = displayUploadSpeed ? displayUploadSpeed.toFixed(2) : 0;
    const bitsPerSecondDownloadSpeed = displayDownloadSpeed ? (displayDownloadSpeed * 8).toFixed(2) : 'N/A';
    const bitsPerSecondUploadSpeed = displayUploadSpeed ? (displayUploadSpeed * 8).toFixed(2) : 'N/A';
    const kilobitsPerSecondDownloadSpeed = displayDownloadSpeed ? (displayDownloadSpeed * 1024).toFixed(2) : 'N/A';
    const kilobitsPerSecondUploadSpeed = displayUploadSpeed ? (displayUploadSpeed * 1024).toFixed(2) : 'N/A';
    return (
      <div className={`speed-test-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <h1>Speed Test Results</h1>
        {isTesting ? (
          <div className="loading-container">
            <div className="loading"></div>
            <p>Testing...</p>
          </div>
        ) : (
          <div>
            <div style={{height: '200px'}}>
            <Speedometer
              value={displayDownloadSpeed || 0}
              needleColor="red"
              startColor="green"
              endColor="red"
              segments={10}
              maxValue={100}
            />
            </div>
            <p>
              Download Speed: {formattedDownloadSpeed} Mbps ({bitsPerSecondDownloadSpeed} bps, {kilobitsPerSecondDownloadSpeed} kbps)
            </p>
            <div style={{ height: '200px' }}>
            <Speedometer
              value={displayUploadSpeed || 0}
              needleColor="blue"
              startColor="green"
              endColor="blue"
              segments={10}
              maxValue={100}
            />
            </div>
            <p>
              Upload Speed: {formattedUploadSpeed} Mbps ({bitsPerSecondUploadSpeed} bps, {kilobitsPerSecondUploadSpeed} kbps)
            </p>
            <p>
              IP Address: {ipAddress}
            </p>
            <p>
              Internet Service Provider: {isp}
            </p>
            <p>
              Country: {country}
            </p>
            <p>
              Latitude: {lat}
            </p>
            <p>
              Longitude: {lon}
            </p>
          </div>
        )}
        <button onClick={this.runSpeedTest} disabled={isTesting}>
          {isTesting ? 'Testing...' : 'Run Speed Test'}
        </button>
      </div>
    );
  }
}

export default SpeedTestComponent;