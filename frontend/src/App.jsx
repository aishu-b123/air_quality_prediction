

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Navbar from "./Components/Navbar.jsx";
import Suggestions from "./Components/Suggestions.jsx";
import Reports from "./Components/Reports.jsx";
// import Sidebar from "./Components/Sidebar.jsx";
import ResultsPage from "./Components/Results.jsx";
import PollutantInfo from "./Components/PollutantInfo.jsx";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const App = () => {
  const [aqiData, setAqiData] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchAQI = async (city, pollutants = null) => {
    if (!city) {
      console.warn("❌ No city provided!");
      return;
    }

    try {
      console.log(`🌍 Fetching AQI for: ${city} ${pollutants ? "(Manual Input)" : "(From API)"}`);

      const requestBody = pollutants ? { city, pollutants } : { city }; // Ensure pollutants are sent as an array
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Received AQI data:", data);

      if (!data || data.aqi === undefined) {
        console.error("❌ Invalid AQI data received.");
        return;
      }

      setAqiData(data); // ✅ Store AQI data globally
      setLocation({ lat: data.lat, lon: data.lon, city: data.city }); // ✅ Store location
    } catch (error) {
      console.error("🚨 Error fetching AQI data:", error);
    }
  };

  return (
    <Router>
      <div className="app-container">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home fetchAQI={fetchAQI} aqiData={aqiData} location={location} />} />
          <Route path="/results" element={<ResultsPage aqiData={aqiData} location={location} />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/suggestions" element={<Suggestions aqiData={aqiData}/>} />
          <Route path="/PollutantInfo" element={<PollutantInfo />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
