
let forecastData = [];
let forecastChart = null;


// ============================================================
// NAVIGATION
// ============================================================

function showSection(sectionId, button) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");


    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");


    const titles = {
        dashboard: "Dashboard",
        forecast: "Forecast",
        model: "Model Performance"
    };

    document.getElementById("page-title").textContent =
        titles[sectionId];
}


// ============================================================
// LOAD FORECAST
// ============================================================

async function loadForecast() {

    try {

        const response = await fetch("/api/forecast");

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        forecastData = data.forecast;


        // Last actual price

        const lastActual =
            data.last_actual_price;


        document.getElementById("last-price").textContent =
            `$${lastActual.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;


        // Forecast horizon

        document.getElementById("horizon").textContent =
            `${forecastData.length} Months`;


        if (forecastData.length > 0) {

            const lastForecast =
                forecastData[forecastData.length - 1]
                    .Predicted_USD;


            document.getElementById("forecast-price").textContent =
                `$${lastForecast.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}`;


            const change =
                ((lastForecast - lastActual) /
                lastActual) * 100;


            const changeElement =
                document.getElementById("expected-change");


            changeElement.textContent =
                `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

        }


        createTable();

        createChart();

    }

    catch (error) {

        console.error(error);

        document.getElementById("last-price").textContent =
            "API Error";

    }
}


// ============================================================
// TABLE
// ============================================================

function createTable() {

    const table =
        document.getElementById("forecast-table");


    table.innerHTML = "";


    let previousPrice = null;


    forecastData.forEach((point, index) => {

        const price =
            point.Predicted_USD;


        let signal = "—";
        let signalClass = "";


        if (previousPrice !== null) {

            if (price > previousPrice) {

                signal = "Bullish ↑";
                signalClass = "up";

            } else {

                signal = "Bearish ↓";
                signalClass = "down";

            }

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>
                ${formatDate(point.Date)}
            </td>

            <td>
                ${(point.Predicted_Return * 100).toFixed(2)}%
            </td>

            <td>
                <strong>
                    $${price.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}
                </strong>
            </td>

            <td>
                <span class="signal ${signalClass}">
                    ${signal}
                </span>
            </td>

        `;


        table.appendChild(row);


        previousPrice = price;

    });
}


// ============================================================
// CHART
// ============================================================

function createChart() {

    const canvas =
        document.getElementById("forecastChart");


    const labels =
        forecastData.map(
            point => formatDate(point.Date)
        );


    const prices =
        forecastData.map(
            point => point.Predicted_USD
        );


    if (forecastChart !== null) {

        forecastChart.destroy();

    }


    forecastChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label:
                            "Predicted Gold Price",

                        data: prices,

                        borderWidth: 3,

                        tension: 0.35,

                        pointRadius: 4,

                        pointHoverRadius: 7,

                        fill: true,

                        backgroundColor:
                            "rgba(245, 185, 66, 0.08)",

                        borderColor:
                            "#f5b942",

                        pointBackgroundColor:
                            "#f5b942"

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                interaction: {

                    intersect: false,

                    mode: "index"

                },


                plugins: {

                    legend: {

                        labels: {

                            color: "#94a3b8"

                        }

                    }

                },


                scales: {

                    x: {

                        grid: {

                            color:
                                "rgba(255,255,255,0.04)"

                        },

                        ticks: {

                            color: "#94a3b8"

                        }

                    },


                    y: {

                        grid: {

                            color:
                                "rgba(255,255,255,0.04)"

                        },

                        ticks: {

                            color: "#94a3b8",

                            callback: function(value) {

                                return "$" +
                                    value.toLocaleString();

                            }

                        }

                    }

                }

            }

        });
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            year: "numeric"
        }
    );
}


// ============================================================
// DOWNLOAD CSV
// ============================================================

function downloadForecast() {

    window.location.href =
        "/outputs/forecast_2026_2027.csv";
}


// ============================================================
// INITIALIZE
// ============================================================

loadForecast();
