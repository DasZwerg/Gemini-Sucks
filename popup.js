const statusEl = document.getElementById("status");

function showSaved() {
  statusEl.textContent = "Saved!";
  statusEl.className = "status saved";
  setTimeout(() => {
    statusEl.textContent = "Changes saved automatically.";
    statusEl.className = "status";
  }, 1200);
}

browser.storage.local.get({ injectMinusAi: true, forceWebTab: false }).then((prefs) => {
  document.getElementById("injectMinusAi").checked = prefs.injectMinusAi;
  document.getElementById("forceWebTab").checked = prefs.forceWebTab;
});

document.getElementById("injectMinusAi").addEventListener("change", (e) => {
  browser.storage.local.set({ injectMinusAi: e.target.checked }).then(showSaved);
});

document.getElementById("forceWebTab").addEventListener("change", (e) => {
  browser.storage.local.set({ forceWebTab: e.target.checked }).then(showSaved);
});
