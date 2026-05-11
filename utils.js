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

// Validate text input before use in an API call

function validateInput(value, fieldName, maxLength) {
  maxLength = maxLength || 100;

  if (isBlank(value)) {
    return { valid: false, message: "Please enter a " + fieldName + "." };
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      message:
        fieldName.charAt(0).toUpperCase() +
        fieldName.slice(1) +
        " is too long (max " +
        maxLength +
        " characters).",
    };
  }

  return { valid: true, value: trimmed };
}

// Loading State: Let the user know that the task is in progress while waiting for an API response
function setLoading(containerId, message) {
  message = message || "Loading...";
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML =
    '<div class="flex items-center gap-2 text-slate-500">' +
    '<div class="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin-slow"></div>' +
    "<span>" +
    escapeHtml(message) +
    "</span>" +
    "</div>";
}

// Error State: Let the user know an error occurred while the waiting for an API response
function setError(containerId, message, retryFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const retryButton = retryFn
    ? '<button onclick="(' +
      retryFn.toString() +
      ')()" ' +
      'class="mt-2 text-xs text-red-600 underline hover:no-underline ' +
      'focus:outline-none focus:ring-1 focus:ring-red-400 rounded">' +
      "Try again" +
      "</button>"
    : "";

  container.innerHTML =
    '<div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm" role="alert">' +
    "<strong>Error:</strong> " +
    escapeHtml(message) +
    retryButton +
    "</div>";
}
