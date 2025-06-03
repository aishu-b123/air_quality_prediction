import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const AQIChart = ({ aqiData }) => {
  if (!aqiData || !aqiData.pollutants) return <p>No AQI data available</p>;

  const pollutantLabels = [
    "PM1", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3",
    "NH3", "Benzene", "Toluene", "Xylene", "Lead"
  ];

  const pollutantData = aqiData.pollutants;

  const aqiChartData = {
    labels: ["Predicted AQI"],
    datasets: [
      {
        label: "AQI Level",
        data: [aqiData.aqi],
        backgroundColor: aqiData.aqi <= 50 ? "green" : aqiData.aqi <= 150 ? "orange" : "red",
      },
    ],
  };

  const pollutantBarData = {
    labels: pollutantLabels,
    datasets: [
      {
        label: "Pollutant Levels (µg/m³)",
        data: pollutantData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const pollutantPieData = {
    labels: pollutantLabels,
    datasets: [
      {
        label: "Pollutant Contribution",
        data: pollutantData,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#C9CBCF", "#36D6EB", "#FF6384", "#4BC0C0", "#FFCE56", "#9966FF",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>🌫️ Pollutant Levels</h2>
      <Bar data={pollutantBarData} />

      <h2>📊 Pollutant Contribution</h2>
      <Pie data={pollutantPieData} />
    </div>
  );
};

export default AQIChart;
