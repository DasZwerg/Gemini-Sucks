/**
 * Intercepts Google Search requests and modifies them based on user prefs:
 * - injectMinusAi: appends `-ai` to the query (default: true)
 * - forceWebTab:   adds `udm=14` to switch to the pure "Web" tab (default: false)
 */

const GOOGLE_SEARCH_PATTERN = "*://*.google.com/search*";

const DEFAULT_PREFS = {
  injectMinusAi: true,
  forceWebTab: false,
};

function isGoogleSearchUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname === "/search";
  } catch {
    return false;
  }
}

function modifySearchUrl(urlString, prefs) {
  const url = new URL(urlString);
  const params = url.searchParams;

  // Only act on plain web searches; skip image/video/news/shopping tabs
  const tbm = params.get("tbm");
  if (tbm && tbm !== "") {
    return null;
  }

  let changed = false;

  // Optionally force the "Web" filter tab (udm=14) — removes AI Overview server-side
  if (prefs.forceWebTab) {
    if (params.get("udm") !== "14") {
      params.set("udm", "14");
      changed = true;
    }
  } else {
    // If the pref is off but udm=14 was previously set by us, leave it alone
    // (user may have manually switched tabs)
  }

  // Optionally append -ai to the query
  if (prefs.injectMinusAi) {
    let q = params.get("q") || "";
    if (!q.split(" ").includes("-ai")) {
      q = q.trim() + (q.trim() ? " -ai" : "-ai");
      params.set("q", q);
      changed = true;
    }
  }

  if (!changed) {
    return null;
  }

  url.search = params.toString();
  return url.toString();
}

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!isGoogleSearchUrl(details.url)) {
      return {};
    }

    return browser.storage.local.get(DEFAULT_PREFS).then((prefs) => {
      const newUrl = modifySearchUrl(details.url, prefs);
      if (newUrl && newUrl !== details.url) {
        return { redirectUrl: newUrl };
      }
      return {};
    });
  },
  { urls: [GOOGLE_SEARCH_PATTERN] },
  ["blocking"]
);
