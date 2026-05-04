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
