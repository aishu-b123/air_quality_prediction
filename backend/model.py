import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import  GridSearchCV
import joblib
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "air_quality_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "data", "aqi_model.pkl")

FEATURE_COLUMNS = [
    "PM2.5", "PM10", "NO", "NO2", "NOx", "NH3", "CO", "SO2", "O3",
    "Benzene", "Toluene", "Xylene"
]


def train_and_save_model():
    """Train a new model with hyperparameter tuning if no saved model is found."""
    if os.path.exists(MODEL_PATH):
        print("✅ Loading existing model...")
        model = joblib.load(MODEL_PATH)
        return model, FEATURE_COLUMNS

    print("⚠️ Model not found. Training a new one...")

    # Load dataset
    df = pd.read_csv(CSV_PATH).dropna()
    df = df.dropna(subset=["AQI"])  # Ensure no missing target values

    # Define features (X) and target (y)
    X = df[FEATURE_COLUMNS]
    y = df["AQI"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Initialize RandomForestRegressor
    rf = RandomForestRegressor(random_state=42)

    # Hyperparameter tuning grid
    param_grid = {
        'n_estimators': [50, 100,150],
        'max_depth': [10, 15, 20],
        'min_samples_split': [5,10]
    }

    grid_search = GridSearchCV(rf, param_grid, cv=3, scoring='r2', n_jobs=-1)
    grid_search.fit(X_scaled, y)

    # Get the best model from GridSearchCV
    model = grid_search.best_estimator_
    print(f"✅ Best Model Params: {grid_search.best_params_}")

    # Save trained model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump((model, FEATURE_COLUMNS), f)

    print("✅ Model trained and saved successfully!")
    return model, FEATURE_COLUMNS

def load_model():
    """Load trained model or train a new one if not found."""
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model, X_columns = pickle.load(f)
        print("✅ Model loaded successfully!")
    else:
        train_and_save_model()
        with open(MODEL_PATH, "rb") as f:
            model, X_columns = pickle.load(f)
    
    return model, X_columns

def predict_aqi(model, pollutants):
    """Predict AQI based on pollutant values."""
    pollutants = np.array(pollutants).reshape(1, -1)  # Ensure correct input shape
    return model.predict(pollutants)[0]  # Return AQI value
