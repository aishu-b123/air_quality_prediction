import streamlit as st
import requests
import pandas as pd
import numpy as np
import folium
import os
import joblib
from streamlit_folium import folium_static
import seaborn as sns
import openai
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_absolute_error, r2_score
import google.generativeai as genai

# OpenWeatherMap API Setup
API_KEY = "883258cf70a3b71f8b19355003aae14d"
GEO_URL = "http://api.openweathermap.org/geo/1.0/direct"
AIR_QUALITY_URL = "https://api.openweathermap.org/data/2.5/air_pollution"


def get_city_coordinates(city_name):
    try:
        response = requests.get(f"{GEO_URL}?q={city_name}&limit=1&appid={API_KEY}")
        response.raise_for_status()
        data = response.json()
        if data:
            return data[0]["lat"], data[0]["lon"]
        else:
            st.error("City not found!")
            return None, None
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching coordinates: {e}")
        return None, None

def fetch_air_quality(city_name):
    lat, lon = get_city_coordinates(city_name)
    if lat is None or lon is None:
        return None, None, None
    try:
        response = requests.get(f"{AIR_QUALITY_URL}?lat={lat}&lon={lon}&appid={API_KEY}")
        response.raise_for_status()
        data = response.json()
        return data["list"][0], lat, lon
    except requests.exceptions.RequestException as e:
        st.error(f"Error fetching AQI data: {e}")
        return None, None, None

# Load Dataset & Train Model
@st.cache_data
def load_data():
    df = pd.read_csv("cleaned_airq_processed.csv")  # Ensure correct filename
    df.dropna(inplace=True)
    return df

df = load_data()
X = df.drop(columns=["AQI", "City", "Date", "AQI_Bucket"], errors='ignore')
y = df["AQI"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter Grid
param_grid = {
    'n_estimators': [50, 100, 200],  
    'max_depth': [10, 20, 30],  
    'min_samples_split': [2, 5, 10]
}

# Model filename
model_filename = "rf_model.pkl"

# Load existing model or train a new one
if os.path.exists(model_filename):
    model = joblib.load(model_filename)
    print("✅ Model loaded successfully from file.")
else:
    print("🚀 Training model as no saved model found.")
    
    rf = RandomForestRegressor(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=3, scoring='r2', n_jobs=2)
    grid_search.fit(X_train, y_train)
    
    model = grid_search.best_estimator_
    joblib.dump(model, model_filename)  # Save the trained model
    print("✅ Model training completed and saved.")

# Model Performance Metrics
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Function to visualize AQI and pollutant contribution
def visualize_aqi(pollutants, predicted_aqi, title):
    st.subheader(title)

    # Pie Chart for Pollutants
    fig, ax = plt.subplots()
    ax.pie(pollutants, labels=X.columns, autopct='%1.1f%%', startangle=140, colors=sns.color_palette("pastel"))
    ax.set_title("Pollutant Contribution to AQI")
    for text in ax.texts:
        text.set_fontsize(5) 
    st.pyplot(fig)
    
    # Bar Chart for AQI
    fig, ax = plt.subplots()
    ax.bar(["Predicted AQI"], [predicted_aqi], color=["green" if predicted_aqi <= 50 else "orange" if predicted_aqi <= 150 else "red"])
    ax.set_ylim(0, 400)
    ax.set_title("AQI Level")
    st.pyplot(fig)

    # Traffic Pollution Impact
    st.subheader("🚦 Traffic Pollution Impact")
    df["Traffic Pollution"] = df[["NO2", "CO", "PM2.5"]].mean(axis=1)
    fig, ax = plt.subplots()
    sns.histplot(df["Traffic Pollution"], bins=20, kde=True, color="blue", ax=ax)
    ax.set_title("Traffic Pollution Impact Distribution")
    st.pyplot(fig)

    # Industrial Pollution Impact
    st.subheader("🏭 Industrial Pollution Impact")
    df["Industrial Pollution"] = df[["SO2", "NOx", "Benzene"]].mean(axis=1)
    fig, ax = plt.subplots()
    sns.histplot(df["Industrial Pollution"], bins=20, kde=True, color="red", ax=ax)
    ax.set_title("Industrial Pollution Impact Distribution")
    st.pyplot(fig)
    st.metric(label="🌡️ Predicted AQI", value=round(predicted_aqi, 2))

    # Precautionary Message
    def get_precaution(aqi):
        if aqi <= 50:
            return "✅ Good: Enjoy outdoor activities!"
        elif aqi <= 100:
            return "🟡 Moderate: Sensitive groups should limit outdoor activities."
        elif aqi <= 150:
            return "🟠 Unhealthy for sensitive groups: Consider wearing a mask outside."
        elif aqi <= 200:
            return "🔴 Unhealthy: Everyone should reduce outdoor activities."
        elif aqi <= 300:
            return "🟣 Very Unhealthy: Avoid going outside, use an air purifier indoors."
        else:
            return "⚫ Hazardous: Stay indoors, wear an N95 mask, use air purifiers."

    st.warning(get_precaution(predicted_aqi))

# Streamlit UI
st.title("🌍 AQI Monitoring & Prediction System")
city_name = st.text_input("Enter City Name", "New York")

st.sidebar.header("Enter Pollutant Levels")
st.sidebar.write("📊 **Model Performance:**")
st.sidebar.write(f"MAE: {mae:.2f}")
st.sidebar.write(f"R² Score: {r2:.2f}")

parameters = X.columns.tolist()
input_values = []
for param in parameters:
    input_values.append(st.sidebar.slider(f"{param} (µg/m³ or mg/m³)", float(df[param].min()), float(df[param].max()), float(df[param].mean())))
input_values = np.array([input_values])

if st.button("Fetch Real-time AQI & Predict"):
    data, lat, lon = fetch_air_quality(city_name)
    if data:
        pollutants = [data['components'].get(param.lower(), 0) for param in X.columns]
        input_data = np.array([pollutants])
        predicted_aqi = model.predict(input_data)[0]
        
        # Display Map
        map_obj = folium.Map(location=[lat, lon], zoom_start=10)
        folium.Marker([lat, lon], popup=city_name).add_to(map_obj)
        folium_static(map_obj)
        
        # Visualize AQI
        visualize_aqi(pollutants, predicted_aqi, "📊 Real-time Pollutant Contribution to AQI")

if st.sidebar.button("Predict AQI from Input"):
    predicted_aqi_manual = model.predict(input_values)[0]
    st.sidebar.metric("Predicted AQI (Manual Input)", round(predicted_aqi_manual, 2))
    visualize_aqi(input_values[0], predicted_aqi_manual, "📊 Pollutant Contribution to Predicted AQI (Manual Input)")
