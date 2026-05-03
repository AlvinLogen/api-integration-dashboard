async function fetchWeather(city) {
  setLoading("weather-result", "Fetching weather data...");

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
  } catch (err) {
    setError("weather-result", err.message, function () {
      fetchWeather(document.getElementById("weather-input").value.trim());
    });
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
    '<p class="text-slate-500 capitalize text-sm mt-1">' +
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
    '<p class="text-slate-400 text-xs">Feels Like</p>' +
    '<p class="font-semibold text-slate-700">' +
    feelsLike +
    "°C</p>" +
    "</div>" +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-400 text-xs">Humidity</p>' +
    '<p class="font-semibold text-slate-700">' +
    humidity +
    "%</p>" +
    "</div>" +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-400 text-xs">Wind</p>' +
    '<p class="font-semibold text-slate-700">' +
    windSpeed +
    " m/s</p>" +
    "</div>" +
    '<div class="bg-sky-50 rounded-lg p-2 text-center">' +
    '<p class="text-slate-400 text-xs">Pressure</p>' +
    '<p class="font-semibold text-slate-700">' +
    pressure +
    " hPa</p>" +
    "</div>" +
    "</div>";
}
