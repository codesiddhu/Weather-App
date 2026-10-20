
// ==========================================
// SkyCast - Real-Time Weather Application
// ==========================================

// 1. API configuration
const API_KEY = "5dae2f3edb05c8aafcee265a42b05496";

const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_URL = "https://openweathermap.org/img/wn/";

// 2. Select HTML elements
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const weatherContent = document.getElementById("weather-content");
const welcomeMessage = document.getElementById("welcome-message");

const cityName = document.getElementById("city-name");
const countryCode = document.getElementById("country-code");
const currentDate = document.getElementById("current-date");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const weatherDescription = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-icon");

const minTemperature = document.getElementById("min-temperature");
const maxTemperature = document.getElementById("max-temperature");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");
const cloudiness = document.getElementById("cloudiness");

const forecastContainer = document.getElementById("forecast-container");
const lastUpdated = document.getElementById("last-updated");

let requestNumber = 0;


// 3. Display loading state
function setLoading(isLoading) {
    loading.hidden = !isLoading;
    searchButton.disabled = isLoading;
    cityInput.disabled = isLoading;

    searchButton.textContent = isLoading ? "Searching..." : "Search";

    if (isLoading) {
        errorMessage.hidden = true;
        errorMessage.textContent = "";
    }
}


// 4. Display errors
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
}


// 5. Fetch JSON and handle HTTP/API errors
async function fetchJSON(url) {
    const response = await fetch(url);

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("The weather service returned an invalid response.");
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                "API key rejected. Check your OpenWeatherMap API key and activation status."
            );
        }

        if (response.status === 404) {
            throw new Error("The requested city or weather data was not found.");
        }

        if (response.status === 429) {
            throw new Error(
                "Too many API requests. Please wait a little and try again."
            );
        }

        throw new Error(
            data.message || `Weather request failed (${response.status}).`
        );
    }

    return data;
}


// 6. Find city coordinates using geocoding
async function getCityCoordinates(city) {
    const url = new URL(GEO_URL);

    url.search = new URLSearchParams({
        q: city,
        limit: "1",
        appid: API_KEY
    }).toString();

    const locations = await fetchJSON(url);

    if (!Array.isArray(locations) || locations.length === 0) {
        throw new Error(
            "City not found. Check the spelling or try adding the country name."
        );
    }

    return locations[0];
}


// 7. Fetch current weather and five-day forecast
async function getWeather(city) {
    const location = await getCityCoordinates(city);

    const parameters = new URLSearchParams({
        lat: location.lat,
        lon: location.lon,
        appid: API_KEY,
        units: "metric"
    });

    // Run both weather requests concurrently.
    const [current, forecast] = await Promise.all([
        fetchJSON(`${CURRENT_URL}?${parameters}`),
        fetchJSON(`${FORECAST_URL}?${parameters}`)
    ]);

    return { location, current, forecast };
}


// 8. Format temperatures
function formatTemperature(value) {
    return `${Math.round(value)}°C`;
}


// 9. Format dates
function formatDate(date, options = {}) {
    return new Intl.DateTimeFormat(undefined, options).format(date);
}


