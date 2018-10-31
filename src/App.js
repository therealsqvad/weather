import React, { Component } from 'react';
import logo from './TCSlogo.svg';
import './App.css';

class App extends Component {
  render() {
    function getXmlHttp() {
      const xmlhttp = new XMLHttpRequest();

      return xmlhttp;
    }

    const req = getXmlHttp();

    req.onreadystatechange = function() {
      if (req.readyState === 4) {
        if (req.status === 200) {
          const JSONstr = req.responseText;
          const A = JSON.parse(JSONstr);

          console.log(A);
          const temperature = A.list['0'].main.temp;

          document.getElementById('gradus').textContent = `${(temperature - 273.15).toFixed()}°`;
          const city = A.list['0'].name;

          document.getElementById('city').textContent = city;
        }
      }
    };

    let lat;
    let lon;

    navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;

      req.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&type=like&APPID=cda95ddeb17adb2fc338e7fe7c132ab2`, true);
      req.send();
    });
    // req.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+weather.forecast+where+woeid+in+(select+woeid+from+geo.places(1)+where+text%3D%27Novosibirsk+Russia%27)+AND+u%3D%27c%27&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json', true);


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div id="gradus" />
          <div id="city" />
          <div id="YMapsID" width="450px" height="350px" />
        </header>
      </div>
    );
  }
}

export default App;
