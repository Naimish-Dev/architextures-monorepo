class Statistics {
  /**
   * constructor
   * @param data
   * @param dates
   * @param label
   */
  constructor(data, dates, label) {
    this.label = label;
    this.data = data;
    this.dates = dates.map((date) =>
      new Date(date).toLocaleString("en-GB", { day: "numeric", month: "short" })
    ); // left as en-GB format as the browser does the formatting automatically
    this.rawDates = dates;
    this.table = Statistics.table(this.label);
    this.filters = {};
    this.datapoints = this.dates.length;
    this.currentMaterial = null;
    this.currentTexture = null;
    this.borderColor = "rgba(0, 0, 0, 1)";
    this.strokeStyle = "rgba(0, 0, 0, 0)";
  }

  /*
   * ------------------
   * static properties
   * ------------------
   */
  // mutable properties
  static brand = config.user.type === "brand" ? config.user.brand : null;

  // immutable properties
  static statisticsUrl = "/app/statistics";
  static spinner = createHtml({
    tag: "div",
    "data-brand": "spinner",
    class: "flex-centred cc archive-message",
    style:
      "pointer-events:none;position:absolute;top:0;width:calc(100vw - 200px);height:100vh;z-index:1234",
    children: [{ tag: "div", style: "width:40px;", class: "spinner" }],
  });
  static startOfTime = new Date("2020-01-01");

  // do not mutate the dates property !
  static get dates() {
    return [
      getCustomDate(7),
      getCustomDate(6),
      getCustomDate(5),
      getCustomDate(4),
      getCustomDate(3),
      getCustomDate(2),
      getCustomDate(1),
    ];
  }

  /**
   * generate html for the chart
   * @returns {Text|*}
   */
  generate() {
    const total = this.data.reduce((a, b) => a + b, 0);

    return createHtml({
      tag: "div",
      class: "single-chart-container",
      children: [
        {
          tag: "div",
          class: "chart-title-filters",
          children: [
            {
              tag: "h2",
              "data-chart-totals": this.label.toLowerCase(),
              style: "padding-left: 5px;",
              text: this.label + " &mdash; " + total.toLocaleString("en-GB"),
            },
            {
              tag: "div",
              class: "filter-chart-select s-gap",
              "data-filter-div": this.label.toLowerCase(),
              children: [
                // do not show materials and textures filters for referrals
                this.label !== "Referrals"
                  ? {
                      tag: "button",
                      class: "fbutt",
                      "data-statistics-filter":
                        "reset-" + this.label.toLowerCase(),
                      text: "Reset",
                    }
                  : "",
                this.label !== "Referrals"
                  ? {
                      tag: "button",
                      class: "fbutt",
                      "data-statistics-filter":
                        "materials-" + this.label.toLowerCase(),
                      text: "Materials",
                    }
                  : "",
                this.label !== "Referrals"
                  ? {
                      tag: "button",
                      class: "fbutt",
                      "data-statistics-filter":
                        "textures-" + this.label.toLowerCase(),
                      text: "Textures",
                    }
                  : "",
                this.label !== "Referrals"
                  ? {
                      tag: "select",
                      class: "fbutt",
                      "data-referral-filter": this.label.toLowerCase(),
                      children: [
                        { tag: "option", value: "all", text: "All Sources" },
                        { tag: "option", value: "web", text: "Web" },
                        // {tag: "option", value: "sketchup", text: "Sketchup"},
                        // {tag: "option", value: "revit", text: "Revit"},
                        { tag: "option", value: "appid", text: "Custom App" },
                      ],
                    }
                  : "",
              ],
            },
          ],
        },
        {
          tag: "canvas",
          class: "chartjs-canvas",
          "data-chart-graph": "chartjs-" + this.label.toLowerCase(),
        },
      ],
    });
  }

  /**
   * generate config for the chart
   * @returns {{data: {datasets: [{borderColor: string, data, label}], labels}, options: {plugins: {legend: null, title: {display: boolean, text}}, responsive: boolean, scales: {y: {min: number, max: number}}}, type: string}}
   */
  config() {
    this.roundup = Statistics.roundup(this.data);

    return {
      type: "line",
      data: {
        labels: this.dates,
        datasets: [
          {
            label: this.label,
            data: this.data,
            borderColor: this.borderColor,
          },
        ],
      },
      options: this.setChartOptions(),
    };
  }

  /**
   * add filter for source
   */
  addSourceFilter() {
    const select = document.querySelector(
      '[data-referral-filter="' + this.label.toLowerCase() + '"]'
    );

    if (!select) return;

    if (!this.filters.referral) {
      this.filters.referral = select;
    }

    select.addEventListener("change", () => {
      const selected = document.querySelector(
        '[data-referral-filter="' + this.label.toLowerCase() + '"]'
      ).value;

      // reset title
      this.currentTexture = null;
      this.currentMaterial = null;

      if (selected === "all") {
        this.resetChartData();
        return;
      }
      this.updateChartData(selected);
    });
  }

  /**
   * attach listeners to the filters buttons
   */
  attachFilterListeners() {
    // attach reset button listener
    document
      .querySelector(
        '[data-statistics-filter="reset-' + this.label.toLowerCase() + '"]'
      )
      .addEventListener("click", () => {
        this.resetChartData();
        this.filters.referral.value = "all";
        this.currentTexture = null;
        this.currentMaterial = null;
      });

    // attach material filter listener
    this.setFilterData("textures");

    // attach texture filter listener
    this.setFilterData("protextures");
  }

  /**
   * set filter data settings and listeners
   * @param type MUST BE "protextures" or "textures"
   */
  setFilterData(type) {
    const self = this;

    // attach material filter listener
    const query = {
      table: type,
      columns: ["id", "name", "downloads"],
      order: ["downloads", "DESC"],
      limit: 999,
      auth: true,
    };
    if (Statistics.brand) {
      query.where = [["brand", "=", Statistics.brand]];
    }
    document
      .querySelector(
        '[data-statistics-filter="' +
          (type === "protextures" ? "materials" : "textures") +
          "-" +
          this.label.toLowerCase() +
          '"]'
      )
      .addEventListener("click", () => {
        const filter = createDataboxMenu({
          title: type === "protextures" ? "Materials" : "Textures",
          width: 380,
          height: 500,
          footer: false,
          query: query,
          itemHtml: (item) => {
            const element = createHtml({
              tag: "div",
              text: item.name,
              style:
                "cursor: pointer; padding: 10px 20px 10px 20px; border-bottom: 1px solid #eee;",
            });
            element.addEventListener("click", () => {
              this.updateChartData(
                null,
                type === "protextures" ? "material" : "texture",
                item.id
              );
              // lol
              element.parentElement.parentElement.parentElement.parentElement.style.display =
                "none";
              // set current material to show in div
              self.currentMaterial = item.name;
              self.currentTexture = null;
              self.filters.referral.value = "all";
            });
            return element;
          },
        });
        // hide div when clicked outside it
        const buttonFilter = document.querySelector(
          '[data-statistics-filter="' +
            (type === "protextures" ? "materials" : "textures") +
            "-" +
            this.label.toLowerCase() +
            '"]'
        );
        window.addEventListener("click", (e) => {
          if (!filter.contains(e.target) && !buttonFilter.contains(e.target))
            filter.style.display = "none";
        });
        // position the div correctly
        const div = document.querySelector(
          "[data-filter-div=" + this.label.toLowerCase() + "]"
        );
        div.appendChild(filter);
        this.updateDivPosition(div, filter, type === "textures");
        window.onresize = () => this.updateDivPosition(div, filter);
      });
  }

  /**
   * reset chart data, used when a filter is set to all
   */
  resetChartData() {
    Statistics.showSpinner();

    const data = {
      startDate: this.rawDates[0],
      endDate: this.rawDates[this.rawDates.length - 1],
      table: this.table,
      brand: Statistics.brand,
    };

    postJson(Statistics.statisticsUrl, data)
      .then((response) => {
        // update data points
        this.data = response[this.label.toLowerCase()];
        this.chart.data.datasets[0].data = this.data;
        // update scale
        this.roundup = Statistics.roundup(this.data);
        this.chart.options = this.setChartOptions();
        // actually update chart
        this.chart.update();
        // reset totals
        document.querySelector(
          "[data-chart-totals=" + this.label.toLowerCase() + "]"
        ).innerHTML =
          this.label +
          " &mdash; " +
          this.data.reduce((a, b) => a + b, 0).toLocaleString("en-GB");
      })
      .then(() => Statistics.hideSpinner());
  }

  /**
   * update single chart's data
   * @param source
   * @param column
   * @param filter
   */
  updateChartData(source = null, column = null, filter = null) {
    Statistics.showSpinner();

    // organise the object to send
    const data = {
      startDate: this.rawDates[0],
      endDate: this.rawDates[this.rawDates.length - 1],
      table: this.table,
      brand: Statistics.brand,
    };

    if (source) data.source = source;
    if (column) data.column = column;
    if (filter) data.filter = filter;

    // get new data
    postJson(Statistics.statisticsUrl, data)
      .then((response) => {
        // update data points
        this.data = response;
        this.chart.data.datasets[0].data = this.data;
        // update scale
        this.roundup = Statistics.roundup(this.data);
        this.chart.options = this.setChartOptions();
        // actually update chart
        this.chart.update();
        // update the totals
        const mattex = this.currentMaterial
          ? this.currentMaterial + " - "
          : this.currentTexture
          ? this.currentTexture + " - "
          : "";
        document.querySelector(
          "[data-chart-totals=" + this.label.toLowerCase() + "]"
        ).innerHTML =
          this.label +
          " " +
          mattex +
          this.data.reduce((a, b) => a + b, 0).toLocaleString("en-GB");
      })
      .then(() => Statistics.hideSpinner());
  }

  /**
   * set options object for charts, needs to be reset when a chart is redrawn, thus a function reduces code repetition
   * @returns Object
   */
  setChartOptions() {
    return {
      interaction: {
        intersect: false,
        mode: "index",
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      responsive: true,
      plugins: {
        legend: null,
        title: {
          display: false,
          text: this.label,
        },
        afterDraw: (chart) => {
          // setup the tooltip to show at all times when pointer is on a chart, binding to the nearest node
          if (chart.tooltip?._active?.length) {
            let x = chart.tooltip._active[0].element.x;
            let yAxis = chart.scales.y;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.strokeStyle;
            ctx.stroke();
            ctx.restore();
          }
        },
      },
      scales: {
        y: {
          min: 0,
          max:
            Math.ceil(Math.max(...this.data) / this.roundup) * this.roundup ===
            0
              ? 1
              : Math.ceil(Math.max(...this.data) / this.roundup) * this.roundup,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
            callback: (value, index, values) => {
              if (index === 0 || index === values.length - 1) {
                const strVal = value.toString();
                if (strVal.length === 1) {
                  return "         " + strVal;
                }
                return strVal;
              }
              return "";
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            display: false,
            minRotation: 0,
            maxRotation: 0,
            callback: (value, index, values) => {
              if (index === 0 || index === values.length - 1) {
                return this.dates[index];
              }
              return "";
            },
          },
        },
      },
    };
  }

  /**
   * update the position of the databoxMenu div when the window is resized
   * @param mainDiv
   * @param fixedDiv
   * @param offset
   */
  updateDivPosition(mainDiv, fixedDiv, offset = false) {
    const divRect = mainDiv.getBoundingClientRect();
    fixedDiv.style.top = divRect.top + "px";
    if (offset) {
      const px = parseInt(divRect.left) + 160;
      fixedDiv.style.left = px + "px";
    } else {
      fixedDiv.style.left = divRect.left + "px";
    }
  }

  /**
   * --------------
   * static methods
   * --------------
   */

  /**
   * remove the chart from the dom
   * @param label
   */
  static removeChart(label) {
    const chart = document.querySelector(
      '[data-chart-graph="chartjs-' + label.toLowerCase() + '"]'
    );
    if (chart) chart.remove();
  }

  /**
   * create the container for the charts
   * @param dates
   * @returns {Text|(function(*): (any|undefined))}
   */
  static createMainContainer(dates) {
    const dateRangeOptions = Statistics.generateDateRangeOptions();
    const datePicker = Statistics.generateStartDatePicker(dates[0]);
    return createHtml({
      tag: "div",
      class: "admin-area admin-page statistics-only",
      children: [
        {
          tag: "div",
          class: "admin-header admin-header-single",
          style: "padding-right: 0;",
          children: [
            {
              tag: "div",
              class: "admin-single-heading-left heading-filters",
              children: [
                { tag: "h1", class: "admin-page-heading", text: "Analytics" },
                {
                  tag: "div",
                  "data-statistics": "date-picker-filters",
                  class: "s-gap",
                  children: [
                    // show limited start date picker
                    datePicker,
                    {
                      tag: "label",
                      class: "label-datepicker",
                      for: "end-date",
                      text: "&mdash;",
                    },
                    {
                      tag: "input",
                      class: "input fbutt chartjs-datepicker",
                      type: "date",
                      "data-chartjs-date": "end-date",
                      value: dates[dates.length - 1],
                    },
                    // show date ranges
                    dateRangeOptions,
                    config.user.type === "admin"
                      ? {
                          tag: "select",
                          "data-brand-filter": "brand",
                          class: "fixed-range-select fbutt",
                          children: [
                            { tag: "option", value: "all", text: "All Brands" },
                          ],
                        }
                      : "",
                  ],
                },
              ],
            },
          ],
        },
        {
          tag: "div",
          "data-statistics": "user-statistics",
          style: "padding: 0 30px;",
        },
        {
          tag: "div",
          class: "chartjs-container",
          children: [
            {
              tag: "div",
              class: "chartjs-no-results",
              text: "No data for your defined filters!",
            },
            { tag: "div", "data-main-chart-container": "container" },
          ],
        },
      ],
    });
  }

  static generateDateRangeOptions() {
    // if user is admin allow all
    if (config.user.type === "admin") {
      return createHtml({
        tag: "select",
        "data-fixed-date": "date-range",
        class: "fixed-range-select fbutt",
        children: [
          { tag: "option", value: "last7days", text: "Last 7 Days" },
          { tag: "option", value: "last30days", text: "Last 30 Days" },
          { tag: "option", value: "last90days", text: "Last 90 Days" },
          { tag: "option", value: "last180days", text: "Last 180 Days" },
        ],
      });
    }

    // check if user is brand and get their limit
    if (config.user.brand) {
      Statistics.maxDays = config.brand.brand_tiers_max_statistics ?? null;

      let options = {
        tag: "select",
        "data-fixed-date": "date-range",
        class: "fixed-range-select fbutt",
        children: [
          { tag: "option", value: "last7days", text: "Last 7 Days" },
          { tag: "option", value: "last30days", text: "Last 30 Days" },
          { tag: "option", value: "last90days", text: "Last 90 Days" },
          { tag: "option", value: "last180days", text: "Last 180 Days" },
        ],
      };

      // set limits and generate date range options
      if (Statistics.maxDays && Statistics.maxDays < 30) {
        options.children[1].disabled = "true";
      }

      if (Statistics.maxDays && Statistics.maxDays < 90) {
        options.children[2].disabled = "true";
      }

      if (Statistics.maxDays && Statistics.maxDays < 180) {
        options.children[3].disabled = "true";
      }
      return createHtml(options);
    }
  }

  static generateStartDatePicker(value) {
    // if user is admin allow all
    if (config.user.type === "admin") {
      return createHtml({
        tag: "input",
        class: "input fbutt chartjs-datepicker",
        type: "date",
        "data-chartjs-date": "start-date",
        value: value,
      });
    }

    // limit start date for brand users
    if (config.user.brand) {
      let minStartDate;

      if (Statistics.maxDays) {
        minStartDate = getCustomDate(Statistics.maxDays);
      }

      return createHtml({
        tag: "input",
        class: "input fbutt chartjs-datepicker",
        type: "date",
        "data-chartjs-date": "start-date",
        min: minStartDate,
        value: value,
      });
    }
  }

  static addBrandFilter() {
    // get brand names and set the select
    if (config.user.type === "admin") {
      const select = document.querySelector('[data-brand-filter="brand"]');

      postJson("/app/query", {
        table: "brands",
        where: [["name", "!=", "null"]],
        limit: 1000,
        sort: ["name", "asc"],
      }).then((response) => {
        if (select.length <= 1) {
          response.results.forEach((brand) => {
            select.appendChild(
              createHtml({ tag: "option", value: brand.id, text: brand.name })
            );
          });
        }

        select.addEventListener("change", () => {
          Statistics.nullifyCharts();
          Statistics.showSpinner();

          // set all data
          Statistics.brand = select.value === "all" ? null : select.value;
          const defaultDates = Statistics.dates;
          const startDate =
            document.querySelector('[data-chartjs-date="start-date"]').value ??
            defaultDates[0];
          const endDate =
            document.querySelector('[data-chartjs-date="end-date"]').value ??
            defaultDates[defaultDates.length - 1];

          // reset charts data - page reload
          const brandsFilter = document.querySelector(
            '[data-brand-filter="brand"]'
          );
          postJson(Statistics.statisticsUrl, {
            startDate: startDate,
            endDate: endDate,
            brand: Statistics.brand,
          }).then((response) =>
            generateStatisticsCharts(response, null, brandsFilter)
          );
        });
      });
    }
  }

  /**
   * Attach listeners to the statistics page interactions
   */
  static attachListeners() {
    const datePickers = document.querySelectorAll(".chartjs-datepicker");

    // check if user has moved to another page before the page has completely loaded
    if (!datePickers) return;

    // attach listeners to date pickers
    datePickers.forEach((datePicker) => {
      datePicker.addEventListener("change", () => {
        Statistics.showSpinner();

        // get dates
        let startDate = document.querySelector(
          '[data-chartjs-date="start-date"]'
        ).value;
        const endDate = document.querySelector(
          '[data-chartjs-date="end-date"]'
        ).value;

        if (Statistics.maxDays) {
          const diff = Math.abs(new Date() - new Date(startDate));
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

          if (diffDays > Statistics.maxDays) {
            startDate = getCustomDate(Statistics.maxDays);
          }
        }

        // show alert if end date is before start date
        if (new Date(endDate) < new Date(startDate)) {
          Statistics.hideSpinner();
          addNotification({
            text: "End date cannot be before start date",
            image: "warning",
          });
          return;
        }

        if (
          !startDate ||
          !endDate ||
          new Date(startDate) < Statistics.startOfTime ||
          new Date(endDate) < Statistics.startOfTime
        ) {
          Statistics.hideSpinner();
          addNotification({
            text: "Check start or end date",
            image: "warning",
          });
          return;
        }

        Statistics.nullifyCharts();
        // get data and update charts - page reload
        const brandsFilter = document.querySelector(
          '[data-brand-filter="brand"]'
        );
        postJson(Statistics.statisticsUrl, {
          startDate: startDate,
          endDate: endDate,
          brand: Statistics.brand,
        }).then((response) => {
          generateStatisticsCharts(response, null, brandsFilter);
        });
      });
    });

    // attach listeners to date range selector
    document
      .querySelector('[data-fixed-date="date-range"]')
      .addEventListener("change", () => {
        Statistics.nullifyCharts();
        Statistics.showSpinner();

        const brandsFilter = document.querySelector(
          '[data-brand-filter="brand"]'
        );

        // get value and update charts - page reload
        const dateRange = document.querySelector(
          '[data-fixed-date="date-range"]'
        ).value;
        switch (dateRange) {
          case "last180days":
            postJson(Statistics.statisticsUrl, {
              startDate: getCustomDate(180),
              endDate: getCustomDate(1),
              brand: Statistics.brand,
            }).then((response) =>
              generateStatisticsCharts(response, "last180days", brandsFilter)
            );
            break;
          case "last90days":
            postJson(Statistics.statisticsUrl, {
              startDate: getCustomDate(90),
              endDate: getCustomDate(1),
              brand: Statistics.brand,
            }).then((response) =>
              generateStatisticsCharts(response, "last90days", brandsFilter)
            );
            break;
          case "last30days":
            postJson(Statistics.statisticsUrl, {
              startDate: getCustomDate(30),
              endDate: getCustomDate(1),
              brand: Statistics.brand,
            }).then((response) =>
              generateStatisticsCharts(response, "last30days", brandsFilter)
            );
            break;
          case "last7days":
          default:
            postJson(Statistics.statisticsUrl, {
              startDate: getCustomDate(7),
              endDate: getCustomDate(1),
              brand: Statistics.brand,
            }).then((response) =>
              generateStatisticsCharts(response, "last7days", brandsFilter)
            );
            break;
        }
      });
  }

  static nullifyCharts() {
    const charts = document.querySelectorAll(".single-chart-container");
    charts.forEach((chart) => {
      chart.remove();
    });
  }

  /**
   * round up data points to give a better scale
   * @param dataPoints
   * @returns {number}
   */
  static roundup(dataPoints) {
    if (Math.max(...dataPoints) > 10000) {
      return 10000;
    } else if (Math.max(...dataPoints) > 1000) {
      return 1000;
    } else if (Math.max(...dataPoints) > 100) {
      return 100;
    } else {
      return 30;
    }
  }

  /**
   * get table name from label
   * @param label
   * @returns {string}
   */
  static table(label) {
    switch (label.toLowerCase()) {
      case "views":
        return "material_views";
      case "downloads":
        return "material_downloads";
      case "referrals":
        return "link_clicks";
    }
  }

  static showSpinner() {
    if (document.querySelector(".admin-area")) {
      document.querySelector(".admin-area").appendChild(Statistics.spinner);
      document.querySelector(".admin-area").style.pointerEvents = "none";
    }
  }

  static hideSpinner() {
    if (document.querySelector('[data-brand="spinner"]')) {
      document.querySelector(".admin-area").removeChild(Statistics.spinner);
      document.querySelector(".admin-area").style.pointerEvents = "auto";
    }
  }
}
