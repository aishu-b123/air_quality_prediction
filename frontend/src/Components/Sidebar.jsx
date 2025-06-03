import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ fetchAQI, aqiData }) => {
  const [city, setCity] = useState("");
  const [pollutants, setPollutants] = useState({
    pm25: "",
    pm10: "",
    co: "",
    no2: "",
    so2: "",
    o3: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setPollutants({ ...pollutants, [e.target.name]: e.target.value });
  };

  // Fetch AQI and navigate to results
  const handleSubmit = async () => {
    if (!city.trim()) {
      alert("⚠️ Please enter a city!");
      return;
    }

    setLoading(true);

    try {
      const result = await fetchAQI(city, pollutants);
      if (result) {
        navigate("/results"); // ✅ Navigate to results page after getting data
      }
    } catch (error) {
      console.error("🚨 Error fetching AQI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar">
      <h2>🌍 Enter AQI Data</h2>

      {/* City Input */}
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <h3>Pollutant Levels (µg/m³)</h3>

      {/* Pollutant Inputs */}
      {Object.keys(pollutants).map((key) => (
        <input
          key={key}
          type="number"
          name={key}
          placeholder={key.toUpperCase()}
          value={pollutants[key]}
          onChange={handleChange}
        />
      ))}

      {/* Predict AQI Button */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Predicting..." : "Predict AQI"}
      </button>

      {/* AQI Result */}
      {/*aqiData && (
        <div className="aqi-result">
          <h3>Predicted AQI: <span>{aqiData.aqi}</span></h3>
          <p><strong>City:</strong> {aqiData.city}</p>
        </div>
      )*/}
    </div>
  );
};

export default Sidebar;
