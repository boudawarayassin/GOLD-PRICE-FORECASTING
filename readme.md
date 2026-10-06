# 🥇 Gold Price Forecasting

## 📌 Project Overview

This project focuses on forecasting the monthly gold price in **USD per troy ounce** using historical time-series data.

Several forecasting approaches were evaluated, ranging from classical statistical baselines to machine learning and deep learning models. The final model was selected using **rolling-origin time-series cross-validation**.

The selected model, **XGBoost trained on monthly returns**, was then retrained using the complete dataset available through September 2026 and used to forecast gold prices from **October 2026 to September 2027**.

---

## 🎯 Objectives

The main objectives of this project are:

* Analyze the historical evolution of gold prices.
* Perform exploratory time-series analysis.
* Test the stationarity of the series.
* Establish simple forecasting baselines.
* Compare statistical, machine learning and deep learning approaches.
* Select the best-performing model using time-series cross-validation.
* Generate a 12-month forecast for the gold price.
* Build a reproducible forecasting pipeline suitable for deployment.

---

## 📊 Dataset

The dataset contains monthly average gold prices in several currencies.

For this project, only the **USD price per troy ounce** was used.

### Dataset characteristics

| Property     |                Value |
| ------------ | -------------------: |
| Frequency    |              Monthly |
| Observations |                  585 |
| Start        |         January 1978 |
| End          |       September 2026 |
| Target       | Gold price in USD/oz |
| Minimum      |           207.83 USD |
| Maximum      |         5,019.53 USD |

The most recent observed price in the dataset is:

**September 2026: 4,324.72 USD/oz**

---

## 🔍 Exploratory Data Analysis

The analysis included:

* Historical price evolution.
* Distribution analysis.
* Summary statistics.
* Missing-value analysis.
* Duplicate-date verification.
* Date-order verification.
* Recent price behavior.
* Return analysis.

The gold price shows strong long-term non-stationarity and several periods of substantial price increases and corrections.

The dataset contains approximately **48 years of monthly observations**, providing a useful historical basis for forecasting.

---

## 📈 Stationarity Analysis

The Augmented Dickey-Fuller (ADF) test was applied to the original price series and transformed series.

| Series            | ADF p-value | Interpretation |
| ----------------- | ----------: | -------------- |
| USD price         |      0.9976 | Non-stationary |
| First difference  |   0.0000703 | Stationary     |
| Percentage return |    4.70e-24 | Stationary     |

The original USD price series is therefore non-stationary.

For the machine-learning model, the target was transformed into monthly percentage returns:

```text
return_t = (price_t - price_(t-1)) / price_(t-1)
```

The predicted returns were then recursively converted back into gold-price levels.

---

## 🤖 Models Evaluated

Several models were evaluated.

### Baseline models

* Naive forecasting
* Seasonal Naive forecasting

### Statistical model

* ARIMA(2,1,3)

### Machine Learning

* XGBoost on monthly returns

### Deep Learning

* LSTM
* GRU

All models were evaluated using **rolling-origin time-series cross-validation** with five validation periods of 12 months.

---

## 🏆 Model Comparison

The average results across the five validation periods were:

| Model              |      MAE ↓ |     RMSE ↓ |    MAPE ↓ |
| ------------------ | ---------: | ---------: | --------: |
| Naive              |     369.63 |     422.58 |    11.83% |
| Seasonal Naive     |     550.26 |     583.17 |    16.55% |
| ARIMA(2,1,3)       |     294.54 |     354.44 |    10.30% |
| **XGBoost Return** | **196.07** |     249.23 | **6.55%** |
| LSTM               |     213.22 | **247.66** |     7.31% |
| GRU                |     243.54 |     297.11 |     8.35% |

### 🥇 Selected model: XGBoost Return

XGBoost achieved the best overall performance:

* **MAE: 196.07 USD**
* **RMSE: 249.23 USD**
* **MAPE: 6.55%**

Although LSTM achieved a slightly lower RMSE, XGBoost obtained better MAE and MAPE and was therefore selected as the final model.

---

## ⚙️ XGBoost Features

The model predicts the next monthly return using historical return information and rolling statistics.

Features include:

* Previous 1-month return
* Previous 2-month return
* Previous 3-month return
* Previous 6-month return
* Previous 12-month return
* 3-month rolling mean
* 6-month rolling mean
* 12-month rolling mean
* 3-month rolling standard deviation
* 6-month rolling standard deviation
* 12-month rolling standard deviation
* Month of the year

The final XGBoost configuration was:

