import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import Chatbot from "./Chatbot";
import "./Suggestions.css";

const getPrecaution = (aqi) => {
  if (aqi <= 50) {
    console.log(aqi)
    return {
      status: "✅ Good",
      message: "Air quality is excellent! Enjoy outdoor activities without any concern.",
      image: "/images/good_air.png",
      tips: [
        "🌿 Open windows for fresh air circulation.",
        "🏃 Engage in outdoor exercise and activities.",
        "😃 No special precautions needed.",
      ],
    };
  }
  else if (aqi <= 100) {
    console.log(aqi)
    return {
      status: "🟡 Moderate",
      message: "Air quality is acceptable, but sensitive individuals may experience slight discomfort.",
      image: "/images/moderate_air.png",
      tips: [
        "🚲 Avoid high-traffic areas while outdoors.",
        "🚪 Close windows during peak pollution hours.",
        "🫁 Monitor air quality updates if you have breathing issues.",
      ],
    };
  }
  else if (aqi <= 150) {
    console.log(aqi)
    return {
      status: "🟠 Unhealthy for Sensitive Groups",
      message: "People with respiratory conditions, children, and the elderly should take precautions.",
      image: "/images/unhealthy_sensitive.png",
      tips: [
        "😷 Consider wearing a mask outdoors.",
        "🏠 Reduce outdoor activities, especially in the afternoon.",
        "💨 Use an air purifier indoors.",
      ],
    };
  }
  else if (aqi <= 200) {
    console.log(aqi)
    return {
      status: "🔴 Unhealthy",
      message: "Air quality is poor; everyone may experience health effects.",
      image: "/images/unhealthy.png",
      tips: [
        "❌ Limit outdoor activities, especially strenuous exercises.",
        "😷 Wear an N95 mask if you must go outside.",
        "🏡 Keep windows closed and use an air purifier.",
        "💧 Stay hydrated to clear toxins.",
      ],
    };
  }
  else if (aqi <= 300) {
    console.log(aqi)
    return {
      status: "🟣 Very Unhealthy",
      message: "Serious health effects possible; outdoor exposure should be minimized.",
      image: "/images/very_unhealthy.png",
      tips: [
        "🚪 Stay indoors as much as possible.",
        "💨 Use air purifiers and keep doors/windows closed.",
        "🫁 Keep asthma or respiratory medications ready.",
        "🔥 Avoid gas stoves or candles to reduce indoor pollution.",
      ],
    };
  }
  else{
  console.log(aqi)
  console.log("Hello")
  return {
    status: "⚫ Hazardous",
    message: "Air pollution is at dangerous levels. Avoid outdoor exposure completely.",
    image: "/images/hazardous.png",
    tips: [
      "🏠 Stay indoors and use HEPA filters in air purifiers.",
      "😷 Wear an N95 mask for any outdoor travel.",
      "🛑 Limit physical activity even indoors.",
      "🚨 Check for emergency health alerts & government advisories.",
    ],
  };
}
};

