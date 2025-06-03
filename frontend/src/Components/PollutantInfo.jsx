import React from 'react';
import './PollutantInfo.css';

const pollutantData = [
  {
    name: 'PM1',
    description: 'Particles ≤1µm in diameter. Ultrafine, often from combustion.',
    effects: 'Penetrates deep into lungs, may reach bloodstream. Harmful to heart and lungs.',
    range: 'Not standardized in AQI, but lower is better.'
  },
  {
    name: 'PM2.5',
    description: 'Particles ≤2.5µm. Emitted from vehicles, fires, industrial processes.',
    effects: 'Linked to lung disease, heart attacks, stroke.',
    range: 'Good: 0–12 | Moderate: 12.1–35.4 | Unhealthy: 35.5+ µg/m³'
  },
  {
    name: 'PM10',
    description: 'Particles ≤10µm. Includes dust, pollen, mold.',
    effects: 'Can irritate eyes, nose, throat, and lungs.',
    range: 'Good: 0–54 | Moderate: 55–154 | Unhealthy: 155+ µg/m³'
  },
  {
    name: 'NO₂',
    description: 'Nitrogen dioxide from cars, trucks, and power plants.',
    effects: 'Worsens asthma and respiratory conditions.',
    range: 'Good: 0–53 ppb | Moderate: 54–100 | Unhealthy: 101+'
  },
  {
    name: 'SO₂',
    description: 'Sulfur dioxide from burning coal and oil.',
    effects: 'Irritates lungs; harmful for people with asthma.',
    range: 'Good: 0–35 ppb | Moderate: 36–75 | Unhealthy: 76+'
  },
  {
    name: 'CO',
    description: 'Carbon monoxide from incomplete combustion (vehicles, stoves).',
    effects: 'Reduces oxygen delivery; deadly at high concentrations.',
    range: 'Good: 0–4.4 ppm | Moderate: 4.5–9.4 | Unhealthy: 9.5+'
  },
  {
    name: 'O₃',
    description: 'Ozone formed in sunlight from NOx + VOCs.',
    effects: 'Causes breathing issues, coughing, lung damage.',
    range: 'Good: 0–54 ppb | Moderate: 55–70 | Unhealthy: 71+'
  },
  {
    name: 'NH₃',
    description: 'Ammonia from agriculture and industrial waste.',
    effects: 'Causes eye, skin, and respiratory irritation.',
    range: 'No AQI standard; high levels are hazardous.'
  },
  {
    name: 'Benzene',
    description: 'Volatile organic compound from burning coal/oil and tobacco smoke.',
    effects: 'Known carcinogen; affects bone marrow and blood cells.',
    range: 'Safe exposure: <5 µg/m³ | Long-term exposure is harmful.'
  },
  {
    name: 'Toluene',
    description: 'Solvent found in paints, thinners, adhesives.',
    effects: 'Causes dizziness, headaches, and nervous system damage.',
    range: 'Occupational limit: <200 ppm (short-term exposure)'
  },
  {
    name: 'Xylene',
    description: 'Solvent from petroleum and synthetic materials.',
    effects: 'Irritates eyes and lungs; can affect the liver and kidneys.',
    range: 'Safe levels: <100 ppm (short-term exposure)'
  },
  {
    name: 'Lead',
    description: 'Heavy metal from industrial emissions and old paints.',
    effects: 'Neurotoxin, especially dangerous for children.',
    range: 'Standard: <0.15 µg/m³ (3-month average)'
  }
];

const PollutantInfo = () => {
  return (
    <div className="pollutant-scroll-container">
      <div className="pollutant-heading">
        <h2>Pollutants and Health Impact</h2>
      </div>
      <div className="pollutant-boxs">
        {pollutantData.map((pollutant, idx) => (
          <div key={idx} className="pollutant-block">
            <h3>{pollutant.name}</h3>
            <p><strong>Description:</strong> {pollutant.description}</p>
            <p><strong>Health Effects:</strong> {pollutant.effects}</p>
            <p><strong>Range:</strong> {pollutant.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollutantInfo;
