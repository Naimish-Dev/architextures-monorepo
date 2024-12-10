config = !window.config ? {} : config;
const htmlEl = document.querySelector("html")
const serverConfig = JSON.parse(htmlEl.dataset.config);
htmlEl.removeAttribute("data-config")
config = Object.assign({}, config, serverConfig);

config.state = {
    area: "materials",
    limit: 35,
    page: 1,
    itemAdded: false,
    owned: true,
};

// config.brands = arrayToObject([], "id");

config.state.area = 'saved';