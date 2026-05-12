# API Integration Dashboard

A live data dashboard pulling from three public REST APIs: GitHub, OpenWeatherMap, and The Guardian. Built with vanilla JavaScript and Tailwind CSS.

**[Live Demo](https://alvinlogen.github.io/api-integration-dashboard/)**

## Features

- **GitHub Panel** — Search any GitHub username and view their profile, avatar, bio, stats (repos, followers, account age), location, and blog link
- **Weather Panel** — Search any city for current conditions: temperature, feels like, humidity, wind speed, pressure, and weather icon
- **News Panel** — Loads the latest 6 technology headlines from The Guardian with publication dates and direct links

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

## APIs Used

| API                                                    | Auth          | CORS |
| ------------------------------------------------------ | ------------- | ---- |
| [GitHub REST API](https://docs.github.com/en/rest)     | None required | ✓    |
| [OpenWeatherMap](https://openweathermap.org/api)       | Free API key  | ✓    |
| [The Guardian](https://open-platform.theguardian.com/) | Free API key  | ✓    |

## Setup

1. Clone the repository
2. Copy `config.example.js` to `config.js`
3. Add your free API keys to `config.js` (see links in the table above)
4. Open `index.html` with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) — **do not open directly in the browser**

## Security Notes

- All API strings are escaped with `escapeHtml()` before DOM insertion
- All API-returned URLs are validated with `isSafeUrl()` before use in `href` attributes
- External links use `rel="noopener noreferrer"`
- API keys are stored in a gitignored `config.js` file, never in version control

## Accessibility

- Skip navigation link
- All interactive elements have visible focus rings
- `aria-live="polite"` on all dynamic result regions
- Semantic HTML (`<section>`, `<article>`, `<time>`)
- Keyboard-navigable — all actions reachable via Tab + Enter
