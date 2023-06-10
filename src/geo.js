import { useState } from "react";
import "./App.css";
import "./Header.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      setLatitude("");
      setLongitude("");
      setError(null);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=1&language=en&format=json`);
      const data = await response.json();
      const { latitude, longitude } = extractLatLon(data);
      setLatitude(latitude);
      setLongitude(longitude);
      setError(null);
    } catch (error) {
      setError("Error fetching data.");
    }
    setIsSearching(false);
  };

  const extractLatLon = (data) => {
    const results = data.results;
    if (results.length > 0) {
      const firstResult = results[0];
      const latitude = firstResult.latitude;
      const longitude = firstResult.longitude;
      return { latitude, longitude };
    } else {
      return null;
    }
  };

  return (
    <div className="container">
      <div className="search-container">
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleSearch} disabled={isSearching}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="header">
        <h1 className="location">Bristol</h1>
        <h1 className="temperature">20°C</h1>
        <div className="details">
          <p className="min-temperature">Min: 12°C</p>
          <p className="max-temperature">Max: 20°C</p>
          <p className="precipitation">Precipitation: 60%</p>
          <p className="sunrise">Sunrise: 12:00</p>
          <p className="sunset">Sunset: 18:00</p>
        </div>
      </div>
      <div className="hourly">
        <h2>Daily Forecast</h2>
        <div className="daily">
          <h2>Day 1</h2>
          <p>Max: 25°C</p>
          <p>Min: 15°C</p>
          <p>Precipitation: 20%</p>
        </div>
        <div className="daily">
          <h2>Day 2</h2>
          <p>Max: 26°C</p>
          <p>Min: 16°C</p>
          <p>Precipitation: 25%</p>
        </div>
        <div className="daily">
          <h2>Day 3</h2>
          <p>Max: 27°C</p>
          <p>Min: 17°C</p>
          <p>Precipitation: 30%</p>
        </div>
        <div className="daily">
          <h2>Day 4</h2>
          <p>Max: 28°C</p>
          <p>Min: 18°C</p>
          <p>Precipitation: 35%</p> 
        </div>
        <div className="daily">
      <h2>Day 5</h2>
          <p>Max: 28°C</p>
          <p>Min: 18°C</p>
          <p>Precipitation: 35%</p> 
        </div>
    </div>
    </div>
  );
}

export default App;




import React, { useState } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleSearch = async () => {
    try {
      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
      const searchResponse = await fetch(searchUrl);
      const searchResult = await searchResponse.json();

      if (searchResult.results.length > 0) {
        const { latitude, longitude } = searchResult.results[0];
        setLatitude(latitude);
        setLongitude(longitude);

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&current_weather=true&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherResult = await weatherResponse.json();
        setWeatherData(weatherResult);
      } else {
        setLatitude(null);
        setLongitude(null);
        setWeatherData(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Enter a city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {latitude && longitude && (
        <div>
          Latitude: {latitude}, Longitude: {longitude}
        </div>
      )}

      {weatherData && (
        <div>
          <h2>Weather Data</h2>
          <p>Temperature: {weatherData.current_weather.temperature}°C</p>
          {/* Display other weather data properties as needed */}
        </div>
      )}
    </div>
  );
}

export default App;