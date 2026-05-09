// Depends on: utils.js, config.js (API_KEYS.guardian)
// API docs: https://open-platform.theguardian.com/documentation/

async function fetchNews(topic) {
  setLoading("news-result", "Fetching headlines...");

  // Clear the article count while loading
  const countEl = document.getElementById("news-count");
  if (countEl) countEl.textContent = "";

  try {
    const url =
      "https://content.guardianapis.com/search" +
      "?q=" +
      encodeURIComponent(topic) +
      "&section=technology|science|business" +
      "&show-fields=thumbnail,trailText" +
      "&page-size=6" +
      "&order-by=newest" +
      "&api-key=" +
      encodeURIComponent(API_KEYS.guardian);

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid Guardian API key. Check config.js");
      }

      if (response.status === 429) {
        throw new Error(
          "Guardian API rate limit reached. Wait a minute and try again.",
        );
      }

      throw new Error(
        "Guardian API error - HTTP status " + response.status + ".",
      );
    }

    const data = await response.json();
    const articles = data.response.results;

    if (!articles || articles.length === 0) {
      document.getElementById("news-result").innerHTML =
        '<p class="text-slate-400 text-sm italic">No articles found for "' +
        escapeHtml(topic) +
        '". Try a different topic.</p>';
      return;
    }

    if (countEl) {
      countEl.textContent =
        articles.length + " article " + (articles.length !== 1 ? "s" : "");
    }

    renderNews(articles);
  } catch (err) {
    setError("news-result", "err.message");
    const countEl = document.getElementById("news-count");
    if (countEl) countEl.textContent = "";
  }
}

function renderNews(articles) {
  const container = document.getElementById("news-result");

  const articleCards = articles
    .map(function (article) {
      const title = escapeHtml(article.webTitle);
      const url = isSafeUrl(article.webUrl) ? escapeHtml(article.webUrl) : "#";
      const date = new Date(article.webPublicationDate);
      const dateStr = escapeHtml(
        date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      );

      const trailText =
        article.fields && article.fields.trailText
          ? escapeHtml(article.fields.trailText)
          : "";

      return (
        '<article class="border-b border-slate-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">' +
        "<a href=" +
        url +
        '" target="_blank" rel="noopener noreferrer" class="group block">' +
        '<h3 class="text-sm font-medium text-slate-800 group-hover:underline leading-snug">' +
        title +
        "</h3>" +
        (trailText
          ? '<p class="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2">' +
            trailText +
            "</p>"
          : "") +
        '<time class="text-slate-400 text-xs mt-1 block" datetime="' +
        escapeHtml(article.webPublicationDate) +
        '">' +
        dateStr +
        "</time>" +
        "</a>" +
        "</article>"
      );
    })
    .join("");

  container.innerHTML = "<div>" + articleCards + "</div>";
}
