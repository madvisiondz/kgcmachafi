const cssHref = "./assets/index-bfdb18ed.css";
const scriptHref = "./assets/index-d718001e.js";

if (cssHref && !document.querySelector(`link[rel="stylesheet"][href="${cssHref}"]`)) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = cssHref;
  document.head.appendChild(stylesheet);
}

import(scriptHref);
