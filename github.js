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

  const profileUrL = isSafeUrl(data.html_url) ? escapeHtml(data.html_url) : "#";
  const avatarUrl = isSafeUrl(data.avatar_url)
    ? escapeHtml(data.avatar_url)
    : "";
  const displayName = escapeHtml(data.name || data.login);
  const loginName = escapeHtml(data.login);
  const bio = data.bio ? escapeHtml(data.bio) : "";

  container.innerHTML =
    '<a href="' +
    profileUrL +
    '" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 mb-4 group">' +
    (avatarUrl
      ? '<img src="' +
        avatarUrl +
        '" alt="' +
        loginName +
        ' GitHub avatar" class="w-12 h12 rounded-full border border-slate-200 group-hover:opacity-80 transition-opacity"/>'
      : "") +
    "<div>" +
    '<p class="font-semibold text-slate-800 text-sm group-hover:underline">' +
    displayName +
    "</p>" +
    '<p class="text-slate-500 text-xs">@' +
    loginName +
    "</p>" +
    "</div>" +
    "</a>" +
    (bio
      ? '<p class="text-slate-500 text-xs mb-3 italic leading-relaxed">&ldquo;' +
        bio +
        "&rdquo;</p>"
      : "") +
    '<div class="grid grid-cols-3 gap-2 text-center">' +
    '<div class="bg-slate-50 rounded-lg p-2">' +
    '<p class="font-bold text-slate-800 text-sm">' +
    formatNumber(data.public_repos) +
    "</p>" +
    '<p class="text-slate-500 text-xs">Repos</p>' +
    "</div>" +
    '<div class="bg-slate-50 rounded-lg p-2">' +
    '<p class="font-bold text-slate-800 text-sm">' +
    formatNumber(data.followers) +
    "</p>" +
    '<p class="text-slate-500 text-xs">Followers</p>' +
    "</div>" +
    '<div class="bg-slate-50 rounded-lg p-2">' +
    '<p class="font-bold text-slate-800 text-sm">' +
    formatNumber(data.following) +
    "</p>" +
    '<p class="text-slate-500 text-xs">Following</p>' +
    "</div>" +
    "</div>";
}
