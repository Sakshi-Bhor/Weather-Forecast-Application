
# 🌦️ Weather Forecast Application

## 📌 Overview
A responsive Weather Forecast Application built with **HTML, Tailwind CSS, and JavaScript**.  
It fetches real-time weather data using [WeatherAPI](https://www.weatherapi.com/) and displays:
- Current weather conditions  
- Location-based forecasts (via search or geolocation)  
- Extended 5-day forecast  
- Unit toggle (°C/°F)  
- Dark/Light theme toggle  
- Recently searched cities dropdown  
- Dynamic backgrounds based on weather condition  

---

## 📂 Repository
👉 [View on GitHub](https://github.com/Sakshi-Bhor/Weather-Forecast-Application.git)


## 🚀 Features
- **Search by City Name**: Enter any city to fetch its weather.  
- **Geolocation Support**: Detect current location weather.  
- **Temperature Toggle**: Switch between Celsius and Fahrenheit.  
- **Dark/Light Theme**: One-click toggle with local storage persistence.  
- **Extended Forecast**: 5-day weather cards with animations.  
- **Dynamic Backgrounds**: Sunny, Rainy, Cloudy themes.  
- **Error Handling**: Friendly messages for invalid inputs or API errors.  
- **Responsive UI**: Works on Desktop, iPad Mini, and iPhone SE.  

---

## 🛠️ Technologies
- **HTML5** – Structure  
- **Tailwind CSS (CDN)** – Styling & Responsiveness  
- **Vanilla JavaScript (ES6)** – Logic & API handling  
- **WeatherAPI** – Weather Data Provider  

---

## 📂 Project Structure
```
weather-app/
│── index.html        # Main HTML
│── style.css         # Custom CSS animations & overrides
│── app.js            # Core JS (weather, forecast, theme, geolocation)
│── tailwind.config.js (if using build, optional)
│── /images/          # Weather icons (clear.png, rain.png, etc.)
│── README.md         # Documentation
```

---

## ⚙️ Setup Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. Open `index.html` in any modern browser.  
   > ⚡ Tailwind is loaded via CDN → No build required.  

3. Replace the `apikey` inside **app.js** with your [WeatherAPI key](https://www.weatherapi.com/).  

---

## 🎮 Usage
- 🔍 Search city → Get current + 5-day forecast  
- 📍 Click location button → Auto-detect your location  
- 🌙 Toggle → Switch between light/dark mode  
- 🌡️ Toggle C/F → Switch temperature units  
- 📜 Dropdown → Quickly access recently searched cities  

---

## ✅ Suggested Commit Messages

1. chore: initialize project with base HTML, CSS, JS files  
2. feat: add Tailwind CDN setup and responsive navbar  
3. feat: integrate WeatherAPI for current weather data  
4. feat: implement city search input and fetch weather by city  
5. feat: add geolocation support for current location weather  
6. feat: add local storage for last searched city persistence  
7. feat: create dark/light theme toggle with local storage  
8. feat: implement °C/°F temperature unit toggle  
9. feat: show extended 5-day forecast with responsive cards  
10. feat: add recently searched cities dropdown with selection  
11. fix: improve error handling with friendly UI messages  
12. docs: add polished README with setup instructions and features  

---

## 📜 License
This project is open-source and free to use for educational purposes.






