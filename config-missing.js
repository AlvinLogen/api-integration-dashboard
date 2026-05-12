// This file is loaded as a fallback when config.js is not found.
// It provides placeholder API_KEYS and populates each panel with setup instructions.

window.addEventListener("DOMContentLoaded", function () {
  // Check if config.js loaded successfully
  if (typeof API_KEYS === "undefined") {
    var panels = ["github-result", "weather-result", "news-result"];
    var message =
      '<div class="big-amber-50 border-amber-200 text-amber-800 rounded-lg p-3 text-xs">' +
      "<strong>Local setup required</strong> Clone the repository, copy " +
      "<code>config.example.js</code> to <code>config.js</code>, " +
      "and add your free API keys to run this dashboard locally." +
      "</div>";

    panels.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = message;
    });
  }
});
