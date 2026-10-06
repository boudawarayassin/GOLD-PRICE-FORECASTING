from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from api.schemas import ForecastResponse



# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

FORECAST_FILE = BASE_DIR / "outputs" / "forecast_2026_2027.csv"
FRONTEND_DIR = BASE_DIR / "frontend"


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Gold Price Forecasting API",
    description="API for monthly gold price forecasting using XGBoost",
    version="1.0.0"
)


# ============================================================
# FRONTEND
# ============================================================
OUTPUTS_DIR = BASE_DIR / "outputs"


app.mount(
    "/static",
    StaticFiles(directory=FRONTEND_DIR),
    name="static"
)
# OUTPUTS
app.mount(
    "/outputs",
    StaticFiles(directory=OUTPUTS_DIR),
    name="outputs"
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return FileResponse(FRONTEND_DIR / "index.html")


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "model": "XGBoost Return"
    }


# ============================================================
# FORECAST
# ============================================================

@app.get("/api/forecast", response_model=ForecastResponse)
def get_forecast():

    if not FORECAST_FILE.exists():
        return {
            "model": "XGBoost Return",
            "last_actual_price": 4324.72,
            "forecast": []
        }

    df = pd.read_csv(FORECAST_FILE)

    forecast = []

    for _, row in df.iterrows():
        forecast.append({
            "Date": str(row["Date"]),
            "Predicted_Return": float(row["Predicted_Return"]),
            "Predicted_USD": float(row["Predicted_USD"])
        })

    return {
        "model": "XGBoost Return",
        "last_actual_price": 4324.72,
        "forecast": forecast
    }