```text
n_estimators = 300
max_depth = 3
learning_rate = 0.05
min_child_weight = 1
subsample = 0.8
colsample_bytree = 0.8
objective = reg:squarederror
random_state = 42
```

---

## 🔮 Final Forecast

The final XGBoost model was retrained using all available historical observations through September 2026.

The forecast horizon covers:

**October 2026 → September 2027**

| Month    | Forecast (USD/oz) |
| -------- | ----------------: |
| Oct 2026 |          4,270.15 |
| Nov 2026 |          4,279.44 |
| Dec 2026 |          4,231.01 |
| Jan 2027 |          4,158.42 |
| Feb 2027 |          4,065.52 |
| Mar 2027 |          3,971.03 |
| Apr 2027 |          3,930.89 |
| May 2027 |          3,887.42 |
| Jun 2027 |          3,882.34 |
| Jul 2027 |          3,865.65 |
| Aug 2027 |          3,880.48 |
| Sep 2027 |      **3,871.93** |

Starting from the last observed price of **4,324.72 USD/oz**, the model forecasts an approximate **10.5% decline** by September 2027.

This should be interpreted as a statistical projection rather than a guaranteed future market price.

---

## 📊 Key Findings

The analysis shows that:

1. The gold-price level is strongly non-stationary.
2. Monthly returns provide a more suitable target for machine-learning forecasting.
3. Simple seasonal assumptions perform poorly over the complete historical period.
4. ARIMA improves upon the baselines but remains less accurate than XGBoost.
5. XGBoost performs particularly well according to MAE and MAPE.
6. LSTM performs competitively but does not consistently outperform XGBoost.
7. GRU performs worse than both XGBoost and LSTM.
8. The final XGBoost forecast indicates a gradual decline during most of the 2026–2027 forecast horizon.

---

## ⚠️ Limitations

This project uses historical gold prices and time-series-derived features only.

The model does **not** explicitly include external factors such as:

* US interest rates
* Inflation
* US Dollar Index
* Central-bank purchases
* Geopolitical events
* Stock-market conditions
* Oil prices
* Macroeconomic indicators

Gold prices can react strongly to such external factors.

Therefore, the forecast should be considered a **data-driven statistical projection**, not financial advice or a certain prediction of future prices.

Another limitation is that the validation period ending in September 2026 was also used during model comparison. Therefore, it should not be described as a completely untouched final test set.

---

## 🛠️ Technologies

* Python
* Pandas
* NumPy
* Matplotlib
* Scikit-learn
* Statsmodels
* XGBoost
* TensorFlow / Keras
* Jupyter Notebook

---

## 📁 Project Structure

```text
gold-price-forecasting/
│
├── data/
│   └── README.md
│
├── notebooks/
│   └── gold_price_forecasting.ipynb
│
├── models/
│   ├── xgboost_gold_return.json
│   └── features.json
│
├── outputs/
│   ├── forecast_2026_2027.csv
│   ├── model_comparison.csv
│   └── final_forecast.png
│
├── src/
│   ├── preprocessing.py
│   ├── features.py
│   ├── train.py
│   └── forecast.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd gold-price-forecasting
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

---

## ▶️ Usage

Open the main notebook:

```text
notebooks/gold_price_forecasting.ipynb
```

The notebook contains the complete workflow:

```text
Data Loading
     ↓
Data Cleaning
     ↓
EDA
     ↓
Stationarity Analysis
     ↓
Baseline Models
     ↓
ARIMA
     ↓
XGBoost
     ↓
LSTM
     ↓
GRU
     ↓
Model Comparison
     ↓
Final XGBoost Model
     ↓
2026–2027 Forecast
```

---

## 📌 Reproducibility

The final XGBoost model uses:

```text
random_state = 42
```

The trained model and forecast results are saved in the `models/` and `outputs/` directories.

The saved XGBoost model can be loaded using:

```python
from xgboost import XGBRegressor

model = XGBRegressor()
model.load_model("models/xgboost_gold_return.json")
```

---

## 📈 Future Improvements

Possible improvements include adding external explanatory variables such as:

* USD exchange-rate indicators
* US Treasury yields
* Federal Funds Rate
* CPI / inflation
* Oil prices
* Stock-market indices
* Gold ETF flows
* Central-bank gold purchases

A multivariate forecasting model could then be developed to evaluate whether these variables improve prediction accuracy.

---

## 👨‍💻 Author

**Yassine Boudawara**

Engineering student — Data & Decision Systems

Interested in:

* Machine Learning
* Deep Learning
* Data Engineering
* Time-Series Forecasting
* Generative AI
* Data Science
