// ===== Configuration =====
const apikey = "820ffd779c4b4a3aa4d54155252808"; // WeatherAPI.com
const apiUrl = "https://api.weatherapi.com/v1/";

// ===== DOM =====
const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const geoBtn      = document.getElementById("geoBtn");
const themeToggle = document.getElementById("themeToggle");
const unitToggle  = document.getElementById("unitToggle");
const recentSelect= document.getElementById("recentSelect");

const weatherDiv  = document.getElementById("weather");
const errorMsg    = document.getElementById("errorMsg");
const extremeAlert= document.getElementById("extremeAlert");
const forecastDiv = document.getElementById("forecast");

const cityEl      = document.getElementById("cityEl");
const tempEl      = document.getElementById("tempEl");
const conditionEl = document.getElementById("conditionEl");
const humidityEl  = document.getElementById("humidityEl");
const windEl      = document.getElementById("windEl");
const feelsEl     = document.getElementById("feelsEl");
const uvEl        = document.getElementById("uvEl");
const weatherIcon = document.getElementById("weatherIcon");

// ===== State =====
let isCelsius = (localStorage.getItem("unit") || "C") === "C";
let lastTemps = { c: null, f: null }; // today's temp for unit toggle

// ===== LocalStorage helpers =====
const LS_KEYS = {
  LAST_CITY: "lastCity",
  RECENTS:   "recentCities",
  THEME:     "theme",
  UNIT:      "unit"
};

function saveLastCity(city) {
  localStorage.setItem(LS_KEYS.LAST_CITY, city);
}

function loadLastCity() {
  return localStorage.getItem(LS_KEYS.LAST_CITY) || "Mumbai";
}

function getRecentCities() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.RECENTS) || "[]");
  } catch {
    return [];
  }
}
function setRecentCities(arr) {
  localStorage.setItem(LS_KEYS.RECENTS, JSON.stringify(arr));
}
function updateRecentCities(city) {
  // normalize name
  const name = String(city).trim();
  if (!name) return;
  let list = getRecentCities().filter(c => c.toLowerCase() !== name.toLowerCase());
  list.unshift(name);
  if (list.length > 6) list = list.slice(0, 6);
  setRecentCities(list);
  renderRecentCities();
}
function renderRecentCities() {
  const list = getRecentCities();
  if (!list.length) {
    recentSelect.classList.add("hidden");
    recentSelect.innerHTML = "";
    return;
  }
  recentSelect.classList.remove("hidden");
  recentSelect.innerHTML = `<option value="">Recent</option>` + 
    list.map(c => `<option value="${c}">${c}</option>`).join("");
}

// ===== Theme (dark/light) with persistence + bg image swap =====
function setTheme(dark) {
  const root = document.documentElement; // Tailwind dark on <html>
  if (dark) {
    root.classList.add("dark");
    localStorage.setItem(LS_KEYS.THEME, "dark");
    themeToggle.textContent = "🌞";
    document.body.style.setProperty("--bg-image", "url('images/stars.png')");
  } else {
    root.classList.remove("dark");
    localStorage.setItem(LS_KEYS.THEME, "light");
    themeToggle.textContent = "🌙";
    document.body.style.setProperty("--bg-image", "url('images/cloudy.png')");
  }
}
(function initTheme() {
  setTheme(localStorage.getItem(LS_KEYS.THEME) === "dark");
})();

// ===== Unit toggle (today only) =====
function setUnit(useC) {
  isCelsius = useC;
  localStorage.setItem(LS_KEYS.UNIT, useC ? "C" : "F");
  unitToggle.textContent = useC ? "°C" : "°F";
  // Update only today's temp display if we have it
  if (lastTemps.c != null && lastTemps.f != null) {
    tempEl.textContent = useC ? `${Math.round(lastTemps.c)}°C` : `${Math.round(lastTemps.f)}°F`;
    feelsEl.textContent = useC ? Math.round(lastTemps.c) : Math.round(lastTemps.f);
  }
}
(function initUnit() {
  const saved = (localStorage.getItem(LS_KEYS.UNIT) || "C") === "C";
  setUnit(saved);
})();

// ===== Background by condition (rainy effect) =====
function applyBackground(conditionText) {
  const t = (conditionText || "").toLowerCase();
  document.body.classList.toggle("is-rainy", t.includes("rain"));
}

