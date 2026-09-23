// if-loupe hook
// Runs in the PAGE'S OWN JS context (main world), not an isolated sandbox.
// GlkOte is a page global exposed by Parchment; this wraps its update function
// and forwards every turn's raw JSON payload to the renderer via postMessage.
//
// Load this by injecting it as a <script src="..."> tag (see bookmarklet.js),
// NOT as a content script — isolated-world content scripts cannot see window.GlkOte.

(function () {
  if (window.__ifLoupeInstalled) return;
  window.__ifLoupeInstalled = true;

  function post(payload) {
    window.postMessage({ source: "if-loupe", type: "glkote-update", payload }, "*");
  }

  function installHook() {
    if (typeof window.GlkOte === "undefined" || typeof window.GlkOte.update !== "function") {
      return false;
    }
    const realUpdate = window.GlkOte.update.bind(window.GlkOte);
    window.GlkOte.update = function (obj) {
      try {
        post(obj);
      } catch (err) {
        console.error("[if-loupe] failed to relay GlkOte update", err);
      }
      return realUpdate(obj);
    };
    console.info("[if-loupe] GlkOte.update hooked");
    return true;
  }

  // GlkOte may not be defined yet at injection time depending on load order.
  // Poll briefly rather than assuming it's ready immediately.
  let attempts = 0;
  const maxAttempts = 50; // ~10s at 200ms
  const interval = setInterval(function () {
    attempts += 1;
    if (installHook() || attempts >= maxAttempts) {
      clearInterval(interval);
      if (attempts >= maxAttempts) {
        console.warn("[if-loupe] GlkOte not found on this page after polling");
      }
    }
  }, 200);

  // Capture outgoing player commands directly from the input element,
  // independent of GlkOte internals.
  document.addEventListener(
    "keydown",
    function (evt) {
      if (evt.key !== "Enter") return;
      const target = evt.target;
      if (!target || typeof target.value !== "string") return;
      window.postMessage(
        { source: "if-loupe", type: "player-command", command: target.value },
        "*"
      );
    },
    true
  );
})();
