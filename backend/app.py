from flask import Flask, request, jsonify
from flask import send_from_directory
import requests
from flask_cors import CORS
import os
import pandas as pd
from dotenv import load_dotenv
from model import load_model, predict_aqi
import google.generativeai as genai
import matplotlib.pyplot as plt

# Load environment variables
load_dotenv()

# Secure API Key Handling
API_KEY = os.getenv("OPENWEATHER_API_KEY")
if not API_KEY:
    raise ValueError("⚠️ OPENWEATHER_API_KEY environment variable is missing!")

API_KEY_GEN = "AIzaSyDDzfDBbjQRuuaO_elWFGu7jWmiv6QG1RA"
#os.getenv("GOOGLE_GEMINI_API_KEY")  # Store in env variable instead of hardcoding

if not API_KEY_GEN:
    print("⚠️ Error: Google Gemini API Key is missing. Set it as an environment variable.")
    exit()

# Configure Gemini AI with API Key
genai.configure(api_key=API_KEY_GEN)

# API URLs
GEO_URL = "http://api.openweathermap.org/geo/1.0/direct"
AIR_QUALITY_URL = "https://api.openweathermap.org/data/2.5/air_pollution"

file_path = "data/air_quality_data.csv"
df = pd.read_csv(file_path)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load trained model
model, X_columns = load_model()

def get_air_quality_response(city):
    city_data = df[df['City'].str.lower() == city.lower()]
    
    if city_data.empty:
        return f"Sorry, I don't have air quality data for {city}."

    latest_data = city_data.sort_values(by="Date", ascending=False).iloc[0]
    aqi = latest_data["AQI"]
    aqi_bucket = latest_data["AQI_Bucket"]

    response = f"The latest Air Quality Index (AQI) for {city} is {aqi}, which falls under the '{aqi_bucket}' category."

    # Provide recommendations based on AQI bucket
    if aqi_bucket in ["Good", "Satisfactory"]:
        response += " ✅ The air quality is safe. Enjoy your day!"
    elif aqi_bucket in ["Moderate"]:
        response += " ⚠️ People with respiratory issues should limit outdoor activities."
    elif aqi_bucket in ["Poor", "Very Poor"]:
        response += " ❗ It's advised to wear a mask outdoors and use air purifiers indoors."
    else:
        response += " 🚨 The air quality is **severe**! Stay indoors and avoid exposure."

    return response

def get_city_coordinates(city_name):
    """Fetch latitude and longitude for a given city."""
    try:
        response = requests.get(f"{GEO_URL}?q={city_name}&limit=1&appid={API_KEY}")
        response.raise_for_status()
        data = response.json()
        if data:
            return data[0]["lat"], data[0]["lon"]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching coordinates: {e}")
    return None, None

def fetch_air_quality(lat, lon):
    """Fetch real-time air quality data for given coordinates."""
    try:
        response = requests.get(f"{AIR_QUALITY_URL}?lat={lat}&lon={lon}&appid={API_KEY}")
        response.raise_for_status()
        data = response.json()
        if "list" in data and data["list"]:
            return data["list"][0]  # Return first item
    except requests.exceptions.RequestException as e:
        print(f"Error fetching air quality data: {e}")
    return None

@app.route("/predict", methods=["POST"])
def predict():
    """Predict AQI based on city or manually entered pollutant data."""
    data = request.json
    city_name = data.get("city")
    pollutants = data.get("pollutants")

    if not city_name:
        return jsonify({"error": "City name is required"}), 400

    if pollutants:
        try:
            pollutants_list = [float(pollutants.get(col.lower(), 0)) for col in X_columns]
        except ValueError:
            return jsonify({"error": "Invalid pollutant values"}), 400
    else:
        lat, lon = get_city_coordinates(city_name)
        if lat is None or lon is None:
            return jsonify({"error": "Invalid city or unable to fetch coordinates"}), 400

        air_quality_data = fetch_air_quality(lat, lon)
        if not air_quality_data:
            return jsonify({"error": "Unable to fetch AQI data"}), 500

        pollutants_list = [air_quality_data['components'].get(param.lower(), 0) for param in X_columns]

    if len(pollutants_list) != len(X_columns):
        return jsonify({"error": "Mismatch in pollutant data"}), 500

    predicted_aqi = predict_aqi(model, pollutants_list)
    print(f"📊 AQI predicted using model: {predicted_aqi}")

    return jsonify({
        "city": city_name,
        "aqi": predicted_aqi,
        "pollutants": pollutants_list
    })


