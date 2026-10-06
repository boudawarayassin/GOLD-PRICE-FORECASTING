from pydantic import BaseModel
from typing import List


class ForecastPoint(BaseModel):
    Date: str
    Predicted_Return: float
    Predicted_USD: float


class ForecastResponse(BaseModel):
    model: str
    last_actual_price: float
    forecast: List[ForecastPoint]