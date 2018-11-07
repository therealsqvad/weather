/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { Map, Marker, MarkerLayout } from 'yandex-map-react';
import logo from './TCSlogo.svg';
import './App.css';


class App extends Component {
    state = {
      latitude: 0,
      longitude: 0,
      city: 'Выбор города',
      temperature: null,
      inputcity: false,
      isGeoposition: true,
      TTL: 60000
    };


checkgeo = () => {
  this.setState({ isGeoposition: true });
}

checkCity = () => {
  this.setState({ isGeoposition: false });
}

changeCity = () => {
  this.setState({ inputcity: true });
}

inputchange = e => {
  this.setState({
    inputed: e.target.value
  });
}

setCity = e => {
  e.preventDefault();
  const { inputed } = this.state;

  this.setState({
    city: inputed, inputcity: false
  });
}

inputBlur = e => {
  if (e.target.value === '') {
    this.setState({
      city: 'Выбор города', isGeoposition: true, inputcity: false, inputed: ''
    });
  }
}

render() {
  function getXmlHttp() {
    const xmlhttp = new XMLHttpRequest();

    return xmlhttp;
  }

  const req = getXmlHttp();
  const getGeo = getXmlHttp();

  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        const { city, isGeoposition } = this.state;

        if (!city || isGeoposition) {
          this.setState({ city: 'Выбор города' });
        }
        // console.log(req.responseText);
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

        // console.log(forecast);
        // const tmp = forecast.list['1'].main.temp;

        this.setState({ temperature: `${item.temp}°` });
        // const city = forecast.list['1'].name;

        document.getElementById('city').textContent = forecast.query.results.channel.location.city;
      }
    }
  };

  // const { TTL } = this.state;

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // console.log('lat', lat, 'lon', lon);
    // const yanKey = '45a0bdda-2e24-4138-95db-b4738ddcc752';

    this.setState({ latitude: lat, longitude: lon });
    const DEG = 'c';
    let searchCity;
    const { isGeoposition, city } = this.state;

    if (isGeoposition) {
      searchCity = `(${lat},${lon})`;
    } else {
      searchCity = city;
    }
    const wsql = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${searchCity}") and u="${DEG}"`;
    // const wsql = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="(${lat},${lon})") and u="${DEG}"`;
    const weatherYQL = `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(wsql)}&format=json&ttl=90`;
    // req.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&type=like&APPID=cda95ddeb17adb2fc338e7fe7c132ab2`, true);

    req.open('GET', weatherYQL, true);
    req.send();
  });

  // req.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+weather.forecast+where+woeid+in+(select+woeid+from+geo.places(1)+where+text%3D%27Novosibirsk+Russia%27)+AND+u%3D%27c%27&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json', true);

  const mapState = {
    controls: ['default']
  };

  const { latitude, longitude, city } = this.state;
  const { temperature } = this.state;
  const { weatherIcon } = this.state;
  const {
    inputed, inputcity, isGeoposition
  } = this.state;


  if (city && city !== 'Выбор города' && !isGeoposition) {
    getGeo.open('GET', `https://geocode-maps.yandex.ru/1.x/?apikey=45a0bdda-2e24-4138-95db-b4738ddcc752&geocode=${city}&format=json`, true);
    getGeo.send();
  }

  getGeo.onreadystatechange = () => {
    if (getGeo.readyState === 4) {
      if (getGeo.status === 200) {
        const JSONstr = getGeo.responseText;
        const forecast = JSON.parse(JSONstr);


        const coords = (forecast.response.GeoObjectCollection.featureMember['0'].GeoObject.Point.pos).split(' ');

        this.setState({
          latitude: coords[1],
          longitude: coords[0]
        });
        // this.setState({ weatherIcon: `/icons/${weatherIconMap[item.code]}.png` });
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div id="filters">
          <label onClick={this.checkgeo}>
            <input name="dzen" type="radio" value="geo" checked={isGeoposition} />

          Геопозиция&nbsp;&nbsp;
          </label>
          <label onClick={this.checkCity}>
            <input name="dzen" type="radio" value="gorod" checked={!isGeoposition} />
            <a href="#" hidden={inputcity} id="cityOutput" onClick={this.changeCity}>{city}</a>
            <form
              onSubmit={this.setCity}
              hidden={!inputcity}
              style={{
                float: 'right'
              }}
            >
              <input
                type="text"
                id="inputtext"
                maxLength="60"
                value={inputed}
                onChange={this.inputchange}
                onBlur={this.inputBlur}
              />
              <button id="add">✔</button>
            </form>

          </label>
        </div>
        <div id="gradus">
          {temperature}
        </div>
        <div id="city" />
        <div id="lati" />
        <Map className="map" width="300px" height="300px" state={mapState} center={[latitude, longitude]} zoom={10} lang="en_US">
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
