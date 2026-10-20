# 🌦️ Real-Time Weather Forecast & Climate Telemetry App

A responsive weather application built using **HTML, CSS, and JavaScript** that provides real-time weather information and a 5-day forecast for cities around the world using the OpenWeatherMap API.

## 🚀 Features

- 🌍 **Global City Search** — Search for weather information by city name.
- 🌡️ **Current Temperature** — View the current temperature and weather conditions.
- ☁️ **Dynamic Weather Icons** — Display icons based on current weather conditions.
- 💧 **Humidity** — Check the current humidity percentage.
- 💨 **Wind Speed** — View wind speed information.
- 🌡️ **Atmospheric Pressure** — Display atmospheric pressure.
- ☁️ **Cloud Cover** — Check cloud coverage.
- 📅 **5-Day Weather Forecast** — View upcoming weather forecasts.
- ⏳ **Loading Indicator** — Show a loading state while fetching data.
- ⚠️ **Error Handling** — Display helpful messages for invalid city names and network errors.
- 📱 **Responsive Design** — Adapt the interface to different screen sizes.

## 🛠️ Technologies Used

- **HTML5** — Application structure.
- **CSS3** — Styling, Flexbox, Grid, and responsive layouts.
- **JavaScript (ES6+)** — Application logic and asynchronous operations.
- **Fetch API** — Retrieve weather data from the API.
- **Async/Await** — Handle asynchronous requests.
- **OpenWeatherMap API** — Provide current weather and forecast data.

## 📂 Project Structure

```text
weather-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Open the Project

Navigate to the project directory:

```bash
cd weather-app
```

Open the folder in Visual Studio Code.

### 3. Get an OpenWeatherMap API Key

1. Create an account at [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Verify your email if requested.
3. Visit the [API Keys page](https://home.openweathermap.org/api_keys).
4. Copy your API key.

### 4. Configure the API Key

Open `script.js` and replace the placeholder API key with your own:

```javascript
const API_KEY = "5dae2f3edb05c8aafcee265a42b05496";
```

Keep the quotation marks around your key. Do not upload your real API key to a public repository.

### 5. Run the Application

1. Open the project in Visual Studio Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. Search for a city, such as Hyderabad, London, or New York.

## 🌐 API Endpoints Used

The application uses the following OpenWeatherMap endpoints:

| Purpose | Endpoint |
|---|---|
| Geocoding | `https://api.openweathermap.org/geo/1.0/direct` |
| Current Weather | `https://api.openweathermap.org/data/2.5/weather` |
| 5-Day Forecast | `https://api.openweathermap.org/data/2.5/forecast` |

Refer to the [OpenWeatherMap API documentation](https://openweathermap.org/api) for details.

## 🧠 What I Learned

Through this project, I practiced:

- Integrating a third-party REST API into a web application.
- Using JavaScript's Fetch API and async/await.
- Handling API responses and errors.
- Working with JSON data.
- Updating webpage content dynamically using the DOM.
- Implementing responsive layouts with CSS Flexbox and Grid.
- Managing loading indicators and user-friendly error messages.

## 🔒 Security Note

For learning and local development, a client-side API key can be used for testing. However, JavaScript running in the browser is publicly accessible, so a key included in `script.js` can be discovered by users.

For production deployment, move API requests to a backend or serverless function and keep the API key in an environment variable. Configure any available API restrictions and usage limits.

## 🔮 Future Improvements

- Add hourly weather forecasts.
- Display interactive weather charts.
- Support Celsius and Fahrenheit conversion.
- Save favorite cities.
- Add geolocation-based weather.
- Display sunrise and sunset times.
- Add dark and light themes.

## 👨‍💻 Author

**Developer:** Your Name

## 📄 License

This project is intended for educational and portfolio purposes. Add a license file if you plan to distribute the project under a specific open-source license.