// ===== Fetch & render weather =====
async function checkWeather(query) {
  try {
    errorMsg.classList.add("hidden");
    extremeAlert.classList.add("hidden");

    const resp = await fetch(`${apiUrl}forecast.json?key=${apikey}&q=${encodeURIComponent(query)}&days=5&aqi=no&alerts=no`);
    if (!resp.ok) throw new Error("City not found");

    const data = await resp.json();

    // Today (current)
    const name = data.location.name;
    const condText = data.current.condition.text;  // <- condition name
    const tempC = data.current.temp_c;
    const tempF = data.current.temp_f;
    const feelsC = data.current.feelslike_c;
    const feelsF = data.current.feelslike_f;

    cityEl.textContent = name;
    conditionEl.textContent = condText; // show condition name under temp
    lastTemps = { c: tempC, f: tempF }; // store for unit toggle
    tempEl.textContent = isCelsius ? `${Math.round(tempC)}°C` : `${Math.round(tempF)}°F`;
    feelsEl.textContent = isCelsius ? Math.round(feelsC) : Math.round(feelsF);
    humidityEl.textContent = data.current.humidity;
    windEl.textContent = data.current.wind_kph;
    uvEl.textContent = data.current.uv;

    // Extreme heat alert
    if (tempC > 40) extremeAlert.classList.remove("hidden");

    // Main icon (use your local sprite set by condition)
    const cond = condText.toLowerCase();
    if (cond.includes("rain"))      weatherIcon.src = "images/rain.png";
    else if (cond.includes("clear"))weatherIcon.src = "images/clear.png";
    else if (cond.includes("cloud"))weatherIcon.src = "images/cloudy.png";
    else if (cond.includes("drizzle")) weatherIcon.src = "images/drizzle.png";
    else if (cond.includes("mist") || cond.includes("fog")) weatherIcon.src = "images/mist.png";
    else weatherIcon.src = "images/weather-icon.png";

    // Background mood
    applyBackground(condText);

    // Show today card
    weatherDiv.classList.remove("hidden");

    // Forecast (5 days)
    forecastDiv.innerHTML = "";
    data.forecast.forecastday.forEach(day => {
      const d  = day.date;
      const ic = `https:${day.day.condition.icon}`; // WeatherAPI hosted icon
      const avgC = Math.round(day.day.avgtemp_c);
      const maxWind = Math.round(day.day.maxwind_kph);
      const avgHum  = Math.round(day.day.avghumidity);

      // dynamic bg by condition
      let bg = "bg-gray-200";
      const tx = day.day.condition.text.toLowerCase();
      if (tx.includes("sun") || tx.includes("clear")) bg = "bg-yellow-200";
      else if (tx.includes("rain")) bg = "bg-blue-200";
      else if (tx.includes("cloud")) bg = "bg-gray-300";

      forecastDiv.innerHTML += `
        <div class="${bg} dark:bg-gray-700 rounded-xl shadow p-4 text-center card-hover">
          <p class="font-semibold">${d}</p>
          <img src="${ic}" alt="" class="w-12 h-12 mx-auto my-1">
          <p class="text-sm">${day.day.condition.text}</p>
          <p class="mt-1">🌡 ${avgC}°C</p>
          <p>💨 ${maxWind} km/h</p>
          <p>💧 ${avgHum}%</p>
        </div>
      `;
    });

    // Save city
    saveLastCity(name);
    updateRecentCities(name);

  } catch (e) {
    weatherDiv.classList.add("hidden");
    forecastDiv.innerHTML = "";
    errorMsg.textContent = "❌ Invalid city or network error. Please try again.";
    errorMsg.classList.remove("hidden");
  }
}

// ===== Events =====
searchBtn.addEventListener("click", () => {
  const v = cityInput.value.trim();
  if (!v) {
    errorMsg.textContent = "⚠️ Please enter a city name";
    errorMsg.classList.remove("hidden");
    return;
  }
  checkWeather(v);
});

// Enter key to search
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Geolocation
geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    errorMsg.textContent = "⚠️ Geolocation is not supported in this browser.";
    errorMsg.classList.remove("hidden");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const q = `${pos.coords.latitude},${pos.coords.longitude}`;
      checkWeather(q);
    },
    () => {
      errorMsg.textContent = "⚠️ Location access denied.";
      errorMsg.classList.remove("hidden");
    }
  );
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(!isDark);
});

// Unit toggle (today only)
unitToggle.addEventListener("click", () => {
  setUnit(!isCelsius);
});

// Recent cities dropdown
recentSelect.addEventListener("change", () => {
  const v = recentSelect.value;
  if (v) checkWeather(v);
});

// ===== Init =====
renderRecentCities();
checkWeather(loadLastCity());
