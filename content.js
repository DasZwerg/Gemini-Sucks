/**
 * Belt-and-suspenders DOM removal of AI Overview elements.
 * Runs in case Google serves the AI block despite URL parameters.
 */

const AI_SELECTORS = [
  // AI Overview container (various internal names Google has used)
  "div[data-attrid='wa:/description']",
  "[jscontroller='g9E5Lb']",       // AI Overview jscontroller
  "[data-async-type='aiOverview']",
  "ai-overview",
  "#m-x-content",                  // mobile AI overview wrapper
  ".YzccFd",                        // AI Overview class (observed 2024)
  ".e3Wgde",                        // AI card wrapper
  ".L2CGJ",                         // "AI" label container
  "g-section-with-header",          // Generative section header
  "[data-q='aiOverview']",
  // Gemini sidebar / AI mode button
  "[aria-label='AI Mode']",
];

function removeAIElements() {
  AI_SELECTORS.forEach((selector) => {
    try {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    } catch {
      // Silently skip invalid selectors
    }
  });
}

// Run immediately and on DOM mutations (Google dynamically injects content).
// Disconnect the observer once the page has been fully idle for a short period.
let disconnectTimer = null;

const observer = new MutationObserver(() => {
  removeAIElements();
  clearTimeout(disconnectTimer);
  disconnectTimer = setTimeout(() => observer.disconnect(), 5000);
});

function startObserver() {
  removeAIElements();
  observer.observe(document.body, { childList: true, subtree: true });
  disconnectTimer = setTimeout(() => observer.disconnect(), 5000);
}

if (document.body) {
  startObserver();
} else {
  document.addEventListener("DOMContentLoaded", startObserver);
}