@app.route("/chatbot", methods=["POST"])
def chatbot():
    models = genai.GenerativeModel("gemini-1.5-flash")
    data = request.json
    user_message = data.get("message", "").strip()

    print(f"📩 Received Message: {user_message}")  # ✅ Debug print statement

    if not user_message:
        return jsonify({"response": "Please enter a valid query."})

    # ✅ Check if it's an AQI-related question
    city_response = get_air_quality_response(user_message)
    print(f"🏙️ City Response: {city_response}")  # ✅ Debug print statement

    if "Sorry" not in city_response:
        return jsonify({"response": city_response})

    # ✅ If it's a general air pollution question, ask Gemini AI
    ai_prompt = f"""
    You are an AI expert in air quality analysis. Answer questions based ONLY on air pollution and air quality.
    
    
    User: {user_message}
    """
    # If asked something unrelated, respond with:
    # "Sorry, I can only answer air quality-related questions."
    try:
        response = models.generate_content(ai_prompt)
        ai_reply = response.text if hasattr(response, "text") else "I couldn't generate a response."
        print(f"🤖 AI Response: {ai_reply}")  # Debug print
        return jsonify({"response": ai_reply})
    except Exception as e:
        print(f"⚠️ Error: {str(e)}")  # Debug print
        return jsonify({"response": "I'm currently unable to answer. Please try again later."})
    

@app.route('/api/reports/<city>', methods=['GET'])
def get_reports(city):
    """Return real-time and historical pollutant data for a city."""
    import pprint
    print(f"\n🔍 Request received for city: {city}")

    # Step 1: Get coordinates
    lat, lon = get_city_coordinates(city)
    print(f"📍 Coordinates for {city}: {lat}, {lon}")
    if lat is None or lon is None:
        print("❌ Coordinates not found.")
        return jsonify({"error": f"Invalid city or coordinates not found for {city}"}), 400

    # Step 2: Real-time data
    realtime = fetch_air_quality(lat, lon)
    print("📡 Real-time response:")
    pprint.pprint(realtime)

    if not realtime:
        print("❌ No real-time data fetched.")
        return jsonify({"error": f"Unable to fetch real-time air quality data for {city}"}), 500

    components = realtime.get("components", {})
    print(f"🧪 Extracted components: {components}")

    # ✅ Step 3: Define pollutant categories (only present ones)
    traffic_pollutants = ['co', 'no', 'no2', 'nh3']
    industrial_pollutants = ['pm2_5', 'pm10', 'so2', 'o3']

    # Step 4: Format real-time pollutant data
    traffic_data = {pol.upper(): round(components.get(pol, 0), 2) for pol in traffic_pollutants}
    industrial_data = {pol.upper(): round(components.get(pol, 0), 2) for pol in industrial_pollutants}
    print("🚗 Traffic pollutants (real-time):", traffic_data)
    print("🏭 Industrial pollutants (real-time):", industrial_data)


    # Step 5: Get time-series data from CSV for this city
    city_df = df[df['City'].str.lower() == city.lower()].copy()
    city_df['Date'] = pd.to_datetime(city_df['Date'])
    city_df.sort_values('Date', inplace=True)

    if city_df.empty:
        print("⚠️ No historical data found for city in CSV.")

    # Step 6: Extract historical time-series data
    time_series_traffic = city_df[['Date'] + [pol.upper() for pol in traffic_pollutants if pol.upper() in city_df.columns]].dropna().to_dict(orient='records')
    time_series_industrial = city_df[['Date'] + [pol.upper() for pol in industrial_pollutants if pol.upper() in city_df.columns]].dropna().to_dict(orient='records')

    # Step 7: Format dates as strings
    for row in time_series_traffic:
        row['Date'] = row['Date'].strftime('%Y-%m-%d')
    for row in time_series_industrial:
        row['Date'] = row['Date'].strftime('%Y-%m-%d')

    print(f"📈 Time-series traffic data (sample): {time_series_traffic[:1]}")
    print(f"📉 Time-series industrial data (sample): {time_series_industrial[:1]}")

    # Final JSON response
    response = {
        "city": city.title(),
        "lat": lat,
        "lon": lon,
        "realtime": {
            "traffic": traffic_data,
            "industrial": industrial_data
        },
        "historical": {
            "traffic": time_series_traffic,
            "industrial": time_series_industrial
        }
    }

    print("✅ Final API Response Sample:")
    pprint.pprint({k: response[k] if k != "historical" else "historical data hidden for brevity" for k in response})

    return jsonify(response)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join("../frontend/dist", path)):
        return send_from_directory("../frontend/dist", path)
    return send_from_directory("../frontend/dist", "index.html")


if __name__ == "__main__":
    app.run(debug=True)
