class Brand {
  /**
   * @param brand
   */
  constructor(brand) {
    this.brand = brand;
    artx.modified = {};
  }

  /**
   * get brand information from database
   * @returns {*|Promise<unknown>}
   */
  getBrandInfo() {
    return query({
      auth: true,
      table: "brands",
      columns: ["id", "name", "logo", "description", "website_link", "country"],
      where: [["id", "=", this.brand]],
    });
  }

  /**
   * generate upload button for brand logo
   * @param brand
   * @returns {Text|*}
   */
  generateUploadButton(brand) {
    const button = createHtml({
      tag: "div",
      class: "input upload-input",
      children: [
        {
          tag: "img",
          style: "max-width: 70%; max-height: 70%;",
          src: brand.logo ? artx.cdn + brand.logo : "",
        },
      ],
    });

    button.addEventListener("click", () => {
      uploadLibrary({
        onOk: function (upload) {
          if (upload.selectedItems[0]) {
            if (!artx.modified) artx.modified = {};
            artx.modified.logo = upload.selectedItems[0].url;
            button.querySelector("img").src =
              artx.cdn + upload.selectedItems[0].url;
          }
        },
      });
    });

    return button;
  }

  /**
   * generate the main html form
   * @param brand
   * @param uploadButton
   * @returns {Text|*}
   */
  async generateMainHtml(brand, uploadButton) {
    let countries = artx.countries;
    // set the current country to the brand's country
    let currentCountry = brand.country
      ? countries.find((c) => c.Iso2 === brand.country)
      : null;
    currentCountry = currentCountry ? currentCountry.name : null;

    return createHtml({
      tag: "div",
      id: "admin-single-brands",
      class: "admin-single-content",
      children: [
        {
          tag: "div",
          class: "admin-section",
          children: [
            {
              tag: "div",
              class: "sardine-tin",
              children: [
                {
                  tag: "div",
                  children: [
                    { tag: "div", class: "input-label", text: "name" },
                    {
                      tag: "input",
                      type: "text",
                      "data-column": "name",
                      value: brand.name ?? "",
                    },
                  ],
                },
                {
                  tag: "div",
                  children: [
                    { tag: "div", class: "input-label", text: "website" },
                    {
                      tag: "input",
                      autocapitalize: "off",
                      type: "text",
                      "data-column": "website_link",
                      value: brand.website_link ?? "",
                    },
                  ],
                },
                {
                  tag: "div",
                  children: [
                    { tag: "div", class: "input-label", text: "brand-logo" },
                    uploadButton,
                  ],
                },
                {
                  tag: "div",
                  "data-brand-country": "brand-selection",
                  children: [
                    { tag: "div", class: "input-label", text: "country" },
                    {
                      tag: "div",
                      class: "input",
                      "data-country": "select-brand-button",
                      text: currentCountry ?? "Country",
                    },
                  ],
                },
              ],
            },
            {
              tag: "div",
              class: "sardine-tin",
              children: [
                {
                  tag: "div",
                  children: [
                    { tag: "div", class: "input-label", text: "description" },
                    {
                      tag: "textarea",
                      "data-column": "description",
                      text: brand.description ?? "",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  /**
   * generate the brand page, entry point for the class
   * @returns {Promise<void>}
   */
  generateBrandPage() {
    if (document.querySelector("#admin-single-brands")) return;

    const spinner = createHtml({
      tag: "div",
      "data-brand": "spinner",
      class: "flex-centred cc archive-message",
      style:
        "pointer-events:none;position:absolute;top:0;background-color:rgba(234,234,234,0.7);width:calc(100vw - 200px);height:100vh;z-index:1234",
      children: [{ tag: "div", style: "width:40px;", class: "spinner" }],
    });
    document.querySelector(".admin-area").appendChild(spinner);
    document.querySelector(".admin-area").style.pointerEvents = "none";

    this.getBrandInfo()
      .then(async (brand) => {
        // set brand to the correct property
        brand = brand.results[0];

        // generate all html
        const brandPage = createSinglePage(
          brand,
          "Brand",
          brand.id ? brand.name : "New Brand",
          true,
          false,
          () => {},
          false
        );
        const uploadButton = this.generateUploadButton(brand);
        const brandHtml = await this.generateMainHtml(brand, uploadButton);

        // append all html
        brandPage.container.pageContent.innerHTML = "";
        brandPage.container.pageContent.appendChild(brandHtml);

        let countries = artx.countries;
        countries = sortCountries(countries);

        const button = document.querySelector(
          "[data-country='select-brand-button']"
        );

        const countriesMenu = createContextMenu({
          items: countries,
          search: true,
          width: 285,
          height: 800,
          isHiddenOnClose: true,
          srcElement: button,
          itemHtml: (country) =>
            createHtml({
              tag: "div",
              class: "nav-menu-item searchable-item",
              onclick:
                'selectCountry("' +
                country.Iso2 +
                '", "' +
                country.name +
                '", "select-brand-button")',
              "data-country-code": country.Iso2,
              text: country.name,
            }),
          anchorElement: button,
        });
        countriesMenu.style.display = "none";
        document
          .querySelector("[data-brand-country='brand-selection']")
          .appendChild(countriesMenu);

        button.addEventListener("click", () => {
          countriesMenu.style.display =
            countriesMenu.style.display === "none" ? "block" : "none";
        });
        adminListeners();
      })
      .then(() => {
        // remove spinner to show content
        document.querySelector("[data-brand=spinner]").remove();
        document.querySelector(".admin-area").style.pointerEvents = "auto";
      });
  }
}