// 10. Display the current weather
function displayCurrentWeather(location, data) {
    const condition = data.weather?.[0];

    cityName.textContent = location.name;
    countryCode.textContent = location.country || "--";

    const locationParts = [location.state, location.country]
        .filter(Boolean);

    cityName.setAttribute(
        "aria-label",
        `${location.name}${locationParts.length
            ? ", " + locationParts.join(", ")
            : ""}`
    );

    currentDate.textContent = formatDate(new Date(), {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    temperature.textContent = formatTemperature(data.main.temp);
    feelsLike.textContent = formatTemperature(data.main.feels_like);

    weatherDescription.textContent =
        condition?.description
            ? condition.description.charAt(0).toUpperCase() +
              condition.description.slice(1)
            : "Conditions unavailable";

    if (condition?.icon) {
        weatherIcon.src = `${ICON_URL}${condition.icon}@2x.png`;
        weatherIcon.alt = condition.description || "Weather condition";
        weatherIcon.hidden = false;
    } else {
        weatherIcon.hidden = true;
        weatherIcon.removeAttribute("src");
    }

    minTemperature.textContent = formatTemperature(data.main.temp_min);
    maxTemperature.textContent = formatTemperature(data.main.temp_max);

    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = Number(data.wind.speed).toFixed(1);
    pressure.textContent = data.main.pressure;
    cloudiness.textContent = data.clouds.all;
}


// 11. Build a five-day forecast from three-hour data
function getDailyForecast(forecastData) {
    const dailyGroups = new Map();

    forecastData.list.forEach(item => {
        // The API provides forecast timestamps in UTC.
        // Use the city's reported timezone to derive its local date.
        const cityTimestamp = (item.dt + forecastData.city.timezone) * 1000;
        const cityDate = new Date(cityTimestamp);

        const dateKey = [
            cityDate.getUTCFullYear(),
            String(cityDate.getUTCMonth() + 1).padStart(2, "0"),
            String(cityDate.getUTCDate()).padStart(2, "0")
        ].join("-");

        if (!dailyGroups.has(dateKey)) {
            dailyGroups.set(dateKey, []);
        }

        dailyGroups.get(dateKey).push(item);
    });

    const days = Array.from(dailyGroups.entries()).map(([dateKey, items]) => {
        // Prefer the forecast nearest noon for the representative icon.
        const representative = [...items].sort((a, b) => {
            const timeA = new Date((a.dt + forecastData.city.timezone) * 1000)
                .getUTCHours();

            const timeB = new Date((b.dt + forecastData.city.timezone) * 1000)
                .getUTCHours();

            return Math.abs(timeA - 12) - Math.abs(timeB - 12);
        })[0];

        const temperatures = items.map(item => item.main.temp);

        return {
            dateKey,
            representative,
            min: Math.min(...temperatures),
            max: Math.max(...temperatures)
        };
    });

    // Display five forecast days, including today when available.
    return days.slice(0, 5);
}


// 12. Render the five-day forecast
function displayForecast(data) {
    forecastContainer.replaceChildren();

    const dailyForecast = getDailyForecast(data);

    if (dailyForecast.length === 0) {
        forecastContainer.textContent = "Forecast data is unavailable.";
        return;
    }

    dailyForecast.forEach(day => {
        const item = day.representative;
        const condition = item.weather?.[0];

        const card = document.createElement("article");
        card.className = "forecast-day";

        const dayDate = new Date(`${day.dateKey}T12:00:00Z`);

        const dayName = document.createElement("p");
        dayName.className = "forecast-day-name";
        dayName.textContent = formatDate(dayDate, {
            weekday: "short",
            timeZone: "UTC"
        });

        const dateLabel = document.createElement("p");
        dateLabel.className = "forecast-date";
        dateLabel.textContent = formatDate(dayDate, {
            day: "numeric",
            month: "short",
            timeZone: "UTC"
        });

        const icon = document.createElement("img");
        icon.className = "forecast-icon";
        icon.src = `${ICON_URL}${condition?.icon || "01d"}.png`;
        icon.alt = condition?.description || "Forecast weather";
        icon.loading = "lazy";

        const description = document.createElement("p");
        description.className = "forecast-description";
        description.textContent = condition?.main || "Unknown";

        const highLow = document.createElement("p");
        highLow.className = "forecast-temperature";
        highLow.textContent =
            `${Math.round(day.max)}° / ${Math.round(day.min)}°`;

        card.append(
            dayName,
            dateLabel,
            icon,
            description,
            highLow
        );

        forecastContainer.appendChild(card);
    });
}


// 13. Update the complete weather interface
function displayWeather(result) {
    displayCurrentWeather(result.location, result.current);
    displayForecast(result.forecast);

    lastUpdated.textContent =
        `Weather retrieved at ${formatDate(new Date(), {
            hour: "2-digit",
            minute: "2-digit"
        })}.`;

    weatherContent.hidden = false;
    welcomeMessage.hidden = true;
}


// 14. Handle search submission
searchForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" || !API_KEY.trim()) {
        showError(
            "Please add your OpenWeatherMap API key in script.js before searching."
        );
        return;
    }

    const thisRequest = ++requestNumber;

    setLoading(true);
    weatherContent.hidden = true;
    welcomeMessage.hidden = true;

    try {
        const result = await getWeather(city);

        // Ignore stale results if another request has started.
        if (thisRequest !== requestNumber) return;

        displayWeather(result);

    } catch (error) {
        if (thisRequest !== requestNumber) return;

        console.error("Weather request failed:", error);

        weatherContent.hidden = true;
        welcomeMessage.hidden = false;

        showError(
            error instanceof TypeError
                ? "Unable to connect to the weather service. Check your internet connection and try again."
                : error.message || "Something went wrong. Please try again."
        );

    } finally {
        if (thisRequest === requestNumber) {
            setLoading(false);
        }
    }
});


// 15. Show an initial message
welcomeMessage.hidden = false;
weatherContent.hidden = true;
setLoading(false);
