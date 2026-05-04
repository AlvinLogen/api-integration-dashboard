# API Integration Dashboard

A live data dashboard pulling from three public REST APIs: GitHub, OpenWeatherMap, and The Guardian. Built with vanilla JavaScript and Tailwind CSS.

## Features

- **GitHub Panel** — Search any GitHub username and view their profile, avatar, bio, stats (repos, followers, account age), location, and blog link
- **Weather Panel** — Search any city for current conditions: temperature, feels like, humidity, wind speed, pressure, and weather icon
- **News Panel** — Loads the latest 6 technology headlines from The Guardian with publication dates and direct links
- Each panel fails independently — one API error doesn't affect the other two
- Last searches (GitHub username + city) are remembered via localStorage and restored on next visit
- Retry buttons on error states
- Fully keyboard-navigable with ARIA live regions for screen readers
- Responsive: single column on mobile, three columns on desktop (Tailwind CSS)

## Tech Stack

- **HTML5** — semantic markup, ARIA attributes, skip link
- **Tailwind CSS** (via CDN) — utility-first styling, responsive grid, all visual design
- **JavaScript (ES2017+)** — `async/await`, `fetch()`, DOM manipulation, localStorage
- **REST APIs** — GitHub API (unauthenticated), OpenWeatherMap, The Guardian

## Project Structure

```
api-dashboard/
├── index.html          — Layout and Tailwind CDN
├── utils.js            — Shared helpers: escapeHtml, setLoading, setError, isSafeUrl
├── github.js           — GitHub API fetch and render
├── weather.js          — OpenWeatherMap fetch and render
├── news.js             — The Guardian fetch and render with .map()
├── app.js              — Event listeners, localStorage, initialisation
├── config.js           — API keys (gitignored)
├── config.example.js   — Key template (committed)
└── .gitignore
```

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/api-dashboard.git
   cd api-dashboard
   ```
2. Copy the config template:
   ```bash
   copy config.example.js config.js
   ```
3. Edit `config.js` and add your free API keys:
   - **OpenWeatherMap**: https://openweathermap.org/api
   - **The Guardian**: https://open-platform.theguardian.com/access/
4. Open with Live Server (VS Code extension) — do NOT open `index.html` directly as a file

## Security Notes

- `config.js` is gitignored — API keys never enter version control
- All API-returned strings are escaped with `escapeHtml()` before insertion into innerHTML
- All external links include `rel="noopener noreferrer"`
- All API-returned URLs are validated with `isSafeUrl()` before use in `href`
