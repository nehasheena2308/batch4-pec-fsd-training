// ======================================
// WEATHER DASHBOARD
// ======================================

// HTML Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");

const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");

const weatherIcon = document.getElementById("weatherIcon");


// ======================================
// SEARCH BUTTON
// ======================================

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    getWeather(city);
});


// ======================================
// ENTER KEY SEARCH
// ======================================

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city === "") {

            showError("Please enter a city name.");

            return;
        }

        getWeather(city);
    }
});


// ======================================
// GET WEATHER
// ======================================

async function getWeather(city) {

    try {

        // Clear previous error
        errorMessage.textContent = "";

        // Show loading
        loading.style.display = "block";

        weatherCard.style.display = "none";

        // ==================================
        // STEP 1: GET CITY COORDINATES
        // ==================================

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to location service.");
        }

        const geoData = await geoResponse.json();

        // Invalid city
        if (!geoData.results || geoData.results.length === 0) {

            throw new Error(
                "City not found. Please enter a valid city name."
            );
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const fullCityName =
            `${location.name}, ${location.country}`;


        // ==================================
        // STEP 2: GET WEATHER DATA
        // ==================================

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error(
                "Unable to fetch weather data."
            );
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // ==================================
        // DISPLAY WEATHER
        // ==================================

        cityName.textContent = fullCityName;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        feelsLike.textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;


        // Get weather condition
        const weatherInfo =
            getWeatherDescription(current.weather_code);

        condition.textContent =
            weatherInfo.description;

        weatherIcon.textContent =
            weatherInfo.icon;


        // Show card
        weatherCard.style.display = "block";

    }

    catch (error) {

        console.error("Weather Error:", error);

        showError(error.message);

    }

    finally {

        // Hide loading
        loading.style.display = "none";

    }
}


// ======================================
// WEATHER CODE CONVERTER
// ======================================

function getWeatherDescription(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "☀️"
        };

    }

    if (code === 1 || code === 2) {

        return {
            description: "Partly Cloudy",
            icon: "🌤️"
        };

    }

    if (code === 3) {

        return {
            description: "Overcast",
            icon: "☁️"
        };

    }

    if (
        code === 45 ||
        code === 48
    ) {

        return {
            description: "Foggy",
            icon: "🌫️"
        };

    }

    if (
        code >= 51 &&
        code <= 67
    ) {

        return {
            description: "Rain",
            icon: "🌧️"
        };

    }

    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            description: "Snow",
            icon: "❄️"
        };

    }

    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            description: "Rain Showers",
            icon: "🌦️"
        };

    }

    if (
        code >= 95 &&
        code <= 99
    ) {

        return {
            description: "Thunderstorm",
            icon: "⛈️"
        };

    }

    return {
        description: "Unknown Weather",
        icon: "🌡️"
    };
}


// ======================================
// ERROR FUNCTION
// ======================================

function showError(message) {

    errorMessage.textContent = message;

    weatherCard.style.display = "none";

}