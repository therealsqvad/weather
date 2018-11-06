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
        const weatherIconMap = [
          'storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail',
          'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow',
          'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake',
          'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun',
          'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain',
          'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'
        ];

        const JSONstr = req.responseText;
        const forecast = JSON.parse(JSONstr);
        const item = forecast.query.results.channel.item.condition;

        this.setState({ weatherIcon: `/icons/${weatherIconMap[item.code]}.png` });

        console.log(forecast);
        // const tmp = forecast.list['1'].main.temp;

        this.setState({ temperature: item.temp });
        // const city = forecast.list['1'].name;

        document.getElementById('city').textContent = forecast.query.results.channel.location.city;
      }
    }
  };

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    this.setState({ latitude: lat, longitude: lon });
    const DEG = 'c';
    const wsql = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="(${lat},${lon})") and u="${DEG}"`;
    const weatherYQL = `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(wsql)}&format=json&ttl=90`;
    // req.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&type=like&APPID=cda95ddeb17adb2fc338e7fe7c132ab2`, true);

    req.open('GET', weatherYQL);
    req.send();
  });
  // req.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+weather.forecast+where+woeid+in+(select+woeid+from+geo.places(1)+where+text%3D%27Novosibirsk+Russia%27)+AND+u%3D%27c%27&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json', true);

  const mapState = {
    controls: ['default']
  };

  const { latitude } = this.state;
  const { longitude } = this.state;
  const { temperature } = this.state;
  const { weatherIcon } = this.state;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div id="gradus">
          {temperature}
            °
        </div>
        <div id="city" />
        <div id="lati" />
        <Map className="map" width="300px" height="300px" state={mapState} center={[latitude, longitude]} zoom={10}>
          <Marker lat={latitude} lon={longitude}>
            <MarkerLayout>
              <div style={{
                borderRadius: '8px',
                background: 'rgba(40, 44, 52, 0.3)',
                shadow: '13px',
                color: '#fff'
              }}
              >
                <img src={weatherIcon} width="40px" alt="none" id="weatherIcon" />
                <span className="temperatura">
                  <b>
                    {temperature}
                    °
                  </b>
                </span>
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
