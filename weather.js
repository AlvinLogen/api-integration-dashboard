let weatherLoading = false;

async function fetchWeather(city) {
  const validation = validateInput(city, "city name", 85);

  if (!validation.valid) {
    setError("weather-result", validation.message);
    return;
  }

  city = validation.value;

  if (weatherLoading) return;

  weatherLoading = true;

  const btn = document.getElementById("weather-search-btn");

  if (btn) {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  }

  setLoading("weather-result", "Fetching weather data...");

  const forecastEl = document.getElementById("weather-forecast");
  if (forecastEl) forecastEl.innerHTML = "";

  try {
    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      "?q=" +
      encodeURIComponent(city) +
      "&appid=" +
      API_KEYS.openWeather +
      "&units=metric";
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'City"' +
            escapeHtml(city) +
            '" was not found. Check the spelling and try again.',
        );
      }

      if (response.status === 401) {
        throw new Error(
          "Invalid OpenWeatherMap API Key. Check config.js. " +
            "New keys can take up to 10 minutes to activate.",
        );
      }

      if (response.status === 429) {
        throw new Error(
          "Too many requests. The free tier allows 60 calls per minute. Wait and try again.",
        );
      }

      throw new Error(
        "Weather API error - HTTP status " + response.status + ".",
      );
    }

    const data = await response.json();
    renderWeather(data);
    fetchForecast(city);
  } catch (err) {
    const message =
      err.message === "Failed to fetch"
        ? "Could not connect. Check your internet connection and try again."
        : err.message;
    setError("weather-result", message, function () {
      fetchWeather(document.getElementById("weather-input").value.trim());
    });
  } finally {
    weatherLoading = false;
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }
}

async function renderWeather(data) {
  const container = document.getElementById("weather-result");

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const description = escapeHtml(data.weather[0].description);
  const cityName = escapeHtml(data.name);
  const country = escapeHtml(data.sys.country);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const pressure = data.main.pressure;

  const iconCode = escapeHtml(data.weather[0].icon);
  const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

  container.innerHTML =
    '<div class="text-center mb-4">' +
    '<div class="flex items-center justify-center gap-1">' +
    '<img src="' +
    iconUrl +
    '" alt="' +
    description +
    '" class="w-14 h-14">' +
    '<span class="text-5xl font-bold text-slate-800">' +
    temp +
    "°</span>" +
    "</div>" +
    '<p class="text-slate-600 capitalize text-sm mt-1">' +
    description +
    "</p>" +
    '<p class="font-semibold text-slate-700 mt-1">' +
    cityName +
    ", " +
    country +
    "</p>" +
    "</div>" +
    '<div class="grid grid-cols-2 gap-2 text-sm">' +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-600 text-xs">Feels Like</p>' +
    '<p class="font-semibold text-slate-700">' +
    feelsLike +
    "°C</p>" +
    "</div>" +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-600 text-xs">Humidity</p>' +
    '<p class="font-semibold text-slate-700">' +
    humidity +
    "%</p>" +
    "</div>" +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-600 text-xs">Wind</p>' +
    '<p class="font-semibold text-slate-700">' +
    windSpeed +
    " m/s</p>" +
    "</div>" +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-600 text-xs">Pressure</p>' +
    '<p class="font-semibold text-slate-700">' +
    pressure +
    " hPa</p>" +
    "</div>" +
    "</div>";
}

async function fetchForecast(city) {
  const url =
    "https://api.openweathermap.org/data/2.5/forecast" +
    "?q=" +
    encodeURIComponent(city) +
    "&appid=" +
    encodeURIComponent(API_KEYS.openWeather) +
    "&units=metric";

  try {
    const response = await fetch(url);
    if (!response.ok) return;

    const data = await response.json();
    renderForecast(data.list);
  } catch (err) {}
}

function renderForecast(list) {
  const container = document.getElementById("weather-forecast");
  if (!container || !list || list.length === 0) return;

  const dailyEntries = list.filter(function (entry) {
    return entry.dt_txt && entry.dt_txt.includes("12:00:00");
  });

  const days = dailyEntries.slice(0, 5);

  if (days.length === 0) {
    container.innerHTML = "";
    return;
  }

  const foreCastItems = days
    .map(function (entry) {
      const date = new Date(entry.dt * 1000);
      const dayName = escapeHtml(
        date.toLocaleDateString("en-GB", {
          weekday: "short",
        }),
      );
      const temp = Math.round(entry.main.temp);
      const iconCode = escapeHtml(entry.weather[0].icon);
      const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
      const desc = escapeHtml(entry.weather[0].description);

      return (
        '<div class="flex flex-col items-center gap-0.5 bg-sky-50 rounded-lg p-2 min-w-0">' +
        '<span class="text-xs font-semibold text-slate-600">' +
        dayName +
        "</span>" +
        '<img src="' +
        iconUrl +
        '" alt="' +
        desc +
        '" class="w-8 h-8" title="' +
        desc +
        '">' +
        '<span class="text-sm font-bold text-slate-800">' +
        temp +
        "°</span>" +
        "</div>"
      );
    })
    .join("");

  container.innerHTML =
    '<div class="mt-4">' +
    '<h3 class="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">5-Day Forecast</h3>' +
    '<div class="grid gird-cols-5 gap-1">' +
    foreCastItems +
    "</div>" +
    "</div>";
}
