// --GitHub Panel--
document
  .getElementById("github-search-btn")
  .addEventListener("click", function () {
    const username = document.getElementById("github-input").value.trim();

    if (isBlank(username)) {
      setError("github-result", "Please enter a GitHub username.");
      return;
    }

    saveLastSearch("github", username);
    fetchGitHubUser(username);
  });

document
  .getElementById("github-input")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      document.getElementById("github-search-btn").click();
    }
  });

// --Weather Panel--
document
  .getElementById("weather-search-btn")
  .addEventListener("click", function () {
    const city = document.getElementById("weather-input").value.trim();

    if (isBlank(city)) {
      setError("weather-result", "Please enter a city name");
      return;
    }

    saveLastSearch("weather", city);
    fetchWeather(city);
  });

document
  .getElementById("weather-input")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      document.getElementById("weather-search-btn").click();
    }
  });

// --News Panel--
const newsInput = document.getElementById("news-input");

document
  .getElementById("news-refresh-btn")
  .addEventListener("click", function () {
    const topic = newsInput.value.trim() || "technology";
    saveLastSearch("news", topic);
    fetchNews(topic);
  });

newsInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("news-refresh-btn").click();
  }
});

// -- Persist Search Request
function saveLastSearch(panel, value) {
  // Read existing searches, merge new search and write back
  const existing = localStorage.getItem("dashboard-searches");
  const searches = existing ? JSON.parse(existing) : {};

  searches[panel] = value;
  localStorage.setItem("dashboard-searches", JSON.stringify(searches));
}

function loadLastSearches() {
  const existing = localStorage.getItem("dashboard-searches");
  if (!existing) return;

  const searches = JSON.parse(existing);

  // Restore inputs and auto-fetch if saved value exists
  if (searches.github && !isBlank(searches.github)) {
    document.getElementById("github-input").value = searches.github;
    fetchGitHubUser(searches.github);
  }

  if (searches.weather && !isBlank(searches.weather)) {
    document.getElementById("weather-input").value = searches.weather;
    fetchWeather(searches.weather);
  }

  if (searches.news) {
    const newsInput = document.getElementById("news-input");
    if (newsInput) newsInput.value = searches.news;
  }

  fetchNews(searches.news || "technology");
}

loadLastSearches();
if (!localStorage.getItem("dashboard-searches")) {
  fetchNews("technology");
}
