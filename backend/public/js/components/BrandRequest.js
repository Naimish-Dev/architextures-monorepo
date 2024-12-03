class BrandRequest {
  constructor() {
    // ensure only one instance exists to persist data
    if (!BrandRequest.instance) {
      BrandRequest.instance = this;
    }
    return BrandRequest.instance;
  }

  setName(name) {
    this.name = name;
    if (this.requestModal) {
      this.requestModal.querySelector(
        "[data-request='texture-name']"
      ).innerHTML = this.name;
    }
  }

  setBrand(brandId) {
    this.brand = brandId;
  }

  setParams(params) {
    this.params = params;
  }

  setImageData(imgUrl, color) {
    this.imgSrc = imgUrl;
    this.color = color;
  }

  getRequestModal() {
    this.setupModal();
    return this.requestModal;
  }

  setupModal() {
    this.createRequestModal();
    this.setFieldsAndValues();
    this.addEventListeners();
    this.toggleVisibleFields();
  }

  createRequestModal() {
    this.requestModal = new CreateElement({
      tag: "div",
      "data-modal": "request-modal",
      class: "modal",
      children: [
        {
          tag: "div",
          class: "modal-window",
          style: "max-width: 480px;",
          children: [
            {
              tag: "div",
              class: "modal-header",
              children: [
                {
                  tag: "div",
                  class: "ellipsis-text",
                  "data-request": "texture-name",
                  text: this.name,
                },
                {
                  tag: "div",
                  class: "cc s-gap",
                  children: [
                    {
                      tag: "div",
                      class: "beta-label",
                      children: [
                        {
                          tag: "img",
                          class: "beta-img",
                          src: artx.cdn + "/icons/experimental2.svg",
                        },
                        "Beta",
                      ],
                    },
                    {
                      tag: "img",
                      src: "https://cdn.architextures.org/icons/x.svg",
                      class: "icon",
                      "data-close": "request-modal",
                    },
                  ],
                },
              ],
            },
            {
              tag: "div",
              class: "modal-body fc m-gap m-pad",
              children: [
                {
                  tag: "div",
                  class: "xs-gap fc",
                  "data-request": "checkboxes",
                  children: [
                    { tag: "div", class: "inlab", text: "Request" },
                    {
                      tag: "div",
                      class: "s-gap",
                      children: [
                        {
                          tag: "label",
                          class: "fw",
                          children: [
                            {
                              tag: "div",
                              class: "fw fbutt",
                              children: [
                                {
                                  tag: "div",
                                  class: "s-gap",
                                  children: [
                                    {
                                      tag: "input",
                                      type: "checkbox",
                                      name: "information",
                                    },
                                    "Information",
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          tag: "label",
                          class: "fw",
                          children: [
                            {
                              tag: "div",
                              class: "fw fbutt",
                              children: [
                                {
                                  tag: "div",
                                  class: "s-gap",
                                  children: [
                                    {
                                      tag: "input",
                                      type: "checkbox",
                                      name: "sample",
                                    },
                                    "Sample",
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          tag: "label",
                          class: "fw",
                          children: [
                            {
                              tag: "div",
                              class: "fw fbutt",
                              children: [
                                {
                                  tag: "div",
                                  class: "s-gap",
                                  children: [
                                    {
                                      tag: "input",
                                      type: "checkbox",
                                      name: "price",
                                    },
                                    "Price",
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  tag: "div",
                  style: "width: 450px; max-width: 100%; height: 200px;",
                  class: "fc m-gap",
                  children: [
                    {
                      tag: "div",
                      "data-project-info-container": "",
                      class: "m-gap",
                      children: [
                        {
                          tag: "input",
                          type: "text",
                          name: "project",
                          "data-request": "projectAndLocation",
                          placeholder: "Project, location",
                        },
                        {
                          tag: "div",
                          class: "df multi-input",
                          "data-amount": "",
                          children: [
                            {
                              tag: "input",
                              type: "number",
                              name: "amount",
                              placeholder: "Area",
                              style: "min-width:100px",
                            },
                            {
                              tag: "select",
                              style: "min-width:100px",
                              children: [
                                { tag: "option", disabled: "", text: "Area" },
                                { tag: "option", value: "metres", text: "m²" },
                                {
                                  tag: "option",
                                  value: "feet",
                                  text: "Sq ft.",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      tag: "textarea",
                      name: "message",
                      "data-request": "message",
                      style: "flex-grow: 1",
                      placeholder: "Message",
                    },
                  ],
                },
                {
                  tag: "div",
                  class: "inlab",
                  text: "* Your contact details are shared for response",
                },
                {
                  tag: "button",
                  class: "fw",
                  children: [
                    { tag: "div", "data-request": "send-btn", text: "Send" },
                    {
                      tag: "div",
                      class: "spinner",
                      "data-request": "spinner",
                      style: "display: none;",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }).createHTML();
  }

  setFieldsAndValues() {
    // Target elements
    this.infoCheckbox = this.requestModal.querySelector(
      "input[name='information']"
    );
    this.sampleCheckbox = this.requestModal.querySelector(
      "input[name='sample']"
    );
    this.priceCheckbox = this.requestModal.querySelector("input[name='price']");
    this.projectInput = this.requestModal.querySelector(
      "input[name='project']"
    );
    this.amountInput = this.requestModal.querySelector("[data-amount]");
    this.messageInput = this.requestModal.querySelector(
      "textarea[name='message']"
    );
    this.projectDataContainer = this.requestModal.querySelector(
      "[data-project-info-container]"
    );
    this.sendButton = this.requestModal.querySelector("button");

    // Set initial values, use most recent request values if available
    const lastRequest = JSON.parse(localStorage.getItem("lastRequest"));
    if (lastRequest) {
      this.projectInput.value = lastRequest.projectAndLocation || "";
      this.amountInput.querySelector("input").value = lastRequest.area || "";
      this.requestModal.querySelector("select").value =
        lastRequest.areaUnit || "metres";
      this.messageInput.value = lastRequest.message || "";
      this.infoCheckbox.checked = lastRequest.options.includes("information");
      this.sampleCheckbox.checked = lastRequest.options.includes("sample");
      this.priceCheckbox.checked = lastRequest.options.includes("price");
    } else {
      this.messageInput.value = "";
      this.projectInput.value = "";
      this.amountInput.value = "";
    }
  }

  addEventListeners() {
    // handle checkbox changes/ swap which fields are visible
    this.requestModal
      .querySelectorAll("input[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () => this.toggleVisibleFields());
      });

    // handle send button click
    this.sendButton.addEventListener("click", () => {
      this.sendRequest();
    });

    // close button
    this.requestModal
      .querySelector("[data-close='request-modal']")
      .addEventListener("click", () => {
        this.requestModal.style.display = "none";
      });

    // outside click event listener
    document.addEventListener("click", (event) => {
      if (event.target === this.requestModal)
        this.requestModal.style.display = "none";
    });
  }

  toggleVisibleFields() {
    // Toggle visibility
    this.projectInput.style.display =
      this.sampleCheckbox.checked || this.priceCheckbox.checked ? "" : "none";
    this.amountInput.style.display = this.priceCheckbox.checked ? "" : "none";
    this.projectDataContainer.style.display =
      this.sampleCheckbox.checked || this.priceCheckbox.checked ? "" : "none";
    if (
      this.infoCheckbox.checked ||
      this.sampleCheckbox.checked ||
      this.priceCheckbox.checked
    ) {
      this.sendButton.style.opacity = "1";
      this.sendButton.style.pointerEvents = "all";
    } else {
      this.sendButton.style.opacity = "0.5";
      this.sendButton.style.pointerEvents = "none";
    }
  }

  toggleRequestModal() {
    this.requestModal.style.display =
      this.requestModal.style.display === "none" ? "flex" : "none";
  }

  sendRequest() {
    this.requestModal.querySelector("[data-request='spinner']").style.display =
      "block";
    this.requestModal.querySelector("[data-request='send-btn']").style.display =
      "none";
    const notification = addNotification({
      text: "Sending request...",
      image: "spinner",
    });

    const checkboxes = {};
    this.requestModal.querySelectorAll("input, textarea").forEach((input) => {
      if (input.type === "checkbox") {
        checkboxes[input.name] = input.checked;
      }
      checkboxes[input.name] =
        input.type === "checkbox" ? input.checked : input.value;
    });

    // clear error messages
    this.requestModal
      .querySelectorAll(".input-error")
      .forEach((error) => error.classList.remove("input-error"));
    this.requestModal
      .querySelectorAll("[id^='error-']")
      .forEach((error) => error.remove());

    const options = ["information", "sample", "price"].filter(
      (checkbox) => checkboxes[checkbox]
    );
    const projectAndLocation = this.projectInput.value;
    const area = parseFloat(this.amountInput.querySelector("input").value);
    const areaUnit = this.requestModal.querySelector("select").value;
    const message = this.messageInput.value;

    // save image
    this.createImageData().then(() => {
      // formatted data to send
      const requestData = {
        name: this.name,
        params: this.params,
        brandId: this.brand,
        options: options,
        message: message,
        imgSrc: this.imgSrc,
        color: this.color,
      };

      // include only fields that are expected
      if (options.includes("sample") || options.includes("price")) {
        requestData.projectAndLocation = projectAndLocation;
      }
      if (options.includes("price")) {
        requestData.area = !isNaN(area) ? parseFloat(area.toFixed(2)) : null;
        requestData.areaUnit = areaUnit;
      }

      // send to backend
      postJson("/api/requests", requestData).then((response) => {
        // handle response and errors
        this.requestModal.querySelector(
          "[data-request='spinner']"
        ).style.display = "none";
        this.requestModal.querySelector(
          "[data-request='send-btn']"
        ).style.display = "block";

        if (response.status === 422) {
          notification.updateNotification({
            text: "An error occurred, please try again",
            image: "warning",
            duration: 10000,
          });
          return;
        }

        notification.updateNotification({
          text: "Request sent",
          image: "tick",
          duration: 2000,
        });
        // store/update data to local storage
        localStorage.setItem("lastRequest", JSON.stringify(requestData));
        this.requestModal.style.display = "none";
      });
    });
  }

  createImageData() {
    if (this.imgSrc) {
      return Promise.resolve();
    }
    const canvas = document.querySelector("#canvas");
    const textureName = document.querySelector(
      "#material-pseudo .pseudo-select-text"
    ).innerHTML;
    const patternName = document.querySelector(
      "#pattern .pseudo-select-text"
    ).innerHTML;
    const imageName =
      params.patternId == 17 ? textureName : textureName + " " + patternName;

    return resizeImage(canvas.toDataURL(), { maxSize: 800 }).then((image) => {
      return postJson("/app/image-upload", {
        name: imageName,
        image: image,
      }).then((response) => {
        this.imgSrc = response.imgSrc;
        this.color = response.color;
      });
    });
  }
}
