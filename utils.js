// Escaping HTML special characters before inserting into innerHTML
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// URL Validation: isSafeUrl() only uses http:// or https:// to prevent malicious or malformed URLs
function isSafeUrl(url) {
  if (typeof url !== "string") return false;
  const lower = url.toLowerCase().trim();
  return lower.startsWith("https://") || lower.startsWith("http://");
}

// Number formatting
function formatNumber(num) {
  if (typeof num !== "number") return "0";
  return num.toLocaleString("en-GB");
}

// Check for Blanks
function isBlank(str) {
  return !str || str.trim().length === 0;
}

// Loading State: Let the user know that the task is in progress while waiting for an API response
function setLoading(containerId, message) {
  message = message || "Loading...";
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML =
    '<div class="flex items-center gap-2 text-slate-400">' +
    '<div class="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin-slow"></div>' +
    "<span>" +
    escapeHtml(message) +
    "</span>" +
    "</div>";
}

// Error State: Let the user know an error occurred while the waiting for an API response
function setError(containerId, message) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML =
    '<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg">' +
    "<strong>Error: </strong>" +
    escapeHtml(message) +
    "</div>";
}
