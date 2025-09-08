# Project : AI-powered Air Quality Monitoring and Pollution Prediction System

## 🌍 Overview

This project is an **AI-powered web application** that monitors and predicts **Air Quality Index (AQI)** for different cities. It integrates **Flask (backend)** and **React (frontend)**, using a **Random Forest algorithm** to predict AQI based on city and year. The system fetches pollutant data through map integration (no physical sensors required) and provides real-time analysis with health suggestions. It also includes a **chatbot assistant** to interact with users and answer queries related to air quality.

## 🚀 Live Demo

🔗 [Deployed Application]air-quality-prediction-ten.vercel.app

## ✨ Features

* 🌐 User-friendly web interface
* 📊 Real-time AQI data visualization (graphs & charts)
* 🤖 AQI prediction using **Random Forest ML model**
* 🏙️ City-wise air quality monitoring
* 🏭 Analysis of traffic and industrial pollutants
* 🩺 Health recommendations based on AQI levels
* 💬 **AI-powered chatbot** for answering AQI & pollution-related queries

## 🛠 Tech Stack

* **Frontend:** React.js, Chart libraries (Recharts/Matplotlib via API)
* **Backend:** Flask (Python)
* **Machine Learning:** Random Forest (scikit-learn, pandas, NumPy)
* **Integration:** Map-based pollutant fetching

## ⚙️ Installation & Setup (For Local Development)

1. Clone the repository

   ```bash
   git clone <github path>
   cd air-quality-monitoring
   ```
2. Setup backend (Flask)

   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
3. Setup frontend (React)

   ```bash
   cd frontend
   npm install
   npm start
   ```
4. Access the app at `http://localhost:3000`

## 📌 Usage

* Enter a **city name** in the input box
* View **real-time AQI data & graphs**
* Get **predicted AQI** for upcoming years
* Explore **pollutant analysis & health suggestions**
* Chat with the **AI chatbot** for instant guidance

## 🚀 Future Enhancements

* Add deep learning models (LSTM for time series AQI prediction)
* Mobile-friendly responsive UI
* API integration for global AQI datasets
* User login & personalized dashboards


