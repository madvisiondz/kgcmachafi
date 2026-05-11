const cssHref = "/assets/index-075e7436.css";
const scriptHref = "/assets/index-bb87ca5c.js";

if (cssHref && !document.querySelector(`link[rel="stylesheet"][href="${cssHref}"]`)) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = cssHref;
  document.head.appendChild(stylesheet);
}

import(scriptHref);
