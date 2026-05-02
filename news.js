async function fetchNews() {
  setLoading("news-result", "Loading headlines...");

  try {
    const url =
      "https://content.guardianapis.com/search" +
      "?section=technology" +
      "&show-fields-trailText" +
      "&page-size=6" +
      "&order-by=newest" +
      "&api-key=" +
      encodeURIComponent(API_KEYS.guardian);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Invalid Guardian API Key. Check config.js");
      }

      if (response.status === 429) {
        throw new Error(
          "Guardian API rate limit reached. Wait a minute and try again.",
        );
      }

      throw new Error("News API error - HTTP status " + response.status + ".");
    }

    const data = await response.json();
    renderNews(data.response.results);
  } catch (err) {
    setError("news-result", err.message);
  }
}

async function renderNews(articles) {
  const container = document.getElementById("news-result");

  if (!articles || articles.length === 0) {
    container.innerHTML =
      '<p class="text-slate-400 text-sm">No headlines available right now.</p>';
    return;
  }

  const articlesHtml = articles
    .map(function (article) {
      const articleUrl = isSafeUrl(article.webUrl)
        ? escapeHtml(article.webUrl)
        : "#";
      const title = escapeHtml(article.webTitle);

      const pubDate = new Date(article.webPublicationDate).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      );

      return (
        '<article class="pb-3 mb-3 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0">' +
        '<a href="' +
        articleUrl +
        '" target="_blank" rel="noopener noreferrer" ' +
        'class="font-medium text-slate-700 hover:text-slate-900 hover:underline ' +
        'text-xs leading-relaxed block mb-1">' +
        title +
        "</a>" +
        '<p class="text-slate-400 text-xs">' +
        pubDate +
        "</p>" +
        "</article>"
      );
    })
    .join("");

  container.innerHTML = articlesHtml;
}
