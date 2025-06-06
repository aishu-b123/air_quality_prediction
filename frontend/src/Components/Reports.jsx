import { useState } from 'react';
import './Reports.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, BarChart, Bar,AreaChart, Area
} from 'recharts';
import { Cell } from 'recharts';
import axios from 'axios';

const Reports = () => {
  const [city, setCity] = useState('');
  const [reportData, setReportData] = useState(null);

  const fetchReports = async () => {
    try {
      console.log("🔍 Fetching reports for:", city);
      const response = await axios.get(`https://air-quality-prediction-0k3d.onrender.com/api/reports/${city}`);
      console.log("📦 Data received:", response.data);
      setReportData(response.data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  const getBarColor = (value) => {
    if (value < 30) return "green";
    if (value < 80) return "orange";
    return "red";
  };

  const renderBarChart = (data, title) => {
    if (!data || typeof data !== 'object') return null;
    const chartData = Object.entries(data).map(([key, value]) => ({
      name: key, value
    }));
    return (
      <div className="chart-box">
        <h3>{title} Pollutants (Real-time)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTimeSeriesChart = (data, title) => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const keys = Object.keys(data[0]).filter(k => k !== 'date');
    return (
      <div className="timeseries-chart">
        <h4>{title} Trends (Time Series)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            {keys.map((key, index) => (
              <Line key={key} type="monotone" dataKey={key} stroke={`hsl(${index * 50}, 70%, 50%)`} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSuggestions = () => (
    <div className="suggestions-card">
      <h2>Suggestions to Reduce Pollution</h2>
      <ul>
        <li>🚶 Encourage walking, cycling, and public transport.</li>
        <li>🏭 Upgrade industrial emission filters.</li>
        <li>🌳 Increase green cover in high-pollution zones.</li>
        <li>🔋 Promote renewable energy adoption.</li>
      </ul>
    </div>
  );

const renderAreaTrendCharts = (data, title) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  const pollutants = Object.keys(data[0]).filter(k => k !== 'date');

  return (
    <div className="area-trend-section">
      <h4>{title} Pollutant Trends (Area Graphs)</h4>
      <div className="area-grid">
        {pollutants.map((pollutant, index) => (
          <div key={pollutant} className="area-card">
            <h5>{pollutant}</h5>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`color${pollutant}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`hsl(${index * 60}, 70%, 50%)`} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={`hsl(${index * 60}, 70%, 50%)`} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={pollutant}
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  fillOpacity={1}
                  fill={`url(#color${pollutant})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};


  const hasRealtime = reportData?.realtime && typeof reportData.realtime === 'object';
  const hasHistorical = reportData?.historical && typeof reportData.historical === 'object';

  return (
    <div className="reports-container">
      <h2 className="page-title">Pollution Reports</h2>
      <div className="city-input">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchReports}>Fetch Reports</button>
      </div>

      {reportData && (
        <>
          <h3 className="city-name">{reportData.city}</h3>

          <div className="charts-row">
            {hasRealtime && renderBarChart(reportData.realtime.traffic, 'Traffic')}
            {hasRealtime && renderBarChart(reportData.realtime.industrial, 'Industrial')}
          </div>

          <div className="time-suggestions">
            {/* {hasHistorical && renderTimeSeriesChart(reportData.historical.traffic, 'Traffic Pollutants')}
            {hasHistorical && renderTimeSeriesChart(reportData.historical.industrial, 'Industrial Pollutants')} */}
            <div className="area-trend-graphs">
            {hasHistorical && renderAreaTrendCharts(reportData.historical.traffic, 'Traffic')}
            {hasHistorical && renderAreaTrendCharts(reportData.historical.industrial, 'Industrial')}
            </div>
            {renderSuggestions()}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
