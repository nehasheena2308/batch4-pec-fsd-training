const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

const weatherSection = document.getElementById("weatherSection");

const cityName = document.getElementById("cityName");
const dateElement = document.getElementById("date");

const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");

const weatherIcon = document.getElementById("weatherIcon");

const travelSuggestion =
    document.getElementById("travelSuggestion");

const forecastContainer =
    document.getElementById("forecast");


// ==========================================
// Search Button
// ==========================================

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});


// ==========================================
// Enter Key Search
// ==========================================

cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (!city) {
            showError("Please enter a city name.");
            return;
        }

        getWeather(city);
    }
});


// ==========================================
// Main Weather Function
// ==========================================

async function getWeather(city) {

    showLoading(true);

    hideError();

    try {

        // Get city coordinates
        const locationData = await getCoordinates(city);

        if (!locationData) {
            throw new Error(
                "City not found. Please try another city."
            );
        }

        const {
            latitude,
            longitude,
            name,
            country
        } = locationData;


        // Get weather
        const weatherData = await getWeatherData(
            latitude,
            longitude
        );


        // Display current weather
        displayCurrentWeather(
            name,
            country,
            weatherData
        );


        // Display forecast
        displayForecast(weatherData);


        // Display travel recommendation
        displayTravelSuggestion(
            weatherData.current.weather_code,
            weatherData.current.temperature_2m
        );


        weatherSection.classList.remove("hidden");

    } catch (error) {

        showError(error.message);

        weatherSection.classList.add("hidden");

    } finally {

        showLoading(false);
    }
}


// ==========================================
// Get Coordinates
// ==========================================

async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to search for the city."
        );
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    return data.results[0];
}


// ==========================================
// Get Weather Data
// ==========================================

async function getWeatherData(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to fetch weather information."
        );
    }

    return await response.json();
}


// ==========================================
// Display Current Weather
// ==========================================

function displayCurrentWeather(
    name,
    country,
    data
) {

    const current = data.current;

    cityName.textContent =
        `${name}, ${country}`;

    dateElement.textContent =
        formatDate(new Date());


    temperature.textContent =
        `${Math.round(current.temperature_2m)}°C`;


    description.textContent =
        getWeatherDescription(
            current.weather_code
        );


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;


    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;


    setWeatherIcon(
        current.weather_code,
        weatherIcon
    );
}


// ==========================================
// Display Forecast
// ==========================================

function displayForecast(data) {

    forecastContainer.innerHTML = "";

    const daily = data.daily;

    daily.time.forEach((date, index) => {

        const weatherCode =
            daily.weather_code[index];

        const maxTemp =
            daily.temperature_2m_max[index];

        const minTemp =
            daily.temperature_2m_min[index];


        const card =
            document.createElement("div");

        card.className =
            "forecast-card";


        card.innerHTML = `
            <h3>
                ${formatDay(date)}
            </h3>

            <i class="${getWeatherIconClass(weatherCode)}"></i>

            <div class="temp">
                ${Math.round(maxTemp)}° /
                ${Math.round(minTemp)}°
            </div>

            <p>
                ${getWeatherDescription(weatherCode)}
            </p>
        `;


        forecastContainer.appendChild(card);
    });
}


// ==========================================
// Weather Code Description
// ==========================================

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",

        45: "Foggy",
        48: "Depositing rime fog",

        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",

        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",

        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",

        80: "Light rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",

        95: "Thunderstorm",

        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    };

    return weatherCodes[code] ||
        "Unknown weather";
}


// ==========================================
// Dynamic Weather Icons
// ==========================================

function getWeatherIconClass(code) {

    if (code === 0) {
        return "fa-solid fa-sun";
    }

    if ([1, 2].includes(code)) {
        return "fa-solid fa-cloud-sun";
    }

    if (code === 3) {
        return "fa-solid fa-cloud";
    }

    if ([45, 48].includes(code)) {
        return "fa-solid fa-smog";
    }

    if (
        [51, 53, 55, 61, 63, 65,
         80, 81, 82].includes(code)
    ) {
        return "fa-solid fa-cloud-rain";
    }

    if ([71, 73, 75].includes(code)) {
        return "fa-solid fa-snowflake";
    }

    if ([95, 96, 99].includes(code)) {
        return "fa-solid fa-cloud-bolt";
    }

    return "fa-solid fa-cloud";
}


// ==========================================
// Set Current Weather Icon
// ==========================================

function setWeatherIcon(code, iconElement) {

    iconElement.className =
        getWeatherIconClass(code);

    if (code === 0) {
        iconElement.style.color = "#f59e0b";
    }

    else if ([1, 2, 3].includes(code)) {
        iconElement.style.color = "#64748b";
    }

    else if (
        [51, 53, 55, 61, 63, 65,
         80, 81, 82].includes(code)
    ) {
        iconElement.style.color = "#0284c7";
    }

    else if ([95, 96, 99].includes(code)) {
        iconElement.style.color = "#7c3aed";
    }
}


// ==========================================
// Travel Recommendations
// ==========================================

function displayTravelSuggestion(
    weatherCode,
    temperature
) {

    let suggestion = "";


    // Clear weather
    if (
        weatherCode === 0 &&
        temperature >= 18 &&
        temperature <= 30
    ) {

        suggestion =
            "☀️ Excellent weather for travel! " +
            "It's a great day for sightseeing, " +
            "walking tours, beaches, and outdoor activities.";

    }

    // Hot weather
    else if (temperature > 30) {

        suggestion =
            "🌞 It's quite hot today. " +
            "Carry water, sunscreen, sunglasses, " +
            "and try to avoid outdoor activities " +
            "during the hottest part of the day.";

    }

    // Rain
    else if (
        [51, 53, 55, 61, 63, 65,
         80, 81, 82].includes(weatherCode)
    ) {

        suggestion =
            "🌧️ Rain is expected. " +
            "Consider museums, shopping malls, " +
            "cafés, indoor attractions, and " +
            "carry an umbrella or rain jacket.";

    }

    // Snow
    else if (
        [71, 73, 75].includes(weatherCode)
    ) {

        suggestion =
            "❄️ Snowy conditions are expected. " +
            "Wear warm clothing and waterproof shoes. " +
            "Check road and transport conditions before travelling.";

    }

    // Thunderstorm
    else if (
        [95, 96, 99].includes(weatherCode)
    ) {

        suggestion =
            "⛈️ Thunderstorms are expected. " +
            "Outdoor travel is not recommended. " +
            "Consider indoor attractions and stay updated " +
            "with local weather alerts.";

    }

    // Cold
    else if (temperature < 10) {

        suggestion =
            "🧥 It's cold today. " +
            "Pack warm clothes, a jacket, and comfortable shoes. " +
            "Indoor sightseeing may be more comfortable.";

    }

    // General
    else {

        suggestion =
            "🌤️ The weather looks reasonable for travel. " +
            "Plan a mix of indoor and outdoor activities " +
            "and keep an eye on the forecast.";

    }


    travelSuggestion.textContent =
        suggestion;
}


// ==========================================
// Format Date
// ==========================================

function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


// ==========================================
// Format Forecast Day
// ==========================================

function formatDay(dateString) {

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


// ==========================================
// Loading
// ==========================================

function showLoading(isLoading) {

    if (isLoading) {

        loading.classList.remove("hidden");

    } else {

        loading.classList.add("hidden");
    }
}


// ==========================================
// Error Handling
// ==========================================

function showError(message) {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");
}


function hideError() {

    errorBox.classList.add("hidden");
}


// ==========================================
// Default City
// ==========================================

getWeather("Chennai");