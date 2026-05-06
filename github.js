async function fetchGitHubUser(username) {
  setLoading("github-result", "Fetching GiHub profile...");

  try {
    const url = "https://api.github.com/users/" + encodeURIComponent(username);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'User "' + escapeHtml(username) + '" was not found on GitHub.',
        );
      }
      if (response.status === 403) {
        throw new Error(
          "GitHub rate limite reached (60 requests/hour). Wat a minute and try again.",
        );
      }
      throw new Error(
        "GitHub API error - HTTP status " + response.status + ".",
      );
    }

    const data = await response.json();
    renderGitHubProfile(data);
    fetchGitHubRepos(data.login);
  } catch (err) {
    setError("github-result", err.message, function () {
      fetchGitHubUser(document.getElementById("github-input").value.trim());
    });
  }
}

function renderGitHubProfile(data) {
  const container = document.getElementById("github-result");

  const profileUrl = isSafeUrl(data.html_url) ? escapeHtml(data.html_url) : "#";
  const avatarUrl = isSafeUrl(data.avatar_url)
    ? escapeHtml(data.avatar_url)
    : "";
  const displayName = escapeHtml(data.name || data.login);
  const loginName = escapeHtml(data.login);
  const bio = data.bio ? escapeHtml(data.bio) : "";
  const location = data.location ? escapeHtml(data.location) : "";
  const blog = data.blog && isSafeUrl(data.blog) ? escapeHtml(data.blog) : "";

  // Account age in years
  const createdYear = new Date(data.created_at).getFullYear();
  const currentYear = new Date().getFullYear;
  const accountAge = currentYear - createdYear;

  container.innerHTML =
    // Avatar + name header
    '<div class="flex items-center gap-3 mb-3">' +
    (avatarUrl
      ? '<img src="' +
        avatarUrl +
        '" alt="' +
        loginName +
        ' avatar" ' +
        'class="w-12 h-12 rounded-full border border-slate-200 shrink-0">'
      : "") +
    '<div class="min-w-0">' +
    '<p class="font-semibold text-slate-800 text-sm truncate">' +
    displayName +
    "</p>" +
    '<p class="text-slate-500 text-xs">@' +
    loginName +
    "</p>" +
    (location
      ? '<p class="text-slate-400 text-xs mt-0.5">📍 ' + location + "</p>"
      : "") +
    "</div>" +
    "</div>" +
    // Bio
    (bio
      ? '<p class="text-slate-500 text-xs mb-3 italic leading-relaxed">&ldquo;' +
        bio +
        "&rdquo;</p>"
      : "") +
    // Stats grid
    '<div class="grid grid-cols-3 gap-2 text-center mb-3">' +
    '<div class="bg-slate-50 rounded-lg p-2">' +
    '<p class="font-bold text-slate-800 text-sm">' +
    formatNumber(data.public_repos) +
    "</p>" +
    '<p class="text-slate-400 text-xs">Repos</p>' +
    "</div>" +
    '<div class="bg-slate-50 rounded-lg p-2">' +
    '<p class="font-bold text-slate-800 text-sm">' +
    formatNumber(data.followers) +
    "</p>" +
    '<p class="text-slate-400 text-xs">Followers</p>' +
    "</div>" +
    '<div class="bg-slate-50 rounded-lg p-2">' +
    '<p class="font-bold text-slate-800 text-sm">' +
    accountAge +
    "yr" +
    (accountAge !== 1 ? "s" : "") +
    "</p>" +
    '<p class="text-slate-400 text-xs">On GitHub</p>' +
    "</div>" +
    "</div>" +
    // Blog link (if present)
    (blog
      ? '<p class="text-xs mb-3"><a href="' +
        blog +
        '" target="_blank" rel="noopener noreferrer" ' +
        'class="text-sky-600 hover:underline">🔗 ' +
        blog +
        "</a></p>"
      : "") +
    // View on GitHub button
    '<a href="' +
    profileUrl +
    '" target="_blank" rel="noopener noreferrer" ' +
    'class="block text-center w-full bg-slate-700 text-white text-xs font-medium ' +
    "py-2 rounded-lg hover:bg-slate-800 transition-colors " +
    'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1">' +
    "View Profile on GitHub →" +
    "</a>";
}

async function fetchGitHubRepos(username) {
  const url =
    "https://api.github.com/users/" +
    encodeURIComponent(username) +
    "/repos?sort=stars&per_page=5&type=public";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const reposContainer = document.getElementById("github-repos");
      if (reposContainer) {
        reposContainer.innerHTML =
          '<p class="text-slate-400 text-xs mt-3 italic">Repositories unavailable.</p>';
      }
      return;
    }

    const repos = await response.json();
    renderGitHubRepos(repos);
  } catch (err) {
    const reposContainer = document.getElementById("github-repos");
    if (reposContainer) {
      reposContainer.innerHTML =
        '<p class="text-slate-400 text-xs mt-3 italic">Could not load repositories.</p>';
    }
  }
}

function renderGitHubRepos(repos) {
  const container = document.getElementById("github-repos");

  if (!container) return;

  if (!repos || repos.length === 0) {
    container.innerHTML =
      '<p class="text-slate-400 text-xs mt-3 italic">No public repositories.</p>';
    return;
  }

  const repoItems = repos
    .map(function (repo) {
      const name = escapeHtml(repo.name);
      const desc = repo.description
        ? escapeHtml(repo.description)
        : "No description.";
      const stars = formatNumber(repo.stargazers_count);
      const lang = repo.language ? escapeHtml(repo.language) : "";
      const repoUrl = isSafeUrl(repo.html_url)
        ? escapeHtml(repo.html_url)
        : "#";

      return (
        '<li class="border-t border-slate-100 pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">' +
        '<a href="' +
        repoUrl +
        '" target="_blank" rel="noopener noreferrer" ' +
        'class="group block hover:bg-slate-50 rounded-md -mx-1 px-1 py-0.5 transition-colors">' +
        '<div class="flex items-center justify-between gap-2">' +
        '<span class="font-medium text-slate-700 text-xs group-hover:underline truncate">' +
        name +
        "</span>" +
        '<span class="flex items-center gap-0.5 text-slate-400 text-xs shrink-0">' +
        '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">' +
        '<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0' +
        " 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755" +
        " 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197" +
        "-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81" +
        '.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>' +
        "</svg>" +
        stars +
        "</span>" +
        "</div>" +
        '<p class="text-slate-400 text-xs mt-0.5 leading-relaxed truncate">' +
        desc +
        "</p>" +
        (lang
          ? '<span class="inline-block mt-1 text-xs text-slate-400 bg-slate-100 rounded px-1">' +
            lang +
            "</span>"
          : "") +
        "</a>" +
        "</li>"
      );
    })
    .join("");

  container.innerHTML =
    '<div class="mt-4">' +
    '<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Repositories</h3>' +
    "<ul>" +
    repoItems +
    "</ul>" +
    "</div>";
}
