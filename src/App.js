import React, { Component } from 'react';
import { Map, Marker, MarkerLayout } from 'yandex-map-react';
import logo from './TCSlogo.svg';
import './App.css';


class App extends Component {
state = { latitude: 0, longitude: 0, temperature: null };

render() {
  function getXmlHttp() {
    const xmlhttp = new XMLHttpRequest();

    return xmlhttp;
  }

  const req = getXmlHttp();

  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        const JSONstr = req.responseText;
        const A = JSON.parse(JSONstr);

        console.log(A);
        const tmp = A.list['1'].main.temp;

        this.setState({ temperature: tmp });
        const city = A.list['1'].name;

        document.getElementById('city').textContent = city;
      }
    }
  };

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    this.setState({ latitude: lat, longitude: lon });

    req.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&type=like&APPID=cda95ddeb17adb2fc338e7fe7c132ab2`, true);
    req.send();
  });
  // req.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+weather.forecast+where+woeid+in+(select+woeid+from+geo.places(1)+where+text%3D%27Novosibirsk+Russia%27)+AND+u%3D%27c%27&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json', true);

  const mapState = {
    controls: ['default']
  };

  const { latitude } = this.state;
  const { longitude } = this.state;
  const { temperature } = this.state;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div id="gradus">
          {(temperature - 273.15).toFixed()}
            °
        </div>
        <div id="city" />
        <div id="lati" />
        <Map className="map" width="300px" height="300px" state={mapState} center={[latitude, longitude]} zoom={10}>
          <Marker lat={latitude} lon={longitude}>
            <MarkerLayout>
              <div style={{
                borderRadius: '5%',
                background: '#282c34',
                shadow: '13px',
                color: '#fff'
              }}
              >
                <img src="https://img-android.lisisoft.com/imgmic/9/0/2909-i-info.spychalski.winguweather.jpg" width="16px" alt="none" />
                <b>
                  {(temperature - 273.15).toFixed()}
                    °
                </b>
              </div>
            </MarkerLayout>
          </Marker>
        </Map>
      </header>
    </div>
  );
}
}

export default App;
