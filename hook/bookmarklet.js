// Source for the if-loupe bookmarklet.
// Minify/URI-encode this and wrap in `javascript:(function(){...})();` to produce
// the actual bookmark URL. Points at a hosted copy of hook.js so the bookmarklet
// itself stays tiny and always loads the latest hook logic.

(function () {
  var HOOK_URL = "https://YOUR_HOST/hook.js"; // replace with hosted hook.js URL

  if (document.querySelector('script[data-if-loupe]')) {
    console.info("[if-loupe] already injected");
    return;
  }
  var script = document.createElement("script");
  script.src = HOOK_URL;
  script.setAttribute("data-if-loupe", "true");
  document.documentElement.appendChild(script);
})();
