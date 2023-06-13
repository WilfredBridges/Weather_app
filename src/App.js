import React, { useState } from 'react';
import './App.css';
import './Header.css';

function App() {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [firstName, setFirstName] = useState('');

  const handleSearch = async () => {
    try {
      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
      const searchResponse = await fetch(searchUrl);
      const searchResult = await searchResponse.json();

      if (searchResult.results.length > 0) {
        const { latitude, longitude, name } = searchResult.results[0];
        setLatitude(latitude);
        setLongitude(longitude);
        setFirstName(name);

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&current_weather=true&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherResult = await weatherResponse.json();
        setWeatherData(weatherResult);
      } else {
        setLatitude(null);
        setLongitude(null);
        setWeatherData(null);
        setFirstName('');
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
          <h2>{firstName}</h2>
          <p>Temperature: {weatherData.current_weather.temperature}°C</p>
          <p>Max: {weatherData.daily.temperature_2m_max[0]}°C</p>
          <p>Min: {weatherData.daily.temperature_2m_min[0]}°C</p>

          {/* Display other weather data properties as needed */}

          <h3>Next 5 Days</h3>
          <ul>
            {weatherData.daily.temperature_2m_max.slice(1, 6).map((maxTemp, index) => (
              <li key={index}>
                Day {index + 1}: Max Temp: {maxTemp}°C, Min Temp: {weatherData.daily.temperature_2m_min[index + 1]}°C, Precipitation: {weatherData.daily.precipitation_sum[index + 1]} mm
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;











