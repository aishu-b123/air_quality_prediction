import React, { useState } from "react";
import AQIChart from "../Components/AQIChart";
import Map from "../components/Map";
import "./Predict.css";

const Predict = () => {
  const [aqiData, setAqiData] = useState(null);
  const fetchAQI = async (city) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      const data = await response.json();
      setAqiData(data);
    } catch (error) {
      console.error("Error fetching AQI data", error);
    }
  };

  return (
    <div className="predict-container">
      <h1>🌍 Predict AQI</h1>
      <input type="text" placeholder="Enter City" onBlur={(e) => fetchAQI(e.target.value)} />
      {aqiData && (
        <>
          <AQIChart aqiData={aqiData} />
          <Map location={aqiData} />
        </>
      )}
    </div>
  );
};

export default Predict;
