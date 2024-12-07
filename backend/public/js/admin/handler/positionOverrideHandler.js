class PositionOverrideHandler {
  constructor(element, id, positionsObject, type) {
    this.element = element;
    this.id = id;
    this.positionsObject = positionsObject;
    this.type = type;
    this.inputs = [];
    this.regionFlagMap = {
      eu: "Europe \u{1F1EA}\u{1F1FA} \u{1F1EC}\u{1F1E7} \u{1F1F3}\u{1F1F4}",
      na: "North America \u{1F1FA}\u{1F1F8} \u{1F1E8}\u{1F1E6} \u{1F1F2}\u{1F1FD}",
      sa: "South America \u{1F1E7}\u{1F1F7} \u{1F1E6}\u{1F1F7} \u{1F1E8}\u{1F1F4}",
      oc: "Oceania \u{1F1E6}\u{1F1FA} \u{1F1F3}\u{1F1FF} \u{1F1F5}\u{1F1EC}",
      as: "Asia \u{1F1EE}\u{1F1F3} \u{1F1E8}\u{1F1F3} \u{1F1EF}\u{1F1F5}",
      af: "Africa \u{1F1FF}\u{1F1E6} \u{1F1F3}\u{1F1EC} \u{1F1EA}\u{1F1F9}",
    };
  }

  init() {
    this.createPositionsHtml();
    this.insertPositionsHtml();
  }

  // create HTML for position
  createPositionsHtml() {
    let regionHtml = [];
    for (const regionISO in this.positionsObject) {
      // organise data in usable variables
      const regionName = this.regionFlagMap[regionISO.toLowerCase()];
      const asset = this.positionsObject[regionISO].find(
        (item) => item.id === this.id
      );
      if (asset.category !== null) {
        regionHtml.push(this.showWithCategory(asset, regionISO, regionName));
      } else {
        regionHtml.push(this.showWithoutCategory(asset, regionISO, regionName));
      }
    }

    this.html = createHtml({
      tag: "details",
      class: "admin-section m-gap fc",
      children: [
        {
          tag: "summary",
          class: "pntr",
          style: "font-size: var(--medium-text);",
          text: "Positioning",
        },
        ...regionHtml,
      ],
    });
  }

  showWithCategory(asset, regionISO, regionName) {
    this.assetsInCategory = this.positionsObject[regionISO].filter(
      (item) => item.category === asset.category
    );
    this.assetsInCategoryByPosition = this.assetsInCategory
      .slice()
      .sort(this.sortByPosition);

    const region = "position-" + regionISO.toLowerCase();

    const assetByWeight = this.positionsObject[regionISO]
      .slice()
      .sort(this.sortByWeight);
    const assetInCategoryByWeight = this.assetsInCategory
      .slice()
      .sort(this.sortByWeight);

    const ovVal =
      artx?.positionInputs?.[region + "-overall-" + asset.id] ||
      (asset.override ? asset.position : "");
    const catVal =
      artx?.positionInputs?.[region + "-category-" + asset.id] ||
      (asset.override
        ? this.assetsInCategoryByPosition.indexOf(asset) + 1
        : "");
    const untilVal =
      artx?.positionInputs?.[region + "-until-" + asset.id] || asset.until;

    return createHtml({
      tag: "div",
      children: [
        { tag: "div", text: regionName },
        {
          tag: "div",
          class: "sardine-tin admin-position-options",
          children: [
            {
              tag: "div",
              class: "input-group fc xs-gap",
              children: [
                {
                  tag: "label",
                  class: "inlab",
                  for:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-overall-" +
                    asset.id,
                  text:
                    "overall (default " +
                    (assetByWeight.findIndex((a) => a.id === asset.id) + 1) +
                    " of " +
                    this.positionsObject[regionISO].length +
                    ")",
                },
                {
                  tag: "input",
                  type: "number",
                  min: 0,
                  max: this.positionsObject[regionISO].length,
                  id:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-overall-" +
                    asset.id,
                  value: ovVal,
                },
              ],
            },
            {
              tag: "div",
              class: "input-group fc xs-gap",
              children: [
                {
                  tag: "label",
                  class: "inlab",
                  for:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-category-" +
                    asset.id,
                  text:
                    "category (default " +
                    (assetInCategoryByWeight.findIndex(
                      (a) => a.id === asset.id
                    ) +
                      1) +
                    " of " +
                    this.assetsInCategoryByPosition.length +
                    ")",
                },
                {
                  tag: "input",
                  type: "number",
                  min: 0,
                  max: this.assetsInCategoryByPosition.length,
                  id:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-category-" +
                    asset.id,
                  value: catVal,
                },
              ],
            },
            {
              tag: "div",
              class: "input-group fc xs-gap",
              children: [
                {
                  tag: "label",
                  class: "inlab",
                  for:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-until-" +
                    asset.id,
                  text: "until",
                },
                {
                  tag: "input",
                  type: "date",
                  id:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-until-" +
                    asset.id,
                  min: new Date().toISOString().split("T")[0],
                  value: untilVal,
                },
              ],
            },
          ],
        },
      ],
    });
  }

  showWithoutCategory(asset, regionISO, regionName) {
    let region = "position-" + regionISO.toLowerCase();

    const assetByWeight = this.positionsObject[regionISO]
      .slice()
      .sort(this.sortByWeight);
    const ovVal =
      artx?.positionInputs?.[region + "-overall-" + asset.id] || asset.position;
    const untilVal =
      artx?.positionInputs?.[region + "-until-" + asset.id] || asset.until;

    return createHtml({
      tag: "div",
      children: [
        { tag: "div", text: regionName },
        {
          tag: "div",
          class: "sardine-tin admin-position-options",
          children: [
            {
              tag: "div",
              class: "input-group fc xs-gap",
              children: [
                {
                  tag: "label",
                  class: "inlab",
                  for:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-overall-" +
                    asset.id,
                  text:
                    "overall (default " +
                    (assetByWeight.findIndex((a) => a.id === asset.id) + 1) +
                    " of " +
                    this.positionsObject[regionISO].length +
                    ")",
                },
                {
                  tag: "input",
                  type: "number",
                  min: 0,
                  max: this.positionsObject[regionISO].length,
                  id:
                    "position-" +
                    regionISO.toLowerCase() +
                    "-overall-" +
                    asset.id,
                  value: ovVal,
                },
              ],
            },
            {
              tag: "div",
              class: "input-group fc xs-gap",
              children: [
                {
                  tag: "label",
                  class: "inlab",
                  for: "position-" + regionISO.toLowerCase() + "-until",
                  text: "until",
                },
                {
                  tag: "input",
                  type: "date",
                  id: "position-" + regionISO.toLowerCase() + "-until",
                  min: new Date().toISOString().split("T")[0],
                  value: untilVal,
                },
              ],
            },
          ],
        },
      ],
    });
  }

  // insert HTML into DOM
  insertPositionsHtml() {
    this.element.append(this.html);
  }

  // add event listeners
  addEventListeners() {
    document
      .querySelectorAll(".admin-position-options input")
      .forEach((input) => {
        input.addEventListener("input", () => {
          if (
            typeof artx.modified.positions !== "object" ||
            artx.modified.positions === null
          ) {
            artx.modified.positions = {};
          }

          let positionType = "";
          const region = input.id.split("-")[1];
          const table = this.type === "materials" ? "protextures" : "textures";

          if (input.id.split("-")[2].includes("overall")) {
            positionType = "overall";
          } else if (input.id.split("-")[2].includes("category")) {
            positionType = "category";
          }

          if (
            typeof artx.modified.positions.override !== "object" ||
            artx.modified.positions.override === null
          ) {
            artx.modified.positions.override = {};
          }

          if (
            typeof artx.modified.positions.override[region] !== "object" ||
            artx.modified.positions.override[region] === null
          ) {
            artx.modified.positions.override[region] = {};
          }

          if (Number(input.value) === 0 || input.value === "") {
            artx.modified.positions.override[region].position = null;
          } else if (positionType === "overall") {
            // handle position outside allowed range
            if (
              Number(input.value) > Number(input.max) ||
              Number(input.value) < Number(input.min)
            ) {
              addNotification({
                text: "Position is outside of range",
                image: "warning",
                duration: 2000,
              });
              input.value =
                Number(input.value) > Number(input.max)
                  ? Number(input.max)
                  : Number(input.min);
            }
            artx.modified.positions.override[region].position = Number(
              input.value
            );
          } else if (positionType === "category") {
            // handle position outside allowed range
            if (!this.assetsInCategoryByPosition[Number(input.value) - 1]) {
              addNotification({
                text: "Position is outside of range",
                image: "warning",
                duration: 2000,
              });
              input.value =
                Number(input.value) <= 0
                  ? 1
                  : this.assetsInCategoryByPosition.length;
            }
            const position =
              this.assetsInCategoryByPosition[Number(input.value) - 1].position;
            artx.modified.positions.override[region].position =
              position <= 0 ? 1 : position;
          } else {
            // handle until date
            artx.modified.positions.override[region].until = input.value;
          }

          artx.modified.positions = {
            override: { ...artx.modified.positions.override },
            id: this.id,
            type: this.type,
            table: table,
          };

          this.manageInputValues(input, region);
        });
      });
  }

  manageInputValues(input, region) {
    if (artx.positionInputs === undefined) {
      artx.positionInputs = {};
    }
    const assetId = input.id.split("-").pop();

    if (
      !input.id.startsWith("position-" + region + "-until") &&
      (input.value === null || Number(input.value) === 0 || input.value === "")
    ) {
      artx.positionInputs["position-" + region + "-category-" + assetId] = "-";
      artx.positionInputs["position-" + region + "-overall-" + assetId] = "-";
      artx.positionInputs["position-" + region + "-until-" + assetId] = "-";
    } else {
      artx.positionInputs[input.id] = input.value;
    }
  }

  sortByWeight(a, b) {
    if (Number(a.weight) > Number(b.weight)) return -1;
    if (Number(a.weight) < Number(b.weight)) return 1;
    if (Number(a.id) > Number(b.id)) return 1;
    if (Number(a.id) < Number(b.id)) return -1;
    return 0;
  }

  sortByPosition(a, b) {
    if (Number(a.position) > Number(b.position)) return 1;
    if (Number(a.position) < Number(b.position)) return -1;
    return 0;
  }

  static savePositions(positions) {
    return postJson("/app/reposition-texmat", { positions: positions }).then(
      (response) => {
        return response.rawResponse.status === 200;
      }
    );
  }
}
