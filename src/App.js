/* eslint-disable max-statements */
/* eslint-disable max-depth */
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
  constructor(props) {
    super(props);
    console.log('construct');
    this.state = {
      latitude: 0,
      longitude: 0,
      geoLat: 0,
      geoLon: 0,
      inputed: '',
      weatherIcon: '',
      city: '',
      temperature: '',
      inputcity: false,
      isGeoposition: true
      // TTL: 60000
    };

    this.changeCity = this.changeCity.bind(this);
    this.checkCity = this.checkCity.bind(this);
    this.checkgeo = this.checkgeo.bind(this);
    this.inputBlur = this.inputBlur.bind(this);
    this.inputchange = this.inputchange.bind(this);
    this.sendReq = this.sendReq.bind(this);

    this.sendReq();
  }

checkgeo = () => {
  this.setState({ isGeoposition: true });
}

checkCity = () => {
  this.setState({ isGeoposition: false });
}

changeCity = () => {
  console.log('changeCity');
  this.setState({ inputcity: true });
}

inputchange = e => {
  console.log('inputchange', e.target.value);
  this.setState({
    inputed: e.target.value
  });
}

setCity = e => {
  console.log('setCity', e);
  e.preventDefault();
  console.log('setCity after', e);
  const { inputed } = this.state;

  this.setState({
    city: inputed, inputcity: false, isGeoposition: false
  });
  this.sendReq();
}

inputBlur = e => {
  console.log('inputblur');
  if (e.target.value === '') {
    this.setState({
      city: 'Выбор города', inputcity: false, inputed: ''
    });
    this.sendReq();
  }
}

sendReq() {
  console.log('sendReq', this.state);
  function getXmlHttp() {
    const xmlhttp = new XMLHttpRequest();

    return xmlhttp;
  }

  const req = getXmlHttp();
  // const getGeo = getXmlHttp();
  const { city, isGeoposition } = this.state;

  const DEG = 'c';
  let searchCity;
  const {
    geoLat, geoLon
  } = this.state;

  if (isGeoposition) {
    console.log('search of coords');
    searchCity = `(${geoLat},${geoLon})`;
  } else {
    console.log('search of city');
    searchCity = city;
  }

  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        console.log('get resp', req.responseText);
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

        console.log(forecast);
        if (forecast.query && forecast.query.count === 1) {
          const item = forecast.query.results.channel.item.condition;

          this.setState({ latitude: forecast.query.results.channel.item.lat, longitude: forecast.query.results.channel.item.long });
          this.setState({ weatherIcon: `/icons/${weatherIconMap[item.code]}.png` });

          // console.log(forecast);
          // const tmp = forecast.list['1'].main.temp;

          this.setState({ temperature: `${item.temp}°` });
          // const city = forecast.list['1'].name;

          document.getElementById('city').textContent = forecast.query.results.channel.location.city;
          this.forceUpdate();
        }
      }
    }
  };

  console.log(city, isGeoposition);
  if (isGeoposition || (!isGeoposition && (city !== 'Выбор города' && city !== ''))) {
    console.log('form request');
    const wsql = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${searchCity}") and u="${DEG}"`;
    // const wsql = `select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="(${lat},${lon})") and u="${DEG}"`;
    const weatherYQL = `https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(wsql)}&format=json&ttl=90`;
    // req.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&type=like&APPID=cda95ddeb17adb2fc338e7fe7c132ab2`, true);

    req.open('GET', weatherYQL);
    req.send();
  }
  // if (city && city !== 'Выбор города' && !isGeoposition) {
  //   console.log('send getgeo');
  //   getGeo.open('GET', `https://geocode-maps.yandex.ru/1.x/?apikey=45a0bdda-2e24-4138-95db-b4738ddcc752&geocode=${city}&format=json`, true);
  //   getGeo.send();
  // }

  // getGeo.onreadystatechange = () => {
  //   if (getGeo.readyState === 4) {
  //     if (getGeo.status === 200) {
  //       console.log('getGeo');
  //       const JSONstr = getGeo.responseText;
  //       const forecast = JSON.parse(JSONstr);


  //       const coords = (forecast.response.GeoObjectCollection.featureMember['0'].GeoObject.Point.pos).split(' ');

  //       this.setState({
  //         latitude: coords[1],
  //         longitude: coords[0]
  //       });
  //       // this.setState({ weatherIcon: `/icons/${weatherIconMap[item.code]}.png` });

  //       this.forceUpdate();
  //     }
  //   }
  // };
}

change(e) {
  const val = e.target.value;

  if (val === 'geo') {
    console.log('set geo false');
    this.setState({ isGeoposition: false });
  } else {
    console.log('set geo true');
    this.setState({ isGeoposition: true });
  }
  this.sendReq();
}

render() {
  console.log('render', this.state);

  const { city } = this.state;

  navigator.geolocation.getCurrentPosition(position => {
    console.log('get coord');
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    this.setState({ geoLat: lat, geoLon: lon });
  });
  const {
    latitude, longitude, geoLat, geoLon, isGeoposition
  } = this.state;

  console.log(latitude, longitude, geoLat, geoLon, isGeoposition);

  let lat; let
    lon;

  if (!isGeoposition) {
    lat = geoLat;
    lon = geoLon;
  } else {
    lat = latitude;
    lon = longitude;
  }
  console.log(lat, lon);

  const mapState = {
    controls: ['default']
  };

  const {
    temperature,
    weatherIcon,
    inputed,
    inputcity
  } = this.state;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="button" name="top" value="get" onClick={this.sendReq.bind(this)} />
        <div id="filters">
          <label onClick={this.checkgeo}>
            <input type="radio" name="dzen" onChange={this.change.bind(this)} value="geo" defaultChecked="true" />

          Геопозиция&nbsp;&nbsp;
          </label>
          <label onClick={this.checkCity}>
            <input type="radio" name="dzen" onChange={this.change.bind(this)} value="gorod" />
            <a hidden={inputcity} id="cityOutput" onClick={this.changeCity}>Выбор города</a>
            <a hidden={inputcity} id="cityOutput" onClick={this.changeCity}>{city}</a>
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
        <Map className="map" width="300px" height="300px" state={mapState} center={[lat, lon]} zoom={10} lang="en_US">
          <Marker lat={parseFloat(lat, 6)} lon={parseFloat(lon, 6)}>
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
