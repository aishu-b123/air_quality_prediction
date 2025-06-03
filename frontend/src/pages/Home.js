import React from "react";
import Sidebar from "../Components/Sidebar";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="content">
        <h1>Welcome to AQI Monitoring</h1>
        <p>Enter a city to get real-time AQI and predictions.</p>
      </div>
    </div>
  );
};

export default Home;
