
// import React, { useState } from "react";
// import "./Home.css";
// import Sidebar from "./Sidebar.jsx";
// import { TextField, Button } from "@mui/material";
// import { FaRobot } from "react-icons/fa";
// import Chatbot from "./Chatbot";
// import { useNavigate } from "react-router-dom"; // ⬅️ Add this for routing

// const Home = ({ fetchAQI, aqiData }) => {
//   const [city, setCity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);

//   const navigate = useNavigate(); // ⬅️ Hook for navigation

//   const handleCityPrediction = async () => {
//     if (!city.trim()) return;
//     setLoading(true);
//     try {
//       await fetchAQI(city);
//     } catch (err) {
//       console.error("Error fetching AQI:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVisualize = () => {
//     if (!aqiData) return;
//     navigate("/results"); // ⬅️ Or change to `/visualizations` if that's your route
//   };

//   return (
//     <>
//     <div className="home-wrapper">
//       {/* 📌 Left Prompt Card */}
//       <div className="left-card">
//         <h3>Want to enter values?</h3>
//         <button onClick={() => setShowSidebar(!showSidebar)}>Click me</button>

//         {showSidebar && (
//           <div className="sidebar-popup">
//             <Sidebar fetchAQI={fetchAQI} aqiData={aqiData} />
//           </div>
//         )}
//       </div>

//       {/* 🏠 Main AQI UI Section */}
//       <div className="center-content">
//         <img src="/images/logoaqi.png" alt="Logo" className="logo" />
//         <div className="tagline">Breathe only fresh air</div>

//         <TextField
//           className="city-input"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="Enter city..."
//           // fullWidth
//         />
//         <br/>
//         <Button
//           className="predict-btn"
//           variant="contained"
//           onClick={handleCityPrediction}
//           disabled={loading}
//         >
//           {loading ? "Predicting..." : "PREDICT AQI"}
//         </Button>

//         {aqiData && (
//           <div className="aqi-result">
//             <p>
//               <strong>Predicted AQI:</strong> {parseFloat(aqiData.aqi).toFixed(2)}
//             </p>
//             <p>
//               <strong>City:</strong> {aqiData.city}
//             </p>

//             <Button
//               className="visualize-btn"
//               variant="outlined"
//               color="secondary"
//               onClick={handleVisualize}
//               style={{ marginTop: "1rem" }}
//             >
//               View Visualizations
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* 💬 Floating Chatbot */}
//       <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
//         <FaRobot size={24} />
//       </div>

//       {showChatbot && (
//         <Chatbot showChatbot={showChatbot} toggleChatbot={() => setShowChatbot(false)} />
//       )}
//     </div>
//     </>
//   );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import "./Home.css";
import Sidebar from "./Sidebar.jsx";
import { TextField, Button } from "@mui/material";
import { FaRobot } from "react-icons/fa";
import Chatbot from "./Chatbot";
import { useNavigate } from "react-router-dom";

const Home = ({ fetchAQI, aqiData }) => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleCityPrediction = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      await fetchAQI(city);
    } catch (err) {
      console.error("Error fetching AQI:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualize = () => {
    if (!aqiData) return;
    navigate("/results");
  };

  return (
    <>
      <div className="home-wrapper">
        {/* 📌 Left Prompt Card */}
        <div className="left-card">
          <h3>Want to enter values?</h3>
          <button onClick={() => setShowSidebar(!showSidebar)}>Click me</button>
          {showSidebar && (
            <div className="sidebar-popup">
              <Sidebar fetchAQI={fetchAQI} aqiData={aqiData} />
            </div>
          )}
        </div>

        {/* 🏠 Main AQI UI Section */}
        <div className={`center-content ${!isOnline ? "offline-mode" : ""}`}>
          <img src="/images/logoaqi.png" alt="Logo" className="logo" />
          <div className="tagline">Breathe only fresh air</div>

          {!isOnline && (
            <p style={{ color: "red", fontWeight: "bold",textAlign: "center" }}>
              🔴 You are offline. Please enter pollutant values manually.
            </p>
          )}

          <TextField
            className="city-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
          />
          <br/><br/>
          <Button
            className="predict-btn"
            variant="contained"
            onClick={handleCityPrediction}
            disabled={loading || !isOnline}
          >
            {loading ? "Predicting..." : "PREDICT AQI"}
          </Button>

          {aqiData && (
            <div className="aqi-result">
              <p>
                <strong>Predicted AQI:</strong> {parseFloat(aqiData.aqi).toFixed(2)}
              </p>
              <p>
                <strong>City:</strong> {aqiData.city}
              </p>

              <Button
                className="visualize-btn"
                variant="outlined"
                color="secondary"
                onClick={handleVisualize}
                style={{ marginTop: "1rem" }}
              >
                View Visualizations
              </Button>
            </div>
          )}
        </div>

        {/* 💬 Floating Chatbot */}
        <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
          <FaRobot size={24} />
        </div>

        {showChatbot && (
          <Chatbot showChatbot={showChatbot} toggleChatbot={() => setShowChatbot(false)} />
        )}
      </div>
    </>
  );
};

export default Home;

