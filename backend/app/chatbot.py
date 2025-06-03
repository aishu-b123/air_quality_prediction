import google.generativeai as genai
import pandas as pd
import os
import sys

# Ensure UTF-8 encoding to avoid Unicode errors
sys.stdout.reconfigure(encoding='utf-8')

# Load environment variable for API Key (More Secure)
API_KEY = "AIzaSyDDzfDBbjQRuuaO_elWFGu7jWmiv6QG1RA"
#os.getenv("GOOGLE_GEMINI_API_KEY")  # Store in env variable instead of hardcoding

if not API_KEY:
    print("⚠️ Error: Google Gemini API Key is missing. Set it as an environment variable.")
    exit()

# Configure Gemini AI with API Key
genai.configure(api_key=API_KEY)

# Load the air quality dataset
file_path = "cleaned_airq_processed.csv"
df = pd.read_csv(file_path)

# Function to get AQI information based on user query
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

# Load the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Start Chatbot
print("🤖 AI Chatbot for Air Quality (Type 'exit' to quit)\n")

while True:
    user_input = input("You: ").strip()
    
    if user_input.lower() == "exit":
        print("Chatbot: Goodbye! Stay safe from air pollution. 🌿")
        break

    # First, check if it's an air quality-related query
    city_response = get_air_quality_response(user_input)

    if "Sorry" not in city_response:
        print(f"Chatbot: {city_response}")
    else:
        # Let Gemini AI generate a response
        ai_prompt = f"""
        You are an AI expert in air quality analysis. Answer questions based ONLY on air pollution.
        If asked something unrelated, respond with:
        "Sorry, I can only answer air quality-related questions."

        User Question: {user_input}
        """
        try:
            response = model.generate_content(ai_prompt)
            print("Chatbot:", response.text if hasattr(response, 'text') else "I couldn't generate a response.")
        except Exception as e:
            print("Error generating AI response:", str(e))
