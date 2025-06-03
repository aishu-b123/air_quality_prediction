import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaGlobe } from "react-icons/fa";
import "./Results.css";


ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

// Color-coded based on pollutant level
const getColor = (value) => {
  if (value < 50) return "#A8E6CF";     // Light green
  if (value < 100) return "#FFD3B6";    // Light orange
  if (value < 150) return "#FF8B94";    // Light red
  return "#D32F2F";                     // Dark red
};

// Suggestions based on AQI range
const getImportantSuggestions = (aqi) => {
  if (aqi <= 50) return ["Air quality is good.", "No precautions needed."];
  if (aqi <= 100)
    return ["Sensitive groups should limit outdoor exertion.", "Close windows at night."];
  if (aqi <= 150)
    return ["Avoid prolonged outdoor activity.", "Wear a mask if needed."];
  return [
    "Stay indoors as much as possible.",
    "Use air purifiers if available.",
    "Avoid physical exertion outdoors.",
  ];
};

const pollutantLabels = [
  "PM1", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3",
  "NH3", "Benzene", "Toluene", "Xylene", "Lead"
];

const Results = ({ aqiData, location }) => {
  const navigate = useNavigate();
  const aqi = aqiData?.aqi || 0;
  const importantSuggestions = getImportantSuggestions(aqi);

  const aqiChartData = {
    labels: ["Predicted AQI"],
    datasets: [
      {
        label: "AQI Level",
        data: [aqi],
        backgroundColor: aqi <= 50 ? "green" : aqi <= 150 ? "orange" : "red",
      },
    ],
  };

  const pieData = {
    labels: pollutantLabels,
    datasets: [
      {
        label: "Pollutant Contribution",
        data: aqiData?.pollutants || [],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#C9CBCF", "#36D6EB", "#FF6384", "#4BC0C0", "#FFCE56", "#9966FF"
        ],
        borderWidth: 1,
      },
    ],
  };

  const staticbar = {
    labels: [
      'Good',
      'Satisfactory',
      'Moderate',
      'Poor',
      'Very Poor',
      'Severe'
    ],
    datasets: [
      {
        label: 'AQI Range',
        data: [50, 100, 150, 200, 300, 500],
        backgroundColor: ['green', 'yellow', 'orange', 'red', 'purple', 'black']
      }
    ]
  };
  return (
    <div className="results-wrapper">
      <div className="results-main">
        {/* Left Card */}
        <div className="aqi-card">
          <FaGlobe className="globe-icon" />
          <h2>{location?.city || "Unknown City"}</h2>
          <div className="aqi-suggestion">
            <div className="aqi-score">{aqi}</div>
            <div className="suggestion">
            <Button
            variant="contained"
            className="view-more-btn"
            onClick={() => navigate("/Suggestions",{ state: { aqi } })}
            >
            Suggestions
            </Button>
            </div>
          </div>
          <p className="aqi-status">
            {aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Unhealthy for Sensitive Groups" : "High Pollution"}
          </p>

          <div className="pollutant-grid">
            {aqiData?.pollutants?.map((value, idx) => (
              <div
                key={idx}
                className="pollutant-box"
                style={{ backgroundColor: getColor(value) }}
              >
                <p className="pollutant-name">{pollutantLabels[idx]}</p>
                <p className="pollutant-value">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Bar */}
          <div className="aqi-bar-container">
            <h2>🌡️ Predicted AQI</h2>
            <Bar data={aqiChartData} />
          </div>
      </div>
      <div className="info">
      <Button
        variant="contained"
        className="info-btn"
        onClick={() => navigate("/PollutantInfo")}
      >
            Info about pollutants
        </Button>
      </div>

      {/* Lower Section */}
      <div className="results-lower">
        {/* Pie Chart */}
        <div className="pie-chart-card">
          <h3>📊 Pollutant Contribution</h3>
          {aqiData?.pollutants ? (
            <Pie data={pieData} />
          ) : (
            <p>No pollutant data available</p>
          )}
        </div>

        {/* Suggestions */}
        {/* <div className="suggestions-res">
          <h3>💡 Suggestions</h3>
          <ul>
            {importantSuggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div> */}
        <div>
          {/* <Bar data={staticbar} /> */}
          <img className="aqi-image" src="/images/aqi-image.jpg" alt="Description" />
        </div>
      </div>

    </div>
  );
};

export default Results;



