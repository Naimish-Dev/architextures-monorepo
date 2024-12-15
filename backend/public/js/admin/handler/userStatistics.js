class UserStatistics {
  constructor() {
    this.url = "/app/user-statistics";
  }

  showStatistics() {
    this.getData().then(() => {
      this.generateHtml();
    });
  }

  getData() {
    return fetch(this.url)
      .then((response) => response.json())
      .then((data) => {
        this.data = data;
      });
  }

  generateHtml() {
    const html = new CreateElement({
      tag: "div",
      class: "single-chart-container",
      children: [
        {
          tag: "h2",
          "data-charts-totals": "views",
          class: "chart-title-filters",
          text: "Users - " + this.data.totalUsers.toLocaleString(),
        },
        {
          tag: "div",
          class: "l-gap",
          children: [
            {
              tag: "ul",
              class: "fw fc xs-gap analytics-list",
              children: this.generateIndustries(),
            },
            {
              tag: "ul",
              class: "fw fc xs-gap analytics-list",
              children: this.generateCountries(),
            },
            {
              tag: "ul",
              class: "fw fc xs-gap analytics-list",
              children: this.generateRegions(),
            },
          ],
        },
      ],
    }).createHTML();

    const statisticsPage = document.querySelector(
      "[data-statistics='user-statistics']"
    );
    if (statisticsPage) {
      statisticsPage.appendChild(html);
    }
  }

  generateIndustries() {
    const industries = Object.keys(this.data.industries).map((industry) => {
      return {
        tag: "li",
        class: "s-gap fw fr cv hor-sb",
        children: [
          industry,
          {
            tag: "div",
            class: "fr cc s-gap",
            children: [
              Number(this.data.industries[industry]).toFixed(2) + "%",
              {
                tag: "div",
                class: "percent-container",
                children: [
                  {
                    tag: "div",
                    class: "percent-bar",
                    style: "width: " + this.data.industries[industry] + "%",
                  },
                ],
              },
            ],
          },
        ],
      };
    });
    industries.push({
      tag: "div",
      class: "inlab",
      text: "* Users can select multiple disciplines",
    });
    return industries;
  }

  generateCountries() {
    return Object.keys(this.data.countries).map((country) => {
      let countryName = config.countries.find((c) => c.Iso2 === country);
      countryName = countryName ? countryName.name : country;
      return {
        tag: "li",
        class: "s-gap fw fr cv hor-sb",
        children: [
          this.getFlagEmoji(country) + " " + countryName,
          {
            tag: "div",
            class: "fr cc s-gap",
            children: [
              Number(this.data.countries[country]).toFixed(2) + "%",
              {
                tag: "div",
                class: "percent-container",
                children: [
                  {
                    tag: "div",
                    class: "percent-bar",
                    style: "width: " + this.data.countries[country] + "%",
                  },
                ],
              },
            ],
          },
        ],
      };
    });
  }

  generateRegions() {
    return Object.keys(this.data.regions).map((region) => {
      return {
        tag: "li",
        class: "s-gap fw fr cv hor-sb",
        children: [
          this.getRegionEmojiAndName(region),
          {
            tag: "div",
            class: "fr cc s-gap",
            children: [
              Number(this.data.regions[region]).toFixed(2) + "%",
              {
                tag: "div",
                class: "percent-container",
                children: [
                  {
                    tag: "div",
                    class: "percent-bar",
                    style: "width: " + this.data.regions[region] + "%",
                  },
                ],
              },
            ],
          },
        ],
      };
    });
  }

  getRegionEmojiAndName(region) {
    switch (region.toLowerCase()) {
      case "af":
        return "\uD83C\uDF0D Africa";
      case "as":
        return "\uD83C\uDF0F Asia";
      case "eu":
        return "\uD83C\uDF0D Europe";
      case "na":
        return "\uD83C\uDF0E North America";
      case "oc":
        return "\uD83C\uDF0F Oceania";
      case "sa":
        return "\uD83C\uDF0E South America";
    }
  }

  getFlagEmoji(countryCode) {
    const baseCodePoint = 0x1f1e6;
    return countryCode
      .toUpperCase()
      .split("")
      .map((char) =>
        String.fromCodePoint(
          baseCodePoint + char.charCodeAt(0) - "A".charCodeAt(0)
        )
      )
      .join("");
  }
}
