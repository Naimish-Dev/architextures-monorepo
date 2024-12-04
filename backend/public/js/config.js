config = !window.config ? {} : config;
const htmlEl = document.querySelector("html")
const serverConfig = JSON.parse(htmlEl.dataset.config);
htmlEl.removeAttribute("data-config")
config = Object.assign({}, config, serverConfig);