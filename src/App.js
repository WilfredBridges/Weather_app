import React, { useState } from 'react';
import './App.css';
import './Header.css';

function App() {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null); // Added error state

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

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
        setError(null); // Reset error state if successful
      } else {
        setLatitude(null);
        setLongitude(null);
        setWeatherData(null);
        setError('No results found.'); // Set error message
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.'); // Set error message
    }
  };

  return (
    <div className="container">
      <div className="search-container">
        <input type="text" placeholder="Enter a location" onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button> {/* Removed disabled attribute */}
      </div>
      {error && <p className="error">{error}</p>}
      {weatherData && weatherData.current && ( // Added conditional check for weatherData.current
        <>
          <div className="header">
            <h1 className="location">{weatherData.location}</h1>
            <h1 className="temperature">{weatherData.current.temperature}°C</h1>
            <div className="details">
              <p className="min-temperature">Min: {weatherData.current.minTemperature}°C</p>
              <p className="max-temperature">Max: {weatherData.current.maxTemperature}°C</p>
              <p className="precipitation">Precipitation: {weatherData.current.precipitation}%</p>
              <p className="sunrise">Sunrise: {new Date(weatherData.current.sunrise * 1000).toLocaleTimeString()}</p>
              <p className="sunset">Sunset: {new Date(weatherData.current.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="hourly">
            <h2>Hourly Forecast</h2>
            <div className="hourly-list">
              {weatherData.hourly.time.map((time, index) => (
                <div key={index} className="hourly-item">
                  <p>{new Date(time * 1000).toLocaleTimeString()}</p>
                  <p>{weatherData.hourly.temperature_2m[index]}°C</p>
                </div>
              ))}
            </div>
          </div>
          <div className="daily">
            <h2>Daily Forecast</h2>
            <div className="daily-list">
              {weatherData.daily.time.map((time, index) => (
                <div key={index} className="daily-item">
                  <p>{new Date(time * 1000).toLocaleDateString()}</p>
                  <p>Max: {weatherData.daily.temperature_2m_max[index]}°C</p>
                  <p>Min: {weatherData.daily.temperature_2m_min[index]}°C</p>
                  <p>Precipitation: {weatherData.daily.precipitation_sum[index]}%</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;