const generalSuggestions = [
  {
    group: "👶 Children",
    tips: [
      "👒 Encourage indoor play during high AQI days.",
      "🍼 Ensure they drink enough fluids.",
      "📚 Use air purifiers in classrooms or homes."
    ],
  },
  {
    group: "🧓 Elderly",
    tips: [
      "💊 Keep medications handy (especially for respiratory issues).",
      "🛏️ Avoid unnecessary travel during high pollution periods.",
      "🧘 Light indoor exercises instead of outdoor walks.",
    ],
  },
  {
    group: "👨‍👩‍👧 Adults",
    tips: [
      "🚗 Limit car use; carpool or use public transport.",
      "💨 Clean air filters in ACs and purifiers regularly.",
      "🧼 Wash hands and face after outdoor exposure.",
    ],
  },
];
const pollutantPrecautions = {
  "PM2.5": [
    "🚗⚡ Switch to electric vehicles or use public transport",
    "🌳🌱 Plant more trees to help absorb fine particulate matter"
  ],
  "PM10": [
    "🔥🚫 Avoid burning garbage or dry leaves",
    "🏗️💨 Support construction dust control initiatives"
  ],
  "NO2": [
    "🚫💨 Avoid using diesel generators",
    "🏭🌍 Promote cleaner industrial practices in your area"
  ],
  "CO": [
    "🚗🔧 Ensure car engines are maintained to reduce emissions",
    "🚗⛔ Avoid idling vehicles unnecessarily"
  ],
  "O3": [
    "💡🔋 Reduce fossil fuel usage by conserving electricity",
    "🧴❌ Avoid using chemical-based aerosols or cleaners"
  ],
  "NH3": [
    "🌻🌿 Reduce the use of chemical fertilizers in gardens",
    "🌾🌱 Promote organic farming in your community"
  ],
  "Benzene": [
    "🚭🚗 Avoid smoking and exposure to car exhaust",
    "🎨🌿 Use eco-friendly paints and cleaning products"
  ]
};


// const pollutantLabels = ["PM2.5", "PM10", "NO2", "CO", "O3", "NH3", "Benzene"];
// const pollutantValues = aqiData?.pollutants || [];

// // Map with labels
// const pollutantArray = pollutantLabels.map((label, idx) => ({
//   name: label,
//   value: pollutantValues[idx]
// }));

// // Sort by value and take top 3
// const topPollutants = pollutantArray
//   .sort((a, b) => b.value - a.value)
//   .slice(0, 3);
// Function to get the top 3 pollutants based on their values
const getTopPollutants = (pollutantsData) => {
  const pollutantLabels = [ "PM1", "PM2.5", "PM10", "NO2", "SO2", "CO", "O3","NH3", "Benzene", "Toluene", "Xylene", "Lead"];
  const pollutantValues = pollutantsData || [];

  // Map with labels
  const pollutantArray = pollutantLabels.map((label, idx) => ({
    name: label,
    value: pollutantValues[idx],
  }));

  // Sort by value and take the top 3
  const topPollutants = pollutantArray
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return topPollutants;
};

const Suggestions = ({ aqiData }) => {
  const aqi=aqiData?.aqi||0;
  const [showChatbot, setShowChatbot] = useState(false);
  const precaution = getPrecaution(aqi);
  const topPollutants = getTopPollutants(aqiData?.pollutants);
  return (
    <div className="suggestions-container">
      <div className="aqi-card blur-card">
        <h3>🌍 AQI-Based Precautions</h3>
        <h4>{precaution.status}</h4>
        <p>{precaution.message}</p>
        <ul>
          {precaution.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
        <h3>⚠️ Precautions for Top Pollutants</h3>
        {topPollutants.map((pollutant, index) => (
        <div key={index} className="pollutant-precaution">
          <h4>
            {pollutant.name} (Value: {pollutant.value})
          </h4>
          <ul>
            {pollutantPrecautions[pollutant.name]?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        ))}
      </div>
      {/* <div className="top-pollutants-section">
        <h3>⚠️ Precautions for Top Pollutants</h3>
        {topPollutants.map((pollutant, index) => (
        <div key={index} className="pollutant-precaution">
          <h4>
            {pollutant.name} (Value: {pollutant.value})
          </h4>
          <ul>
            {pollutantPrecautions[pollutant.name]?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        ))}
      </div> */}
      <div className="general-tips blur-card">
        <h3>👨‍👩‍👧 General Health Tips</h3>
        {generalSuggestions.map((group, index) => (
          <div key={index} className="age-group">
            <h4>{group.group}</h4>
            <ul>
              {group.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* 💬 Floating Chatbot */}
      <div className="chatbot-icon" onClick={() => setShowChatbot(!showChatbot)}>
        <FaRobot size={24} />
      </div>

      {showChatbot && (
        <Chatbot showChatbot={showChatbot} toggleChatbot={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default Suggestions;
