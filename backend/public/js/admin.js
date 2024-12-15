config.materialSizes = [200, 400, 800, 1600, 2500, 4000, 6000];
//config.materialSizes = [200, 400];

config.pageData = { id: null };

config.areas = {
  apps: {
    name: "Apps",
    singular: "app",
    showColumns:
      config.user.type === "brand" ? ["name"] : ["name", "brands_name"],
    showIds: true,
    showPreview: "/create?appid=",
    showAddButton: config.user.type === "brand" ? false : true,
    table: "apps",
    query: {
      table: "apps",
      join: {
        table: "brands",
        columns: ["name", "website_link"],
        on: ["brand", "=", "id"],
      },
      owned: config.user.type === "brand" ? true : false,
      limit: config.state.limit,
      auth: true,
    },
    showDeleteButton: config.user.type === "admin" ? true : false,
    itemClick: async function (item) {
      let page = createSinglePage(
        item,
        "App",
        item.name ? item.name : "New app",
        true
      );
      let patternsDbox = {
        table: "patterns",
        type: "checkbox",
        selected: item.patterns ? item.patterns : [],
      };
      let materialsDbox = {
        table: "protextures",
        title: "Materials",
        modify: "materials",
        type: "checkbox",
        selected: item.materials ? item.materials : [],
      };
      let brandsDbox = {
        table: "brands",
        modify: "brand",
        type: "radio",
        selected: item.brand ? [item.brand] : [],
      };
      let jointsDbox = {
        modify: "joints",
        title: "Joints",
        type: "checkbox",
        query: {
          table: "protextures",
          where: [
            ["category", "=", "Joint"],
            ["status", "=", "live"],
          ],
        },
        selected: item.joints ? item.joints : [],
      };
      let texturesDbox = {
        table: "textures",
        type: "checkbox",
        selected: item.textures ? item.textures : [],
      };
      let finishesDbox = {
        table: "heightmaps",
        modify: "finishes",
        type: "checkbox",
        selected: item.finishes ? item.finishes : [],
      };
      let profilesDbox = {
        table: "paths",
        modify: "profiles",
        type: "checkbox",
        selected: item.profiles ? item.profiles : [],
      };
      let scenesDbox = {
        table: "scenes",
        type: "checkbox",
        selected: item.scenes ? item.scenes : [],
      };
      if (config.user.type === "brand") {
        [
          patternsDbox,
          materialsDbox,
          texturesDbox,
          finishesDbox,
          profilesDbox,
          scenesDbox,
        ].forEach(function (dbox) {
          dbox.query = {
            table: dbox.table,
            where: [["brand", "=", config.user.brand, "OR", "IS NULL"]],
            limit: 1000,
          };
        });
      }
      let content = createHtml({
        tag: "div",
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
                        "data-column": "name",
                        type: "text",
                        value: item.name ? item.name : "",
                        placeholder: "App name",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    style: ["editor", "admin"].includes(config.user.type)
                      ? ""
                      : "display:none;",
                    children: [
                      { tag: "div", class: "input-label", text: "brand" },
                      {
                        tag: "div",
                        class: "dbox-menu-trigger input",
                        "data-dbox": JSON.stringify(brandsDbox),
                        text: item.brands_name ? item.brands_name : "",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    id: "admin-app-view",
                    style: item.id ? "" : "display:none;",
                    children: [
                      { tag: "div", class: "input-label", text: "view" },
                      {
                        tag: "a",
                        text: "View app",
                        class: "input link-input",
                        target: "_blank",
                        href: "/create?appid=" + item.id,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "Assets" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "patterns" },
                      {
                        tag: "div",
                        text: "Select patterns",
                        class: "input",
                        "data-dbox": JSON.stringify(patternsDbox),
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "materials" },
                      {
                        tag: "div",
                        text: "Select materials",
                        class: "input",
                        "data-dbox": JSON.stringify(materialsDbox),
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "joints" },
                      {
                        tag: "div",
                        text: "Select joints",
                        class: "input",
                        "data-dbox": JSON.stringify(jointsDbox),
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
                      { tag: "div", class: "input-label", text: "textures" },
                      {
                        tag: "div",
                        text: "Select textures",
                        class: "input",
                        "data-dbox": JSON.stringify(texturesDbox),
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "scenes" },
                      {
                        tag: "div",
                        text: "Select scenes",
                        class: "input",
                        "data-dbox": JSON.stringify(scenesDbox),
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "finishes" },
                      {
                        tag: "div",
                        text: "Select finishes",
                        class: "input",
                        "data-dbox": JSON.stringify(finishesDbox),
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "profiles" },
                      {
                        tag: "div",
                        text: "Select profiles",
                        class: "input",
                        "data-dbox": JSON.stringify(profilesDbox),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "User interface" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "upload" },
                      {
                        tag: "div",
                        id: "admin-app-icon-upload",
                        type: "text",
                        class: "input upload-input",
                        text: "Icon image",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "show elements",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "UI elements to show, enter a comma separated list of CSS selectors",
                          },
                        ],
                      },
                      {
                        tag: "input",
                        type: "text",
                        placeholder: "[]",
                        value: item.ui_show ? item.ui_show : "",
                        "data-custom": "ui_show",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "hide elements",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "UI elements to hide, enter a comma separated list of CSS selectors",
                          },
                        ],
                      },
                      {
                        tag: "input",
                        type: "text",
                        placeholder: "[]",
                        value: item.ui_hide ? item.ui_hide : "",
                        "data-custom": "ui_hide",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "Embed code" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "code",
                    class: "input",
                    children: [
                      '<iframe src="https://architextures.org/create?appid=' +
                        item.id +
                        '"></iframe>',
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              {
                tag: "h3",
                children: [
                  "Custom CSS",
                  {
                    tag: "span",
                    class: "tooltip-icon",
                    "data-tooltip":
                      "Enter CSS below to override the default styles",
                  },
                ],
              },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "textarea",
                    "data-column": "css",
                    o: {},
                    text: item.css ? item.css : "",
                  },
                ],
              },
            ],
          },
        ],
      });
      page.container.appendChild(content);

      document
        .querySelectorAll("[data-custom='ui_hide'], [data-custom='ui_show']")
        .forEach(function (element) {
          element.onchange = function () {
            let target = element.getAttribute("data-custom");
            config.modified[target] = JSON.stringify(element.value.split(","));
          };
        });

      // Icon upload
      element("#admin-app-icon-upload").onclick = function () {
        uploadLibrary({
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              config.modified.icon = upload.selectedItems[0].url;
            }
          },
        });
      };

      // Add the data box menu triggers
      uiListener();
      adminListeners();
    },
  },
  textures: {
    name: "Textures",
    singular: "texture",
    hasThumbnails: true,
    showColumns: ["name", "views", "downloads"],
    table: "textures",
    query: {
      table: "textures",
      owned: ["brand"].includes(config.user.type) ? true : false,
      limit: 24,
      auth: true,
      join: {
        table: "brands",
        columns: ["name", "id"],
        on: ["brand", "=", "id"],
      },
    },
    showIds: true,
    showDeleteButton: true,
    showAddButton: false,
    showPreview: "/create?id=",
    itemTarget: "#admin-single-textures",
  },
  materials: {
    name: "Materials",
    showIds: true,
    hasThumbnails: true,
    singular: "material",
    table: "protextures",
    query: {
      table: "protextures",
      columns: [
        "id",
        "name",
        "category",
        "status",
        "color",
        "country",
        "thumbnail",
        "deleted_at",
      ],
      owned: ["brand"].includes(config.user.type) ? true : false,
      limit: 24,
      auth: true,
      join: {
        table: "brands",
        columns: ["name", "id"],
        on: ["brand", "=", "id"],
      },
    },
    showColumns: ["name", "category", "status"],
    //replaceColumnNames: {"user_firstname": "user"},
    showDeleteButton: true,
    showAddButton: true,
    showPreview: "/create?materialId=",
    itemTarget: "#admin-single-protextures",
  },
  users: {
    name: "Users",
    singular: "user",
    table: "users",
    query: {
      table: "users",
      columns: ["id", "email", "expires", "company", "referral"],
      limit: 24,
      auth: true,
    },
    showIds: true,
    showColumns: ["email", "expires", "company", "referral"],
    showDeleteButton: true,
    showAddButton: false,
    itemTarget: "#admin-single-users",
  },
  pages: {
    name: "Pages",
    singular: "page",
    table: "pages",
    query: {
      table: "pages",
      columns: ["id", "title", "category", "slug"],
      limit: 24,
      auth: true,
    },
    showColumns: ["title", "category"],
    showDeleteButton: true,
    showAddButton: true,
    showPreview: "/page/",
    itemClick: function (item) {
      let pagesPage = createSinglePage(
        item,
        "Pages",
        item.id ? item.title : "New page"
      );
      let pageHtml = createHtml({
        tag: "div",
        id: "admin-single-pages",
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
                      { tag: "div", class: "input-label", text: "title" },
                      {
                        tag: "input",
                        type: "text",
                        value: item.id ? item.title : "",
                        "data-column": "title",
                      },
                    ],
                  },
                  {
                    tag: "a",
                    href: item.id ? "/page/" + item.slug : "",
                    target: "_blank",
                    class: "input square-input",
                    children: [
                      { tag: "img", src: config.cdn + "/icons/eye.svg" },
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
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "slug",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "The slug is the final part of the URL. It should be lowercase and contain no spaces or special characters.",
                          },
                        ],
                      },
                      {
                        tag: "input",
                        value: item.id ? item.slug : "",
                        type: "text",
                        "data-column": "slug",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "category" },
                      {
                        tag: "select",
                        "data-column": "category",
                        children: [
                          { tag: "option", disabled: true, text: "-" },
                          { tag: "option", value: "News", text: "News" },
                          {
                            tag: "option",
                            value: "Tutorial",
                            text: "Tutorial",
                          },
                          {
                            tag: "option",
                            value: "Documentation",
                            text: "Documentation",
                          },
                          { tag: "option", value: "Legal", text: "Legal" },
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
            class: "admin-section",
            children: [
              { tag: "h2", text: "Content" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    "data-add-link": "",
                    class: "input",
                    text: "🔗 Add link",
                  },
                  {
                    tag: "div",
                    "data-add-media": "",
                    class: "input",
                    text: "➕ Add media",
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
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "markdown",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "<a href='https://www.markdownguide.org/cheat-sheet/'>Markdown cheatsheet</a>",
                          },
                        ],
                      },
                      {
                        tag: "textarea",
                        type: "text",
                        style: "min-height:1000px;",
                        "data-column": "markdown",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      pagesPage.container.appendChild(pageHtml);

      let markdownInput = pageHtml.querySelector("[data-column='markdown']");
      let titleInput = pageHtml.querySelector("[data-column='title']");
      let slugInput = pageHtml.querySelector("[data-column='slug']");
      let categoryInput = pageHtml.querySelector("[data-column='category']");
      let addLinkInput = pageHtml.querySelector("[data-add-link]");
      let addMediaInput = pageHtml.querySelector("[data-add-media]");
      let previewButton = pageHtml.querySelector("a");

      // Set the slug when the page is created
      titleInput.onchange = function () {
        if (slugInput.value === "")
          slugInput.value = trainify(titleInput.value);
        slugInput.dispatchEvent(new Event("change"));
      };

      slugInput.addEventListener("change", function () {
        previewButton.href = "/page/" + slugInput.value;
      });

      addLinkInput.onclick = function () {
        let modal = createModal(
          "Add link",
          createHtml({
            tag: "div",
            class: "section",
            children: [
              {
                tag: "div",
                class: "input-block",
                children: [
                  { tag: "div", class: "input-label", text: "Text" },
                  { tag: "input", "data-text": "", type: "text" },
                ],
              },
              {
                tag: "div",
                class: "input-block",
                children: [
                  { tag: "div", class: "input-label", text: "URL" },
                  { tag: "input", "data-url": "", type: "text" },
                ],
              },
              {
                tag: "button",
                "data-add-link-button": "",
                class: "input-block",
                text: "Add link",
              },
            ],
          })
        );

        modal.querySelector("[data-add-link-button]").onclick = function () {
          modal.remove();
          const cursorPos = markdownInput.selectionStart;
          let text = markdownInput.value;
          let linkString =
            "[" +
            modal.querySelector("[data-text]").value +
            "](" +
            modal.querySelector("[data-url]").value +
            ")";
          markdownInput.value =
            text.substring(0, cursorPos) +
            linkString +
            text.substring(cursorPos);
          markdownInput.dispatchEvent(new Event("change"));
          markdownInput.focus();
          markdownInput.setSelectionRange(cursorPos, cursorPos);
        };
      };

      addMediaInput.onclick = function () {
        uploadLibrary({
          selectMultiple: true,
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              const cursorPos = markdownInput.selectionStart;
              let text = markdownInput.value;
              let mediaStrings = [];
              upload.selectedItems.forEach(function (media) {
                mediaString = "";
                if (
                  [
                    "jpeg",
                    "jpg",
                    "png",
                    "svg",
                    "gif",
                    "bmp",
                    "tiff",
                    "webp",
                    "avif",
                  ].includes(media.format.toLowerCase())
                ) {
                  mediaString =
                    "![" + media.name + "](" + config.cdn + media.url + ")";
                } else if (["mp4"].includes(media.format)) {
                  mediaString =
                    "<span><video autoplay muted loop><source src='" +
                    config.cdn +
                    media.url +
                    "' type='video/mp4'/></video></span>";
                } else {
                  mediaString =
                    "[" + media.name + "](" + config.cdn + media.url + ")";
                }
                mediaStrings.push(mediaString);
              });
              markdownInput.value =
                text.substring(0, cursorPos) +
                "" +
                mediaStrings.join("\n\n") +
                "" +
                text.substring(cursorPos);
              markdownInput.dispatchEvent(new Event("change"));
              markdownInput.focus();
              markdownInput.setSelectionRange(cursorPos, cursorPos);
            }
          },
        });
      };

      // Get the existing markdown
      if (item.id) {
        categoryInput.value = item.category;
        query({
          table: "pages",
          id: item.id,
          columns: ["markdown"],
        }).then(function (response) {
          markdownInput.innerHTML = response.results[0].markdown;
        });
      }
    },
  },
  stories: {
    name: "Stories",
    singular: "story",
    table: "stories",
    query: {
      table: "stories",
      columns: [
        "id",
        "title",
        "category",
        "theme",
        "slug",
        "author",
        "published_at",
      ],
      limit: 24,
      auth: true,
    },
    showColumns: ["title", "category", "theme"],
    showDeleteButton: true,
    showAddButton: true,
    showPreview: "/admin/stories/preview/",
    itemClick: function (item) {
      let saveCallback = function (response) {
        if (response.status === "success" && response.hasOwnProperty("id")) {
          document
            .querySelector("#preview-button")
            .classList.remove("disabled");
          document.querySelector("#preview-button").href =
            "/admin/stories/preview/" + response.id;
        }
      };
      let storiesPage = createSinglePage(
        item,
        "Stories",
        item.id ? item.title : "New story",
        true,
        false,
        saveCallback
      );
      let pageHtml = createHtml({
        tag: "div",
        id: "admin-single-stories",
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
                      { tag: "div", class: "input-label", text: "title" },
                      {
                        tag: "input",
                        type: "text",
                        value: item.id ? item.title : "",
                        "data-column": "title",
                      },
                    ],
                  },
                  {
                    tag: "a",
                    id: "preview-button",
                    href: item.id ? "/admin/stories/preview/" + item.id : "",
                    target: "_blank",
                    class: "input square-input" + (item.id ? "" : " disabled"),
                    children: [
                      { tag: "img", src: config.cdn + "/icons/eye.svg" },
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
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "slug",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "The slug is the final part of the URL. It should be lowercase and contain no spaces or special characters.",
                          },
                        ],
                      },
                      {
                        tag: "input",
                        value: item.id && item.slug ? item.slug : "",
                        type: "text",
                        "data-column": "slug",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "author",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "The slug is the final part of the URL. It should be lowercase and contain no spaces or special characters.",
                          },
                        ],
                      },
                      {
                        tag: "input",
                        value: item.id && item.author ? item.author : "",
                        type: "text",
                        "data-column": "author",
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
                      { tag: "div", class: "input-label", text: "category" },
                      {
                        tag: "select",
                        "data-column": "category",
                        children: [
                          { tag: "option", disabled: true, text: "-" },
                          ...config.stories.categories.map((category) => ({
                            tag: "option",
                            value: category,
                            text: category,
                          })),
                        ],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "theme" },
                      {
                        tag: "select",
                        "data-column": "theme",
                        children: [
                          { tag: "option", disabled: true, text: "-" },
                          ...config.stories.themes.map((theme) => ({
                            tag: "option",
                            value: theme,
                            text: theme,
                          })),
                        ],
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
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "thumbnail",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "Thumbnails are only shown on Stories",
                          },
                        ],
                      },
                      {
                        tag: "div",
                        "data-add-thumbnail": "",
                        class: "input upload-input",
                        text: item.thumbnail
                          ? item.thumbnail
                          : "No thumbnail selected",
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
                          {
                            tag: "div",
                            class: "input-label",
                            children: [
                              "publish at",
                              {
                                tag: "span",
                                class: "tooltip-icon",
                                "data-tooltip":
                                  "Publish time is only used for Stories",
                              },
                            ],
                          },
                          {
                            tag: "input",
                            class: "input",
                            "data-column": "published_at",
                            type: "datetime-local",
                            "data-published-at": "",
                            value: item.published_at ? item.published_at : null,
                          },
                        ],
                      },
                      {
                        tag: "div",
                        class: "input square-input cc",
                        "data-publish-now": "",
                        text: "Now",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h2", text: "Content" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    "data-add-link": "",
                    class: "input",
                    text: "🔗 Add link",
                  },
                  {
                    tag: "div",
                    "data-add-media": "",
                    class: "input",
                    text: "➕ Add media",
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
                      {
                        tag: "div",
                        class: "input-label",
                        children: [
                          "markdown",
                          {
                            tag: "span",
                            class: "tooltip-icon",
                            "data-tooltip":
                              "<a href='https://www.markdownguide.org/cheat-sheet/'>Markdown cheatsheet</a>",
                          },
                        ],
                      },
                      {
                        tag: "textarea",
                        type: "text",
                        style: "min-height:1000px;",
                        "data-column": "markdown",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      storiesPage.container.appendChild(pageHtml);

      let markdownInput = pageHtml.querySelector("[data-column='markdown']");
      let titleInput = pageHtml.querySelector("[data-column='title']");
      let slugInput = pageHtml.querySelector("[data-column='slug']");
      let categoryInput = pageHtml.querySelector("[data-column='category']");
      let themeInput = pageHtml.querySelector("[data-column='theme']");
      let addLinkInput = pageHtml.querySelector("[data-add-link]");
      let addMediaInput = pageHtml.querySelector("[data-add-media]");
      let addThumbnailInput = pageHtml.querySelector("[data-add-thumbnail]");
      let publishedAtInput = pageHtml.querySelector("[data-published-at]");
      let publishNowButton = pageHtml.querySelector("[data-publish-now]");

      // Set the slug when the page is created
      titleInput.onchange = function () {
        if (slugInput.value === "")
          slugInput.value = trainify(titleInput.value);
        slugInput.dispatchEvent(new Event("change"));
      };

      addLinkInput.onclick = function () {
        let modal = createModal(
          "Add link",
          createHtml({
            tag: "div",
            class: "section",
            children: [
              {
                tag: "div",
                class: "input-block",
                children: [
                  { tag: "div", class: "input-label", text: "Text" },
                  { tag: "input", "data-text": "", type: "text" },
                ],
              },
              {
                tag: "div",
                class: "input-block",
                children: [
                  { tag: "div", class: "input-label", text: "URL" },
                  { tag: "input", "data-url": "", type: "text" },
                ],
              },
              {
                tag: "button",
                "data-add-link-button": "",
                class: "input-block",
                text: "Add link",
              },
            ],
          })
        );

        modal.querySelector("[data-add-link-button]").onclick = function () {
          modal.remove();
          const cursorPos = markdownInput.selectionStart;
          let text = markdownInput.value;
          let linkString =
            "[" +
            modal.querySelector("[data-text]").value +
            "](" +
            modal.querySelector("[data-url]").value +
            ")";
          markdownInput.value =
            text.substring(0, cursorPos) +
            linkString +
            text.substring(cursorPos);
          markdownInput.dispatchEvent(new Event("change"));
          markdownInput.focus();
          markdownInput.setSelectionRange(cursorPos, cursorPos);
        };
      };

      addMediaInput.onclick = function () {
        uploadLibrary({
          selectMultiple: true,
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              const cursorPos = markdownInput.selectionStart;
              let text = markdownInput.value;
              let mediaStrings = [];
              upload.selectedItems.forEach(function (media) {
                mediaString = "";
                if (
                  [
                    "jpeg",
                    "jpg",
                    "png",
                    "svg",
                    "gif",
                    "bmp",
                    "tiff",
                    "webp",
                    "avif",
                  ].includes(media.format.toLowerCase())
                ) {
                  mediaString =
                    "![" + media.name + "](" + config.cdn + media.url + ")";
                } else if (["mp4"].includes(media.format)) {
                  mediaString =
                    "<span><video autoplay muted loop><source src='" +
                    config.cdn +
                    media.url +
                    "' type='video/mp4'/></video></span>";
                } else {
                  mediaString =
                    "[" + media.name + "](" + config.cdn + media.url + ")";
                }
                mediaStrings.push(mediaString);
              });
              markdownInput.value =
                text.substring(0, cursorPos) +
                "" +
                mediaStrings.join("\n\n") +
                "" +
                text.substring(cursorPos);
              markdownInput.dispatchEvent(new Event("change"));
              markdownInput.focus();
              markdownInput.setSelectionRange(cursorPos, cursorPos);
            }
          },
        });
      };

      addThumbnailInput.onclick = function () {
        uploadLibrary({
          selectMultiple: false,
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              config.modified.thumbnail = upload.selectedItems[0].url;
              addThumbnailInput.innerHTML = upload.selectedItems[0].url;
            } else {
              config.modified.thumbnail = null;
              addThumbnailInput.innerHTML = "No thumbnail selected";
            }
          },
        });
      };

      publishNowButton.onclick = function () {
        publishedAtInput.value = new Date().toISOString().slice(0, -8);
        config.modified.published_at = publishedAtInput.value;
      };

      // Get the existing markdown
      if (item.id) {
        categoryInput.value = item.category;
        themeInput.value = item.theme;
        query({
          table: "stories",
          id: item.id,
          columns: ["markdown"],
        }).then(function (response) {
          markdownInput.innerHTML = response.results[0].markdown;
        });
      }
    },
  },
  brands: {
    name: "Brands",
    singular: "brand",
    table: "brands",
    query: {
      table: "brands",
      columns: ["id", "name", "logo", "description", "website_link", "country"],
      limit: 24,
      auth: true,
      join: {
        table: "brand_tiers",
        columns: [
          "tier",
          "material_limit",
          "publish_limit",
          "formats",
          "max_statistics",
        ],
        on: ["id", "=", "brand"],
      },
    },
    showColumns: ["name"],
    showDeleteButton: true,
    showAddButton: true,
    itemClick: function (item) {
      const tiers = config.brandTiers;

      let brandPage = createSinglePage(
        item,
        "Brand",
        item.id ? item.name : "New brand"
      );
      let uploadButton = createHtml({
        tag: "div",
        class: "input upload-input",
        children: [
          {
            tag: "img",
            style: "max-width: 70%; max-height: 70%;",
            src: item.logo ? config.cdn + item.logo : "",
          },
        ],
      });
      uploadButton.onclick = function () {
        uploadLibrary({
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              config.modified.logo = upload.selectedItems[0].url;
              uploadButton.querySelector("img").src =
                config.cdn + upload.selectedItems[0].url;
            }
          },
        });
      };

      let countries = config.countries;
      countries = sortCountries(countries);
      let currentCountry = item.country
        ? countries.find((c) => c.Iso2 === item.country)
        : null;
      currentCountry = currentCountry ? currentCountry.name : null;

      let brandUsers = createDatabox({
        query: {
          table: "users",
          columns: ["id", "firstname", "lastname", "email"],
          where: [["brand", "=", item.id]],
          limit: 12,
          auth: true,
        },
        itemHtml: function (user) {
          return createHtml({
            tag: "a",
            href: window.location.origin + "/admin/users/" + user.id,
            class: "cv s-gap",
            children: [
              {
                tag: "div",
                class: "cc",
                style:
                  "width: 35px; height: 35px; object-fit: cover;border-radius:var(--radius);background: #eee;",
                children: [
                  {
                    tag: "img",
                    src: config.cdn + "/icons/user2.svg",
                    width: "20px",
                    style: "opacity:0.6;",
                  },
                ],
              },
              user.firstname + " " + user.lastname + " (" + user.email + ")",
            ],
          });
        },
      });
      brandUsers.itemContainer.classList.add("s-gap");
      brandUsers.itemContainer.classList.add("fc");
      brandUsers.container.classList.add("s-gap");
      brandUsers.container.classList.add("fc");

      let brandSaves = createDatabox({
        query: {
          table: "saves",
          columns: ["id", "imgurl", "user", "created_at", "name"],
          where: [["users.brand", "=", item.id]],
          join: {
            table: "users",
            on: ["user", "=", "id"],
            columns: ["firstname", "lastname", "email"],
          },
          sort: ["id", "DESC"],
          limit: 12,
          auth: true,
        },
        itemHtml: function (saved) {
          console.log("Saved", saved)
          return createHtml({
            tag: "a",
            target: "_blank",
            style: "overflow:hidden;border-radius:var(--radius);",
            class: "df s-gap cv sh",
            href: window.location.origin + "/create?save=" + saved._id,
            children: [
              {
                tag: "div",
                class: "df s-gap cv",
                children: [
                  {
                    tag: "img",
                    src: config.cdn + saved.imgurl,
                    style:
                      "width: 35px; height: 35px; object-fit: cover;border-radius:var(--radius);",
                  },
                  { tag: "div", text: saved.name },
                ],
              },
              naturalTimeDifference(saved.created_at),
            ],
          });
        },
        moreButton: function () {
          return createHtml({
            tag: "div",
            class: "nav-menu-item cc",
            children: [
              { tag: "img", width: "25px", src: config.cdn + "/icons/down.svg" },
            ],
          });
        },
      });
      brandSaves.itemContainer.classList.add("s-gap");
      brandSaves.itemContainer.classList.add("fc");
      brandSaves.container.classList.add("s-gap");
      brandSaves.container.classList.add("fc");

      let brandDownloads = createDatabox({
        query: {
          table: "downloads",
          columns: ["id", "user", "created_at"],
          where: [["users.brand", "=", item.id]],
          join: {
            table: "users",
            on: ["user", "=", "id"],
            columns: ["firstname", "lastname", "email"],
          },
          sort: ["id", "DESC"],
          limit: 12,
          auth: true,
        },
        itemHtml: function (download) {
          return createHtml({
            tag: "a",
            style: "overflow:hidden;border-radius:var(--radius);",
            target: "_blank",
            class: "df s-gap cv sh",
            href: window.location.origin + "/create?download=" + download.id,
            children: [
              {
                tag: "div",
                class: "df s-gap cv",
                children: [
                  {
                    tag: "div",
                    src: config.cdn + download.imgurl,
                    style:
                      "width: 35px; height: 35px; background-color: #eee;border-radius:var(--radius);",
                  },
                  { tag: "div", text: "Untitled" },
                ],
              },
              { tag: "div", text: naturalTimeDifference(download.created_at) },
            ],
          });
        },
      });
      brandDownloads.itemContainer.classList.add("s-gap");
      brandDownloads.itemContainer.classList.add("fc");
      brandDownloads.container.classList.add("s-gap");
      brandDownloads.container.classList.add("fc");

      let brandHtml = createHtml({
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
                "data-brand": "top-row",
                children: [
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "name" },
                      {
                        tag: "input",
                        type: "text",
                        "data-column": "name",
                        value: item.name ? item.name : "",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "website" },
                      {
                        tag: "input",
                        type: "text",
                        "data-column": "website_link",
                        value: item.website_link ? item.website_link : "",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "logo" },
                      uploadButton,
                    ],
                  },
                  {
                    tag: "div",
                    "data-brand-country": "brands-selection",
                    children: [
                      { tag: "div", class: "input-label", text: "country" },
                      {
                        tag: "div",
                        class: "input",
                        "data-country": "select-brands-button",
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
                        text: item.description ? item.description : "",
                      },
                    ],
                  },
                ],
              },
            ],
          },
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
                      { tag: "div", class: "input-label", text: "tier" },
                      {
                        tag: "select",
                        class: "input",
                        "data-column": "select-brands-tier",
                        children: [
                          {
                            tag: "option",
                            value: "select",
                            text: "Select tier",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "materials" },
                      {
                        tag: "input",
                        class: "input",
                        "data-column": "select-tier-materials",
                        value: item.brand_tiers_material_limit || "unlimited",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "published assets",
                      },
                      {
                        tag: "input",
                        class: "input",
                        "data-column": "select-tier-assets",
                        value: item.brand_tiers_publish_limit || "unlimited",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "statistics days (7,30,90,180)",
                      },
                      {
                        tag: "input",
                        class: "input",
                        "data-column": "select-tier-statistics",
                        value: item.brand_tiers_max_statistics || "unlimited",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "formats (comma separated)",
                      },
                      {
                        tag: "button",
                        class: "input",
                        "data-tier-column": "select-tier-formats",
                        text: "Select formats",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [{ tag: "h3", text: "Users" }, brandUsers.container],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [{ tag: "h3", text: "Saves" }, brandSaves.container],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "Downloads" },
              brandDownloads.container,
            ],
          },
        ],
      });

      for (const tier of Object.entries(tiers)) {
        const option = createHtml({
          tag: "option",
          value: tier[1].tier,
          text: tier[1].tier,
        });
        if (
          item.brand_tiers_tier &&
          item.brand_tiers_tier.toLowerCase() === tier[1].tier.toLowerCase()
        ) {
          option.selected = "true";
        }
        brandHtml
          .querySelector("[data-column='select-brands-tier']")
          .appendChild(option);
      }

      brandPage.container.appendChild(brandHtml);

      const countryButton = document.querySelector(
        "[data-country='select-brands-button']"
      );
      const formatsButton = document.querySelector(
        "[data-tier-column='select-tier-formats']"
      );

      // create formats menu
      formatsButton.addEventListener("click", function () {
        if (!item.id) {
          showInfoMessage(
            "Error",
            "Please save the brand before changing formats. Initial formats will be default for the tier."
          );
          return;
        } else if (!item.brand_tiers_tier) {
          showInfoMessage(
            "Error",
            "Please save a tier before changing formats."
          );
          return;
        }

        const brandFormats = config.brand.brand_tiers_formats || false;

        const body = createHtml({
          tag: "div",
          style: "width: 250px; padding: 12px;",
        });
        config.brandTiers.ADVANCED.formats.forEach((format) => {
          const option = createHtml({
            tag: "label",
            "data-tiers": "brand-formats-label",
            style: "justify-content: space-between; padding: 5px;",
            children: [
              { tag: "div", text: format },
              { tag: "input", type: "checkbox" },
            ],
          });

          if (brandFormats && brandFormats.includes(format)) {
            option.querySelector("input").checked = true;
          }
          body.appendChild(option);
        });

        const saveButton = createHtml({
          tag: "button",
          "data-tier-formats": "save",
          style: "width: 100%;",
          text: "Save",
        });
        const modal = createModal("Select formats", body, saveButton);

        saveButton.addEventListener("click", function () {
          createLoadingScreen("Saving...");

          const formats = [];
          body.querySelectorAll("input").forEach((input) => {
            if (input.checked) {
              formats.push(input.parentNode.innerText);
            }
          });

          postJson("/app/query", {
            table: "brand_tiers",
            action: "update",
            auth: true,
            values: {
              formats: formats.join(","),
            },
            where: [["brand", "=", item.id]],
          }).then((response) => {
            if (response.status === "success") {
              removeLoadingScreen("Formats saved!");
              item.brand_tiers_formats = formats;
              modal.remove();
            } else {
              showInfoMessage(
                "Error",
                "Error when saving formats. No changes were made!"
              );
            }
          });
        });
      });

      // remove existing countries menu
      if (
        document.querySelectorAll(".nav-menu [data-country-code]").length !== 0
      ) {
        document
          .querySelector(".nav-menu [data-country-code]")
          .parentNode.parentNode.remove();
      }

      const countriesMenu = createContextMenu({
        items: countries,
        search: true,
        width: 285,
        height: 700,
        isHiddenOnClose: true,
        srcElement: countryButton,
        itemHtml: (country) =>
          createHtml({
            tag: "div",
            class: "nav-menu-item searchable-item",
            onclick:
              'selectCountry("' +
              country.Iso2 +
              '", "' +
              country.name +
              '", "select-brands-button")',
            "data-country-code": country.Iso2,
            text: country.name,
          }),
        anchorElement: countryButton,
      });
      countriesMenu.style.display = "none";

      countryButton.addEventListener("click", () => {
        countriesMenu.style.display =
          countriesMenu.style.display === "none" ? "block" : "none";
        document.querySelector(
          ".nav-menu [data-country-code]"
        ).parentNode.scrollTop = 0;
      });
      adminListeners();

      document.querySelector("[data-column='select-brands-tier']").onchange =
        function () {
          // remove select tier option for consistency
          document.querySelector("[data-column='select-brands-tier']")
            .options[0].value === "select"
            ? document
                .querySelector("[data-column='select-brands-tier']")
                .options[0].remove()
            : null;

          const tier = document.querySelector(
            "[data-column='select-brands-tier']"
          ).value;
          document.querySelector(
            "[data-column='select-tier-materials']"
          ).value = tiers[tier].material_limit || "unlimited";
          document.querySelector("[data-column='select-tier-assets']").value =
            tiers[tier].publish_limit || "unlimited";
          document.querySelector(
            "[data-column='select-tier-statistics']"
          ).value = tiers[tier].max_statistics || "unlimited";
          config.modified.brandTierFormats = tiers[tier].formats;
        };
    },
    itemTarget: "#admin-single-brands",
  },
  designOptionCategories: {
    name: "Categories",
    table: "design_option_categories",
    singular: "category",
    columns: ["id", "name"],
    showDeleteButton: true,
    showAddButton: true,
    itemTarget: "#admin-single-categories",
  },
  brand: {
    table: "brands",
    query: {
      table: "brands",
    },
    navClick: function () {
      config.modified = {};
      const brand = new Brand(config.user.brand);
      brand.generateBrandPage();
    },
  },
  team: {
    name: "Users",
    singular: "user",
    table: "users",
    query: {
      url: "/app/get-team",
      table: "users",
      limit: 24,
    },
    showColumns: ["email"],
    showAddButton: true,
    showSaveButton: false,
    showDeleteButton: true,
    showSearchBar: false,
    itemTarget: "#admin-single-license",
    itemsUnclickable: true,
    deleteUrl: "/app/delete-team-member",
  },
  saved: {
    name: "Textures",
    singular: "texture",
    hasThumbnails: true,
    table: "saves",
    query: {
      table: "saves",
      columns: ["id", "name", "imgurl", "color"],
      owned: ["user"].includes(config.user.type) ? true : false,
      auth: true,
      limit: 24,
    },
    showPreview: "/create?save=",
    showColumns: ["name"],
    showDeleteButton: true,
    showAddButton: false,
    itemTarget: "#admin-single-textures",
  },
  uploads: {
    name: "Materials",
    singular: "material",
    table: "user_materials",
    hasThumbnails: true,
    columns: ["id", "user", "name", "color"],
    query: {
      table: "user_materials",
      columns: ["id", "user", "name", "color"],
      owned: ["user"].includes(config.user.type) ? true : false,
      auth: true,
      limit: 24,
    },
    //showPreview: "/create?materialId=u",
    showColumns: ["name"],
    showDeleteButton: true,
    showAddButton: true,
    showSearchBar: false,
    itemTarget: "#admin-single-uploads",
  },
  downloads: {
    name: "Downloads",
    singular: "download",
    table: "downloads",
    query: {
      table: "downloads",
      columns: ["id", "created_at"],
      auth: true,
      owned: true,
      limit: config.state.limit,
    },
    showColumns: ["created_at"],
    showPreview: "/create?download=",
    showSearchBar: false,
    showAddButton: false,
    itemTarget: "/create?download=",
  },
  designOptions: {
    name: "Design Options",
    singular: "Design Option",
    table: "design_options",
    columns: ["id", "name", "category", "brand"],
    showDeleteButton: false,
    showAddButton: true,
    itemTarget: "#admin-single-design-options",
  },
  paths: {
    name: "Paths",
    singular: "Paths",
    table: "paths",
    query: {
      table: "paths",
      limit: 24,
    },
    showColumns: ["name", "points"],
    showDeleteButton: true,
    showAddButton: true,
    itemClick: async function (item) {
      let pathPage = createSinglePage(
        item,
        "Path",
        item.id ? item.name : "New path"
      );
      let uploadButton = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Upload SVG",
      });
      let preview = createHtml({ tag: "div", class: "admin-section" });

      // Function to create a preview of the profile
      function drawProfilePreview(rawPoints) {
        profileCanvas = pointsToCanvas(rawPoints, 20, 500);
        profileCanvas.classList.add("grey-card");
        preview.innerHTML = "";
        preview.appendChild(profileCanvas);
      }

      uploadButton.onclick = function () {
        /*svgUpload().then(function(upload){
                    let points = trimPoints(svgElementToPoints(upload.svg, 2));
                    console.log(points);
                    config.modified.points = JSON.stringify(points);
                    console.log("bxx")
                    pointsToGradientObject(points);
                    drawProfilePreview(points);
                });*/
        uploadLibrary({
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              // Load the svg
              let svgUrl = upload.selectedItems[0].url;
              config.modified.svg = svgUrl;
              fetch(config.cdnOrigin + svgUrl).then(function (response) {
                response.text().then(function (svgString) {
                  let svg = new DOMParser()
                    .parseFromString(svgString, "image/svg+xml")
                    .querySelector("svg");
                  let points = trimPoints(svgElementToPoints(svg, 2));
                  config.modified.points = JSON.stringify(points);
                  pointsToGradientObject(points);
                  drawProfilePreview(points);
                });
              });
            }
          },
        });
      };

      let topSection = createHtml({
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
                    value: item.id ? item.name : "",
                  },
                ],
              },
              uploadButton,
            ],
          },
        ],
      });
      pathPage.container.pageContent.appendChild(topSection);
      pathPage.container.pageContent.appendChild(preview);
      // If there's points, draw a preview
      if (item.points) {
        drawProfilePreview(item.points);
      }
    },
  },
  heightmaps: {
    name: "Heightmaps",
    singular: "Heightmap",
    table: "heightmaps",
    query: {
      table: "heightmaps",
      limit: 24,
    },
    showColumns: ["name"],
    showDeleteButton: true,
    showAddButton: true,
    itemClick: async function (item) {
      let heightPage = createSinglePage(
        item,
        "Heightmap",
        item.id ? item.name : "New Heightmap"
      );
      let uploadButton = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Choose Image",
      });
      let previewImage = createHtml({
        tag: "img",
        style:
          "width: 100%; height: auto; background-color: var(--header-bg); border-radius: var(--radius);",
      });
      if (item.image) previewImage.src = config.cdn + item.image;

      uploadButton.onclick = function () {
        uploadLibrary({
          onOk: function (upload) {
            if (upload.selectedItems[0]) {
              config.modified.image = upload.selectedItems[0].url;
              previewImage.src = config.cdn + upload.selectedItems[0].url;
            }
          },
        });
      };

      let topSection = createHtml({
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
                    value: item.name ? item.name : "",
                  },
                ],
              },
              uploadButton,
            ],
          },
        ],
      });

      let previewSection = createHtml({
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
                  { tag: "div", class: "input-label", text: "image" },
                  previewImage,
                ],
              },
            ],
          },
        ],
      });
      heightPage.container.pageContent.appendChild(topSection);
      heightPage.container.pageContent.appendChild(previewSection);
      // If there's points, draw a preview
      if (item.points) {
        drawProfilePreview(item.points);
      }
    },
  },
  patterns: {
    name: "Patterns",
    singular: "Pattern",
    table: "patterns",
    showIds: true,
    hasThumbnails: true,
    owned: true,
    auth: true,
    showColumns: ["name"],
    query: {
      table: "patterns",
      limit: 24,
      auth: true,
      owned: ["brand"].includes(config.user.type) ? true : false,
    },
    showDeleteButton: true,
    showAddButton: true,
    showPreview: "/create?patternId=",
    itemClick: async function (item) {
      if (!item) item = {};
      let defaultValues = {
        rowMultiple: 2,
        columnMultiple: 2,
        thumbnailSize: "70%",
        dimType: "single",
        drawMethod: "definition",
        hatchJoints: "fromImage",
        hatchEdges: "fromPaths",
        hatchMinGrid: 1,
      };
      let defaDefi = {
        fillAngle: "modeAngle",
        sizeReference: "largestWidth",
      };

      let saveCallback = async function (response) {
        let patId = item.id ? item.id : response.id;
        return new Promise(function (resolve, reject) {
          let saveSource = config.patternBuilder.svg
            ? saveFile(
                "patterns/source/" + patId + ".svg",
                createBlob(svgToDataUrl(config.patternBuilder.svg))
              )
            : 1;
          let saveThumbnail = config.patternBuilder.thumbnail
            ? saveFile(
                "patterns/" + patId + ".svg",
                createBlob(svgToDataUrl(config.patternBuilder.thumbnail))
              )
            : 1;
          Promise.all([saveSource, saveThumbnail])
            .then(function () {
              resolve();
            })
            .catch(function (error) {
              reject(error);
            });
        });
      };
      let page = createSinglePage(
        item,
        "Pattern",
        item.name ? item.name : "New pattern",
        true,
        item.id ? true : false,
        saveCallback
      );
      if (item.id) {
        page.thumbnail.style.backgroundImage = item.stringId
          ? "url(" +
            config.mediaEndpoint +
            "/patterns/" +
            item.stringId +
            ".svg" +
            ")"
          : "url(" + config.mediaEndpoint + "/patterns/" + item.id + ".svg" + ")";
        page.thumbnail.style.backgroundSize = item.thumbnailSize
          ? item.thumbnailSize
          : "70%";
      } else {
        page.thumbnail.style.backgroundSize = "70%";
        // Set default values
        config.modified = defaultValues;
      }
      page.thumbnail.style.backgroundRepeat = "repeat";
      let container = page.container;
      let patternUpload = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Upload",
      });
      let categories = {
        existingResponse: {
          results: [
            { id: "Brick Bond", name: "Brick Bond" },
            { id: "Paving", name: "Paving" },
            { id: "Parquetry", name: "Parquetry" },
            { id: "Geometric", name: "Geometric" },
            { id: "Organic", name: "Organic" },
            { id: "Random", name: "Random" },
            { id: "Roofing", name: "Roofing" },
          ],
        },
        selected: item.categories,
        type: "checkbox",
        query: {
          table: "notable",
        },
        title: "Categories",
        width: 244,
        search: false,
        onOk: function (items) {
          config.modified
            ? (config.modified.categories = JSON.stringify(items.selectedIds))
            : (config.modified = {
                categories: JSON.stringify(items.selectedIds),
              });
        },
      };
      let pageContent = createHtml({
        tag: "div",
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
                        "data-column": "name",
                        type: "text",
                        value: item.name ? item.name : "",
                        placeholder: "Pattern Name",
                      },
                    ],
                  },
                  ["admin", "editor"].includes(config.user.type)
                    ? {
                        tag: "div",
                        style: "width:auto;",
                        children: [
                          { tag: "div", class: "input-label", text: "active" },
                          createCheckbox(item.active, "active"),
                        ],
                      }
                    : 0,
                  {
                    tag: "div",
                    "data-categories": "container",
                    style: "width: 350px;",
                    children: [
                      {
                        tag: "div",
                        class: "input",
                        text: "Categories",
                        "data-categories": "patterns",
                      },
                    ],
                  },
                ],
              },
            ],
          },
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
                      {
                        tag: "div",
                        class: "input-label",
                        text: "rows",
                        children: [
                          createTooltip(
                            "Vertical tile count, use approximate value for irregular patterns"
                          ),
                        ],
                      },
                      {
                        tag: "input",
                        "data-column": "rowMultiple",
                        type: "number",
                        value: item.rowMultiple ? item.rowMultiple : 2,
                        placeholder: "Pattern Name",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "columns",
                        children: [
                          createTooltip(
                            "Horizontal tile count, use approximate value for irregular patterns"
                          ),
                        ],
                      },
                      {
                        tag: "input",
                        "data-column": "columnMultiple",
                        type: "number",
                        value: item.columnMultiple ? item.columnMultiple : 2,
                        placeholder: "Pattern Name",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    style: "width: 50%;",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "thumbnail size",
                        children: [
                          createTooltip(
                            "Set the thumbnail size relative to the container"
                          ),
                        ],
                      },
                      {
                        tag: "div",
                        class: "input",
                        style: "padding:0;",
                        children: [
                          {
                            tag: "input",
                            class: "dark",
                            min: "10",
                            max: "200",
                            value: item.thumbnailSize
                              ? parseInt(item.thumbnailSize)
                              : "70",
                            type: "range",
                            "data-input": "thumbnailSize",
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
            class: "admin-section",
            children: [
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "source svg" },
                      patternUpload,
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "fill angle",
                        children: [
                          createTooltip(
                            "Controls the angle images are placed at inside the tile"
                          ),
                        ],
                      },
                      {
                        tag: "select",
                        "data-input": "fillAngle",
                        class: "pattern-builder-input",
                        children: [
                          {
                            tag: "option",
                            value: "trueNorth",
                            text: "Parallel and perpendicular to canvas",
                          },
                          {
                            tag: "option",
                            value: "firstAngle",
                            text: "Match angle of first edge in tile",
                          },
                          {
                            tag: "option",
                            value: "modeAngle",
                            text: "Match most common angle in tile",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "reference size",
                        children: [
                          createTooltip(
                            "Sets which dimension the user input controls"
                          ),
                        ],
                      },
                      {
                        tag: "select",
                        "data-input": "sizeReference",
                        class: "pattern-builder-input",
                        children: [
                          {
                            tag: "option",
                            value: "longestEdge",
                            text: "Longest edge found in pattern",
                          },
                          {
                            tag: "option",
                            value: "largestWidth",
                            text: "Horizontal width of largest tile",
                          },
                        ],
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
                      {
                        tag: "div",
                        class: "input-label",
                        text: "width",
                        children: [
                          createTooltip("Horizontal repetition length"),
                        ],
                      },
                      {
                        tag: "input",
                        "data-input": "width",
                        class: "pattern-builder-input",
                        value:
                          item.definition && item.definition.width
                            ? item.definition.width
                            : "",
                        type: "number",
                        step: "0.01",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "height",
                        children: [createTooltip("Vertical repetition length")],
                      },
                      {
                        tag: "input",
                        "data-input": "height",
                        class: "pattern-builder-input",
                        value:
                          item.definition && item.definition.height
                            ? item.definition.height
                            : "",
                        type: "number",
                        step: "0.01",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            id: "",
            class: "admin-section pattern-preview-section",
            style: "display:none;",
            children: [
              { tag: "h3", text: "Preview" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    id: "user-pattern-preview",
                    class: "admin-preview",
                  },
                ],
              },
            ],
          },
          ["admin", "editor"].includes(config.user.type) && item.definition
            ? {
                tag: "div",
                id: "",
                class: "admin-section pattern-definition-section",
                children: [
                  { tag: "h3", text: "JSON Definition" },
                  {
                    tag: "div",
                    class: "sardine-tin",
                    children: [
                      {
                        tag: "textarea",
                        text: item.definition
                          ? JSON.stringify(item.definition, undefined, 4)
                          : "",
                        "data-column": "definition",
                      },
                    ],
                  },
                ],
              }
            : 0,
        ],
      });

      container.appendChild(pageContent);

      const selectCategories = document.querySelector(
        "[data-categories='patterns']"
      );

      selectCategories.addEventListener("click", () => {
        // if menu is opened return early
        if (document.querySelector(".dbox-menu-card")) return;

        // add the categories menu
        insertHtml(createDataboxMenu(categories), selectCategories.parentNode);
        const selectCatDBox = document.querySelector(".dbox-menu-card");
        selectCatDBox.style.display = "none";

        // adjust position of the category menu
        const div = selectCategories.getBoundingClientRect();
        selectCatDBox.style.display = "flex";
        selectCatDBox.style.position = "absolute";
      });

      // Set selects
      element("[data-input='fillAngle']").value =
        item.definition && item.definition.fillAngle
          ? item.definition.fillAngle
          : defaDefi.fillAngle;
      element("[data-input='sizeReference']").value =
        item.definition && item.definition.sizeReference
          ? item.definition.sizeReference
          : defaDefi.sizeReference;
      element("[data-input='thumbnailSize']").oninput = function (event) {
        config.modified[event.srcElement.getAttribute("data-input")] =
          event.srcElement.value + "%";
        page.thumbnail.style.backgroundSize = event.srcElement.value + "%";
      };

      elements(".pattern-builder-input").forEach(function (elem) {
        elem.onchange = function () {
          // Update the pattern builder value
          item.definition[elem.getAttribute("data-input")] =
            elem.getAttribute("type") === "number"
              ? parseFloat(elem.value)
              : elem.value;
          config.modified.definition = JSON.stringify(item.definition);
          updatePreview(item.definition);
          updatePatternThumbnail(item.definition);
        };
      });

      function updatePatternThumbnail(patternDefinition) {
        config.patternBuilder.thumbnail =
          definitionToSvgThumbnail(patternDefinition);
        page.thumbnail.style.display = "";
        page.thumbnail.style.backgroundImage =
          "url(" + svgToDataUrl(config.patternBuilder.thumbnail) + ")";
      }

      patternUpload.onclick = function () {
        svgUpload().then(function (upload) {
          if (!item.definition) item.definition = {};
          config.patternBuilder.width = item.definition.width
            ? item.definition.width
            : round(parseFloat(upload.svg.getAttribute("width")), 2);
          config.patternBuilder.height = item.definition.height
            ? item.definition.height
            : round(parseFloat(upload.svg.getAttribute("height")), 2);
          config.patternBuilder.sizeReference = item.definition.sizeReference
            ? item.definition.sizeReference
            : defaDefi.sizeReference;
          config.patternBuilder.fillAngle = item.definition.fillAngle
            ? item.definition.fillAngle
            : defaDefi.fillAngle;
          element("[data-input='width']").value = config.patternBuilder.width;
          element("[data-input='height']").value = config.patternBuilder.height;
          config.patternBuilder.svg = upload.svg;
          let patternDefinition = svgToDefinition(upload.svg);
          item.definition = patternDefinition;
          config.modified.definition = JSON.stringify(patternDefinition);
          updatePreview(patternDefinition);
          updatePatternThumbnail(patternDefinition);
        });
      };

      function updatePreview(definition) {
        let patCanvas = patternPreview(definition);
        patCanvas.style.width = "100%";
        element(".pattern-preview-section").style.display = "";
        element("#user-pattern-preview").innerHTML = "";
        element("#user-pattern-preview").appendChild(patCanvas);
      }

      // Reset pattern data
      config.patternBuilder = {};
      if (item.id && item.definition) updatePreview(item.definition);
      adminListeners();
    },
  },
  scenes: {
    name: "Scenes",
    singular: "scene",
    table: "scenes",
    showIds: true,
    owned: true,
    auth: true,
    showPreview: "/create?view=scene&scene=",
    showColumns: ["name"],
    query: {
      table: "scenes",
      limit: 24,
      auth: true,
      owned: ["brand"].includes(config.user.type) ? true : false,
    },
    showDeleteButton: true,
    showAddButton: config.user.type === "brand" ? false : true,
    //showPreview: "/create?patternId=",
    itemClick: async function (item) {
      if (!item) item = {};

      let saveCallback = async function (response) {
        let patId = item.id ? item.id : response.id;
        return new Promise(function (resolve, reject) {
          let saveSource = config.patternBuilder.svg
            ? saveFile(
                "patterns/source/" + patId + ".svg",
                createBlob(svgToDataUrl(config.patternBuilder.svg))
              )
            : 1;
          let saveThumbnail = config.patternBuilder.thumbnail
            ? saveFile(
                "patterns/" + patId + ".svg",
                createBlob(svgToDataUrl(config.patternBuilder.thumbnail))
              )
            : 1;
          Promise.all([saveSource, saveThumbnail])
            .then(function () {
              resolve();
            })
            .catch(function (error) {
              reject(error);
            });
        });
      };
      let page = createSinglePage(
        item,
        "Scene",
        item.name ? item.name : "New pattern",
        true,
        item.id ? true : false,
        saveCallback
      );
      let container = page.container;
      let compositeAnchor = createHtml({
        tag: "div",
        class: "input",
        text: "Render anchor",
      });
      let modelCrop = createHtml({
        tag: "div",
        class: "input",
        id: "model-crop",
        text: "Crop",
      });
      let modelAnchor = createHtml({
        tag: "div",
        class: "input",
        text: "Model anchor",
      });
      let cameraSelect = createHtml({
        tag: "select",
        "data-column": "camera_name",
        class: "rndrprm",
      });
      let renderUpload = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Image (.jpg)",
      });
      let meshUpload = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Mesh (.gltf)",
      });
      let cameraUpload = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Camera (.dae)",
      });
      let clipUpload = createHtml({
        tag: "div",
        class: "input upload-input",
        text: "Mask (.png)",
      });
      let pageContent = createHtml({
        tag: "div",
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
                        "data-column": "name",
                        type: "text",
                        value: item.name ? item.name : "",
                        placeholder: "Scene Name",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "Source Files", class: "sardine-tin" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "render image",
                      },
                      renderUpload,
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "mesh model" },
                      meshUpload,
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "camera model",
                      },
                      cameraUpload,
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "clipping mask",
                      },
                      clipUpload,
                    ],
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "Composite", class: "sardine-tin" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "scale" },
                      {
                        tag: "input",
                        "data-column": "scale",
                        class: "rndrprm",
                        type: "text",
                        value: item.scale ? item.scale : "",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "3d model anchor",
                      },
                      modelAnchor,
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        class: "input-label",
                        text: "base render anchor",
                      },
                      compositeAnchor,
                    ],
                  },
                ],
              },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  { tag: "div", id: "scene-composite-preview", children: [] },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "3D Model", class: "sardine-tin" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "fov" },
                      {
                        tag: "input",
                        "data-column": "fov",
                        class: "rndrprm",
                        type: "number",
                        value: item.fov ? item.fov : "",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      { tag: "div", class: "input-label", text: "crop" },
                      modelCrop,
                    ],
                  },
                  {
                    tag: "div",
                    children: [
                      {
                        tag: "div",
                        "data-column": "camera_name",
                        class: "rndrprm",
                        class: "input-label",
                        text: "camera name",
                      },
                      cameraSelect,
                    ],
                  },
                ],
              },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  { tag: "div", id: "scene-model-preview", children: [] },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h3", text: "Mesh IDs", class: "sardine-tin" },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "div",
                    class: "sardine-tin",
                    id: "mesh-reference-ids",
                  },
                ],
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              {
                tag: "h3",
                text: "Default Parameters",
                class: "sardine-tin",
                style: "display:inline-block;",
                children: [
                  {
                    tag: "span",
                    class: "tooltip-icon",
                    "data-tooltip":
                      "<a target='_blank' href='/page/scene-parameters'>Scene parameter reference</a>",
                  },
                ],
              },
              {
                tag: "div",
                class: "sardine-tin",
                children: [
                  {
                    tag: "textarea",
                    "data-column": "params",
                    text: item.params
                      ? JSON.stringify(item.params, null, 4)
                      : "",
                  },
                ],
              },
            ],
          },
        ],
      });
      container.appendChild(pageContent);
      adminListeners();
      uiListener();

      [renderUpload, meshUpload, cameraUpload, clipUpload].forEach(function (
        elem
      ) {
        elem.onclick = function () {
          uploadLibrary({
            onOk: function (upload) {
              if (upload.selectedItems[0]) {
                if (elem === meshUpload)
                  config.modified.mesh_file = upload.selectedItems[0].url;
                if (elem === cameraUpload)
                  config.modified.camera_file = upload.selectedItems[0].url;
                if (elem === renderUpload)
                  config.modified.image = upload.selectedItems[0].url;
                if (elem === clipUpload)
                  config.modified.clip = upload.selectedItems[0].url;
              }
            },
          });
        };
      });

      // Camera select
      if (item.camera_file) {
        const loadingManager = new THREE.LoadingManager(function () {});
        const loader = new ColladaLoader(loadingManager);
        loader.load(config.cdn + item.camera_file, function (collada) {
          for (var i = 0; i < collada.scene.children[0].children.length; i++) {
            var child = collada.scene.children[0].children[i];
            if (child.type == "PerspectiveCamera") {
              cameraSelect.appendChild(
                createHtml({
                  tag: "option",
                  text: child.name,
                  value: child.name,
                })
              );
            }
          }
          if (item.camera_name) cameraSelect.value = item.camera_name;
        });
      }

      // Load the clip image so that we find out the size
      var image = new Image();
      image.onload = function () {
        item.width = image.width;
        item.height = image.height;
        updateModel();
        updateComposite();
      };
      image.src = config.cdn + item.clip;

      // Function reads current params
      function currentParams(elem) {
        let params = copy(item);
        params.camera_name = config.modified.camera_name
          ? config.modified.camera_name
          : item.camera_name;
        params.fov = config.modified.fov ? config.modified.fov : item.fov;
        params.crop_x = config.modified.crop_x
          ? config.modified.crop_x
          : item.crop_x;
        params.crop_y = config.modified.crop_y
          ? config.modified.crop_y
          : item.crop_y;
        params.crop_width = config.modified.crop_width
          ? config.modified.crop_width
          : item.crop_width;
        params.scale = config.modified.scale ? config.modified.scale : item.scale;
        params.anchor_3d = config.modified.anchor_3d
          ? config.modified.anchor_3d
          : item.anchor_3d;
        params.anchor_render = config.modified.anchor_render
          ? config.modified.anchor_render
          : item.anchor_render;
        return params;
      }

      function updateModel() {
        let params = currentParams();
        params.renderer = config.adminCompRenderer
          ? config.adminCompRenderer
          : new THREE.WebGLRenderer({ alpha: true, antialias: true });
        config.renderModel(params).then(function (render) {
          element("#scene-model-preview").innerHTML = "";
          render.canvas.style.width = "100%";
          render.canvas.style.height = "auto";
          render.canvas.style.backgroundColor = "var(--header-bg)";
          render.canvas.style.borderRadius = "var(--radius)";
          element("#scene-model-preview").appendChild(render.canvas);
          element("#mesh-reference-ids").innerHTML = "";
          for ([mesh, color] of Object.entries(render.settings.colorsByMesh)) {
            element("#mesh-reference-ids").appendChild(
              createHtml({
                tag: "div",
                children: [
                  { tag: "div", class: "input-label", text: +mesh },
                  {
                    tag: "div",
                    class: "input",
                    style: "background-color:" + color + ";",
                  },
                ],
              })
            );
          }
        });
      }

      function updateComposite() {
        let params = currentParams();
        params.renderer = config.adminCompRenderer
          ? config.adminCompRenderer
          : new THREE.WebGLRenderer({ alpha: true, antialias: true });
        config.drawScene(params).then(function (render) {
          element("#scene-composite-preview").innerHTML = "";
          render.canvas.style.width = "100%";
          render.canvas.style.height = "auto";
          render.canvas.style.backgroundColor = "var(--header-bg)";
          render.canvas.style.borderRadius = "var(--radius)";
          element("#scene-composite-preview").appendChild(render.canvas);
        });
      }

      compositeAnchor.onclick = function () {
        let img = new Image();
        img.onload = function () {
          launchSourceEditor(img, function (edit) {
            config.modified.anchor_render = edit.points.length
              ? JSON.stringify([
                  round(edit.points[edit.points.length - 1][0] / img.width, 4),
                  round(edit.points[edit.points.length - 1][1] / img.height, 4),
                ])
              : null;
            updateModel();
            updateComposite();
          });
        };
        img.src = config.cdn + item.image;
      };

      modelAnchor.onclick = function () {
        let params = currentParams();
        params.renderer = config.adminCompRenderer
          ? config.adminCompRenderer
          : new THREE.WebGLRenderer({ alpha: true, antialias: true });
        config.renderModel(params).then(function (render) {
          if (render.canvas.width) {
            launchSourceEditor(render.canvas, function (edit) {
              config.modified.anchor_3d = edit.points.length
                ? JSON.stringify([
                    round(
                      edit.points[edit.points.length - 1][0] /
                        render.canvas.width,
                      4
                    ),
                    round(
                      edit.points[edit.points.length - 1][1] /
                        render.canvas.height,
                      4
                    ),
                  ])
                : null;
              updateModel();
              updateComposite();
            });
          }
        });
      };

      modelCrop.onclick = function () {
        // Load the clip image so that we find out the size
        let params = currentParams();
        params.crop_x = params.crop_y = params.crop_width = null;
        params.renderer = config.adminCompRenderer
          ? config.adminCompRenderer
          : new THREE.WebGLRenderer({ alpha: true, antialias: true });
        config.renderModel(params).then(function (render) {
          launchSourceEditor(render.canvas, function (edit) {
            config.modified.crop_x = edit.areas.length
              ? "" + round(edit.areas[0][0] / render.canvas.width, 4)
              : null;
            config.modified.crop_y = edit.areas.length
              ? "" + round(edit.areas[0][1] / render.canvas.height, 4)
              : null;
            config.modified.crop_width = edit.areas.length
              ? "" + round(edit.areas[0][2] / render.canvas.width, 4)
              : null;
            updateModel();
            updateComposite();
          });
        });
      };

      elements(".rndrprm").forEach(function (elem) {
        elem.addEventListener("change", function () {
          updateModel();
          updateComposite();
        });
      });

      if (item.mesh_file && item.camera_file && item.camera_name) {
        var image = new Image();
        image.onload = function () {
          let params = copy(item);
          params.width = image.width;
          params.height = image.height;
          params.fov = item.fov ? item.fov : 35;
          params.crop_x = params.crop_y = params.crop_width = null;
          config.renderModel(params);
        };
        image.src = config.cdn + item.clip;
      }
    },
  },
  statistics: {
    name: "Analytics",
    singular: "analytics",
    navClick: () => {
      // check if page exists and remove it
      closeAdminPages();

      // show spinner
      document.querySelector(".admin-area").appendChild(Statistics.spinner);
      document.querySelector(".admin-area").style.pointerEvents = "none";

      if (document.querySelector("#admin-list"))
        document.querySelector("#admin-list").remove();
      let sendData = {
        startDate: getCustomDate(7),
        endDate: getCustomDate(1),
      };
      postJson("/app/statistics", sendData).then((response) =>
        generateStatisticsCharts(response)
      );
    },
  },
  plans: {
    navClick: () => {
      let page = createSinglePage({}, "Plans", "Plans", false);
      // Get json tier file content in php and output it to js variable
      let tierContainer = createHtml({ tag: "div", class: "tier-container" });
      function createTierElement(tier) {
        let tierElement = createHtml({
          tag: "div",
          class: "tier",
          children: [
            { tag: "h3", text: tier.name },
            {
              tag: "div",
              class: "price",
              children: [
                { tag: "span", text: tier.currency_symbol },
                { tag: "span", text: tier.monthly_price },
                tier.monthly_price === "Free"
                  ? ""
                  : {
                      tag: "span",
                      class: "currency",
                      text: tier.currency_code + "/month",
                    },
              ],
            },
            {
              tag: "div",
              children: [
                {
                  tag: "ul",
                  children: tier.features.map(function (feature) {
                    return { tag: "li", text: feature };
                  }),
                },
              ],
            },
            {
              tag: "div",
              children: [{ tag: "button", text: "Subscribe", class: "fw" }],
            },
          ],
        });
        return tierElement;
      }
      config.manufacturerPlans.forEach(function (tier) {
        tierContainer.appendChild(createTierElement(tier));
      });
      let pageContent = createHtml({
        tag: "div",
        children: [
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h2", text: "Material Library" },
              {
                tag: "p",
                text: "Add materials to the Architextures library and embed download links on your site.",
              },
              tierContainer,
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h2", text: "Custom Web Apps" },
              {
                tag: "p",
                text: "Create a branded web app to embed on your site.",
              },
            ],
          },
          {
            tag: "div",
            class: "admin-section",
            children: [
              { tag: "h2", text: "Promotions" },
              { tag: "p", text: "Boost a material to the top of the results." },
            ],
          },
        ],
      });
      page.container.pageContent.appendChild(pageContent);
    },
  },
  collections: {
    name: "Collections",
    singular: "collection",
    itemClick: function () {
      // check if page exists and remove it
      closeAdminPages();
      document
        .querySelector(".admin-area")
        .appendChild(CollectionAdmin.createMainContainer(true));
      CollectionAdmin.showSpinner();
      postJson("/app/query", {
        table: "collections",
        auth: true,
        id: config.state.item,
        columns: ["name"],
      }).then((response) => {
        const name = response?.results[0]?.name ?? "";
        const collection = new SingleCollectionAdmin(
          config.state.item,
          name,
          config.user.id,
          true
        );
        collection.loadInitialPage();
        collection.init();
      });
    },
    navClick: function () {
      const collections = new LoadCollections();
      collections.showAllCollections();
    },
  },
};

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

// if the area is analytics, change it to statistics, this keeps url to analytics for consistency
if (config.state.area.toLowerCase() === "analytics")
  config.state.area = "statistics";

config.area = config.areas[config.state.area];

if (config.state.item && config.area.showItem) {
  config.area.showItem();
}

function newSection() {
  return createHtml({ tag: "div", class: "admin-section" });
}

function updateListing(item, updatedData) {
  // Update the existing listing data
  let listing = document.querySelector("[data-item-id='" + item.id + "']");
  // Clear any existing highlighed elements
  document.querySelectorAll("[data-item-id]").forEach(function (elem) {
    elem.style.backgroundColor = "";
  });
  // Add all the modified values to the item object
  for (let [key, value] of Object.entries(updatedData)) {
    item[key] = value;
  }
  // Create the new listing element
  let newListing = createListingItem(item);
  newListing.style.backgroundColor = "#eee";
  // Replace the existing item with the updated one
  if (listing) listing.replaceWith(newListing);
}

function createSinglePage(
  item,
  section,
  title,
  save = true,
  thumbnail = false,
  saveCallback = function () {},
  hasCloseButton = true
) {
  let isNewItem = item.id ? false : true;
  let pageContent = createHtml({ tag: "div", class: "admin-single-content" });
  let closeButton = createHtml({
    tag: "div",
    class: "admin-single-x",
    children: [{ tag: "img", class: "icon", src: "/img/icons/x.svg" }],
  });
  let thumbnailButton = createHtml({
    tag: "div",
    class: "admin-single-thumbnail square-button shadow",
    style: !thumbnail ? "display:none;" : "",
  });
  let saveButton = createHtml({
    tag: "button",
    id: "save-button",
    class: "fbutt",
    text: "Save",
    style: "margin-left: 20px; padding: 0px 10px; width: unset;",
  });
  let pageContainer = createHtml({
    tag: "div",
    class: "admin-page",
    children: [
      {
        tag: "div",
        class: "admin-header admin-header-single",
        children: [
          {
            tag: "div",
            class: "admin-single-heading-left",
            children: [
              { tag: "h1", class: "admin-page-heading", text: section },
              thumbnailButton,
              { tag: "h1", class: "admin-single-heading", text: title },
              saveButton,
            ],
          },
          hasCloseButton ? closeButton : "",
        ],
      },
      pageContent,
    ],
  });
  // Page button listeners
  closeButton.onclick = function () {
    pageContainer.remove();
  };

  saveButton.onclick = async function () {
    // validate tier data object for brand tiers
    function validateTierData(tierData) {
      let errorMessage = "";
      let success = true;
      if (tierData.tier && !config.brandTiers.hasOwnProperty(tierData.tier)) {
        errorMessage += "Tier does not exist!<br>";
        success = false;
      }
      if (
        tierData.materialLimit &&
        tierData.materialLimit !== "unlimited" &&
        isNaN(parseInt(tierData.materialLimit))
      ) {
        errorMessage += "Material limit must be a number, or 'unlimited'!<br>";
        success = false;
      }
      if (
        tierData.publishLimit &&
        tierData.publishLimit !== "unlimited" &&
        isNaN(parseInt(tierData.publishLimit))
      ) {
        errorMessage += "Published assets must be a number!<br>";
        success = false;
      }

      const statisticsValues = [0, 7, 30, 90, 180];
      let maxStatistics = tierData.maxStatistics;

      if (maxStatistics !== "unlimited" && maxStatistics !== "0") {
        if (!/^\d+$/.test(maxStatistics)) {
          errorMessage +=
            "Statistics days must be a number! Allowed values: 7, 30, 90 180, 'unlimited' or 0 for unlimited<br>";
          success = false;
        } else {
          maxStatistics = parseInt(maxStatistics, 10);
          if (!statisticsValues.includes(maxStatistics)) {
            errorMessage +=
              "Statistics days must be a number (7, 30, 90 180, 'unlimited' or 0)<br>";
            success = false;
          }
        }
      }
      return { success, errorMessage };
    }

    // If there are modified values
    if (Object.values(config.modified).length) {
      let table = config.area.query.table;
      let tierData = null;

      if (
        config.modified.hasOwnProperty("select-brands-tier") ||
        config.modified.hasOwnProperty("select-tier-materials") ||
        config.modified.hasOwnProperty("select-tier-assets") ||
        config.modified.brandTierFormats ||
        config.modified.hasOwnProperty("select-tier-statistics")
      ) {
        if (!item.brand_tiers_tier && !config.modified["select-brands-tier"]) {
          showInfoMessage(
            "Missing Tier",
            "Please select a base tier for the brand from the drop down menu. Brand has not been saved!"
          );
          return;
        }
        tierData = {
          tier:
            config.modified["select-brands-tier"] ||
            document.querySelector("[data-column='select-brands-tier']")
              .value ||
            null,
          materialLimit:
            config.modified["select-tier-materials"] ||
            document.querySelector("[data-column='select-tier-materials']")
              .value ||
            null,
          publishLimit:
            config.modified["select-tier-assets"] ||
            document.querySelector("[data-column='select-tier-assets']")
              .value ||
            null,
          maxStatistics:
            config.modified["select-tier-statistics"] ||
            document.querySelector("[data-column='select-tier-statistics']")
              .value ||
            null,
          formats: config.modified.brandTierFormats || null,
        };
        const validated = validateTierData(tierData);
        if (!validated.success) {
          showInfoMessage("Wrong value", validated.errorMessage);
          return;
        }

        // remove the properties from the modified object
        delete config.modified["select-brands-tier"];
        delete config.modified["select-tier-materials"];
        delete config.modified["select-tier-assets"];
        delete config.modified.brandTierFormats;
        delete config.modified["select-tier-statistics"];
      }

      // show loading screen here, to not hide potential error message above
      createLoadingScreen("Saving");

      let queryObject = item.id
        ? {
            table: table,
            values: config.modified,
            id: item.id,
            action: "update",
            auth: true,
          }
        : { table: table, values: config.modified, action: "insert", auth: true };
      // If it's a new item, add the default values to the query
      try {
        // console.log(queryObject);
        query(queryObject).then(async function (response) {
          if (response.hasOwnProperty("id") && !item.hasOwnProperty("id"))
            item.id = response.id;

          // set brand tier
          if (tierData) {
            const brandTier = tierData.tier || item.brand_tiers_tier;
            // get custom or default limits
            const materialLimit =
              tierData.materialLimit === "unlimited" ||
              tierData.materialLimit === null ||
              tierData.materialLimit <= 0
                ? null
                : parseInt(tierData.materialLimit)
                ? tierData.materialLimit
                : config.brandTiers[brandTier].material_limit;
            const publishLimit =
              tierData.publishLimit === "unlimited" ||
              tierData.publishLimit === null ||
              tierData.publishLimit <= 0
                ? null
                : parseInt(tierData.publishLimit)
                ? tierData.publishLimit
                : config.brandTiers[brandTier].publish_limit;
            const maxStatistics =
              tierData.maxStatistics === "unlimited" ||
              tierData.maxStatistics === null ||
              tierData.publishLimit <= 0
                ? null
                : parseInt(tierData.maxStatistics)
                ? tierData.maxStatistics
                : config.brandTiers[brandTier].max_statistics;
            const formats = tierData.formats
              ? tierData.formats.join(",")
              : config.brandTiers[brandTier].formats.join(",");

            // check if brand has tier
            if (item.brand_tiers_tier) {
              const tierQuery = {
                table: "brand_tiers",
                values: {
                  tier: brandTier,
                  material_limit: materialLimit,
                  publish_limit: publishLimit,
                  formats: formats,
                  max_statistics: maxStatistics,
                },
                action: "update",
                where: [["brand", "=", item.id]],
                auth: true,
              };

              await query(tierQuery);
            } else {
              item.brand_tiers_tier = brandTier;

              // create new tier
              const tierQuery = {
                table: "brand_tiers",
                values: {
                  tier: brandTier,
                  brand: item.id,
                  material_limit: materialLimit,
                  publish_limit: publishLimit,
                  formats: formats,
                  max_statistics: maxStatistics,
                },
                action: "insert",
                auth: true,
              };

              await query(tierQuery);
            }
          }

          // If the save callback returns a promise, wait for it to be fulfilled
          if (saveCallback.then) {
            saveCallback(response)
              .then(function () {
                removeLoadingScreen("Saved");
              })
              .catch(function (e) {
                removeLoadingScreen("Save failed", "error");
              });
          } else {
            saveCallback(response);
            response.status === "success"
              ? removeLoadingScreen("Saved")
              : removeLoadingScreen("Save failed", "error");
          }
          // If it's a new item, reload the listings so that it's visible
          if (isNewItem) {
            pageLoad();
          } else if (!config.area.hasOwnProperty("navClick")) {
            updateListing(item, config.modified);
          }
        });
      } catch (e) {
        removeLoadingScreen("Save failed", "error");
      }
    } else {
      setTimeout(function () {
        removeLoadingScreen("Saved"), 200;
      });
    }
  };

  // Create a link to the content for easy access later
  pageContainer.pageContent = pageContent;
  config.currentPage = pageContainer;
  // Add the page to the admin area
  document.querySelector(".admin-area").appendChild(pageContainer);
  return {
    container: pageContainer,
    saveButton: saveButton,
    thumbnail: thumbnailButton,
  };
}

// Get the brand data
async function getBrand() {
  config.brand = await query({
    table: "brands",
    id: config.user.brand,
    auth: true,
    join: {
      table: "brand_tiers",
      on: ["id", "=", "brand"],
      columns: [
        "tier",
        "material_limit",
        "publish_limit",
        "formats",
        "max_statistics",
      ],
    },
  }).then((response) => response.results[0]);
}

if (config.user.brand) {
  getBrand();
} else {
  config.brand = false;
}

let moreButton = document.querySelector(".admin-item-footer");
let saveButton = document.querySelector("#save-button");
let resetPasswordButton = document.querySelector("#admin-reset-password");
let addSizeButton = document.querySelector(".add-size-button");
let sourceUploads = document.querySelectorAll(".source-upload");
let thumbUpload = document.getElementById("admin-material-thumbnail");
let appIconButton = document.getElementById("admin-app-icon");
let brandLogoImg = document.getElementById("admin-brand-logo-img");
//let previewButton = document.getElementById("preview-button");
let editorWindow = document.getElementById("admin-editor-window");
let singleX = document.querySelector(".admin-single-x");
let addTeamMember = document.getElementById("add-team-member");
let defaultParams = {
  drawType: "texture",
  cropType: "new",
  regen: true,
  trigger: "joints-input",
  patternId: "2",
  rows: 4,
  columns: 2,
  inches: false,
  patternAngle: 30,
  patternRotateAngle: 0,
  patternAdditionalInteger1: 3,
  tileID: 1,
  tileRealWidth: 2000,
  tileRotation: false,
  tileWidth: "400",
  tileHeight: "100",
  tileMinWidth: "50",
  tileMinHeight: "50",
  cornerType: 0,
  cornerValue: 0,
  edgeProfile: "handmade",
  edgeValue: 0,
  edgeScale: 1,
  tileTilt: 0,
  variation: 0,
  hue: 0,
  jointID: "solid",
  jointRealWidth: null,
  jointWidthHorizontal: "10",
  jointWidthVertical: "10",
  jointLocked: true,
  jointRotation: false,
  recessJoints: 0,
  shadowBlur: "5",
  shadowOpacity: "0.2",
  jointTint: "#FFFFFF",
  pxPerMm: 0,
  tonalVariation: "0.25",
  tileStyles: {
    a: {
      brightness: "1",
      contrast: "1",
      edge: { profile: "fine", scale: 1, exclude: [], width: 25 },
      depthBottom: 20,
      depthTop: 255,
      frequency: "0.5",
      hue: 0,
      invert: false,
      materialCategory: "brick",
      materialId: 1,
      materialWidth: 2000,
      placement: "random",
      rotate: false,
      saturation: "1",
      tint: "#FFFFFF",
    },
  },
  patternName: "stretcher",
  showEdgeDepth: true,
  jointdepthBottom: 0,
  patternStretchers: 3,
  patternDimType: "multi",
  product: false,
  tileUploadWidth: null,
  additionalStyles: false,
  selectedTiles: {},
  tileAutoBump: true,
  tileBumpBrightness: "1",
  tileBumpContrast: "1",
  jointAutoBump: false,
  tileTint: "#FFFFFF",
  setRes: true,
  pixelWidth: 3000,
  showPatternHatch: true,
  showSurfaceProfile: false,
  hatchType: "model",
  hatchApp: "autocad",
  hatchJoints: false,
};
let itemHeaderContainer = document.querySelector(
  ".admin-item-header-container"
);

function addResurrectButton(headingText) {
  if (!document.querySelector("[data-resurrect='" + headingText + "']")) {
    const resurrectButton = new CreateElement({
      tag: "button",
      class: "fbutt",
      text: "Resurrect",
      "data-resurrect": headingText,
    }).createHTML();
    document
      .querySelector("#save-button")
      .parentNode.appendChild(resurrectButton);
  }
}

function handleResurrectClick(item, headingText) {
  const resurrectBtn = document.querySelector(
    "[data-resurrect='" + headingText + "']"
  );
  resurrectBtn.addEventListener("click", () => {
    const notification = addNotification({
      text: "Resurrecting...",
      image: "spinner",
    });

    postJson("/app/query", {
      table: headingText === "materials" ? "protextures" : "textures",
      action: "update",
      id: item.id,
      auth: true,
      values: {
        deleted_at: null,
      },
    }).then((response) => {
      if (response.status !== "success") {
        notification.updateNotification({
          text: "Failed to resurrect",
          image: "warning",
          duration: 5000,
        });
        return;
      }

      notification.updateNotification({
        text: "Resurrected",
        image: "tick",
        duration: 2000,
      });

      resurrectBtn.remove();

      // Update the listing data
      item.deleted_at = null;
      const listing = document.querySelector("[title='" + item.id + "']");
      if (listing.classList.contains("bad")) {
        listing.classList.remove("bad");
      }
      if (listing.lastChild.innerText === "deleted") {
        listing.lastChild.innerText = item.status;
      }
    });
  });
}

function jsolRow(columns) {
  var columnElements = [];
  columns.forEach(function (value, i) {
    if (typeof value !== "string") value = JSON.stringify(value);
    columnElements.push({ tag: "textarea", class: "jsol-key", text: value });
  });
  columnElements.push({
    tag: "div",
    class: "jsol-delete",
    children: [{ tag: "img", src: config.mediaEndpoint + "/icons/x.svg" }],
  });

  // Create row container
  var row = { tag: "div", class: "jsol-row", children: columnElements };
  return createHtml(row);
}

function jsolInputHeights() {
  // console.log("input height")
  for (const elem of elements(".jsol-key")) {
    elem.parentElement.style.height = "0";
    elem.parentElement.style.height = elem.scrollHeight;
  }
}

function createJsol(container, data) {
  var jsol = createHtml({
    tag: "div",
    class: "jsol",
    "data-type": "jsol",
    "data-column": container.getAttribute("data-column"),
    children: [
      {
        tag: "div",
        class: "jsol-add",
        children: [{ tag: "img", src: config.mediaEndpoint + "/icons/plus.svg" }],
      },
    ],
  });
  if (data) {
    for ([key, value] of Object.entries(data)) {
      jsol.prepend(jsolRow([key, value]));
    }
  }
  container.innerHTML = "";
  container.append(jsol);
}

function readSizes() {
  if (!config.pageData.hasOwnProperty("json_data")) {
    config.pageData.json_data = {};
  }
  if (!config.pageData.json_data.hasOwnProperty("appSettings")) {
    config.pageData.json_data.appSettings = {};
  }
  // Clear the sizes
  config.pageData.json_data.appSettings.sizes = [];
  // Read the sizes from HTML
  elements(".available-width").forEach(function (elem, i) {
    config.pageData.json_data.appSettings.sizes.push([elem.value]);
  });
  elements(".available-height").forEach(function (elem, i) {
    config.pageData.json_data.appSettings.sizes[i].push(elem.value);
  });
  // Write the updated sizes to the modified property
  config.modified.json_data = JSON.stringify(config.pageData.json_data);
}

// DOM listener
function adminListeners() {
  for (const elem of elements(".jsol-delete")) {
    elem.onclick = function () {
      // console.log(elem);
      // console.log(elem.parentElement);
      elem.parentElement.remove();
      adminListeners();
    };
  }

  for (const elem of elements(".jsol-key")) {
    elem.oninput = function () {
      jsolInputHeights();
    };
  }

  for (const elem of elements(".jsol-add")) {
    elem.onclick = function () {
      insertHtml(jsolRow(["", ""]), elem, "before");
      adminListeners();
    };
  }
  jsolInputHeights();

  // When a default design option is changed for a material
  elements(".admin-option-default").forEach(function (elem) {
    elem.onchange = function () {
      updateDefaultDesignOption(elem);
    };
  });

  // Size change listeners
  elements(".available-width, .available-height").forEach(function (elem) {
    elem.oninput = function () {
      readSizes();
    };
  });

  // Units change listener
  let unitsSelectors = document.querySelectorAll("[data-units-select]");
  unitsSelectors.forEach(function (elem) {
    elem.addEventListener("change", function () {
      config.units = elem.value;
      setconfigCookie("units", elem.value);
      unitsSelectors.forEach(function (thisElem) {
        thisElem.value = elem.value;
      });
    });
  });

  // Set the modified value when an input is changed
  document
    .querySelectorAll("[data-column], [data-column] textarea")
    .forEach(function (elem) {
      elem.addEventListener("change", function () {
        // Interpret the value
        var value = elem.value;
        // If it's an array
        if (elem.getAttribute("data-type") == "array") {
          // Find all elements with the same data column value
          value = JSON.stringify(checkboxesToArray(elem));
        } else if (elem.getAttribute("data-type") == "jsol") {
          value = {};
          if (elem.querySelectorAll(".jsol-row")) {
            // Search every row
            elem.querySelectorAll(".jsol-row").forEach(function (row) {
              // Retrieve every key and value
              try {
                value[row.querySelectorAll(".jsol-key")[0].value] = JSON.parse(
                  row.querySelectorAll(".jsol-key")[1].value
                );
              } catch (e) {
                value[row.querySelectorAll(".jsol-key")[0].value] =
                  row.querySelectorAll(".jsol-key")[1].value;
              }
            });
          }
          value = JSON.stringify(value);
        } else if (elem.getAttribute("type") == "number") {
          value = parseInt(value);
        } else if (elem.getAttribute("type") == "checkbox") {
          if (elem.checked == true) {
            value = 1;
          } else {
            value = 0;
          }
        }

        // Interpret the column name
        // If the string includes a dot, interpret it as a json column
        if (elem.getAttribute("data-column").includes(".")) {
          // Get the original json
          var objectParts = elem.getAttribute("data-column").split(".");
          var columnName = objectParts[0];
          // If there's no existing json for this column
          if (
            !config.pageData.hasOwnProperty(columnName) ||
            config.pageData[columnName] == undefined
          ) {
            var json = {};
          } else {
            var json = config.pageData[columnName];
          }
          // Overwrite the specific key that's changed
          if (objectParts.length == 2) {
            json[objectParts[1]] = value;
          }
          if (objectParts.length == 3) {
            if (!json.hasOwnProperty(objectParts[1])) {
              json[objectParts[1]] = {};
            }
            json[objectParts[1]][objectParts[2]] = value;
          }
          if (objectParts.length == 4) {
            if (!json.hasOwnProperty(objectParts[1])) {
              json[objectParts[1]] = {};
            }
            if (!json[objectParts[1]].hasOwnProperty(objectParts[2])) {
              json[objectParts[1]][objectParts[2]] = {};
            }
            json[objectParts[1]][objectParts[2]][objectParts[3]] = value;
          }
          config.modified[columnName] = JSON.stringify(json);
          config.pageData[columnName] = json;
        } else {
          config.modified[elem.getAttribute("data-column")] = value;
          config.pageData[elem.getAttribute("data-column")] = value;
        }
      });
    });
}
adminListeners();

addTeamMember.onclick = async function () {
  const email = document.getElementById("add-team-member-email").value;
  if (email === config.user.email) {
    addNotification({
      text: "User already added",
      image: "warning",
      duration: 5000,
    });
    return;
  }
  createLoadingScreen("Adding team member");
  const request = {
    email: email,
  };
  //if (brand) request.expires = expires;
  const response = await postJson("/app/add-team-member", request);
  if (response.status === "success") {
    removeLoadingScreen(response.message);
    pageLoad();
  } else {
    removeLoadingScreen(response.error, "error");
  }
};

/*
appIconButton.onclick = function(){
    imageUpload().then(function(file){
        launchSourceEditor(file.image, function(canvases){
            appIconButton.style.backgroundImage = "url('"+canvases[0].toDataURL()+"')";
            config.appIcon = canvases[0];
        });
    });
}
*/

sourceUploads.forEach(function (sourceUpload) {
  sourceUpload.onclick = async function (elem) {
    let image = await imageUpload();
    launchSourceEditor(image.image, function (editor) {
      // Store the canvas in an array
      if (!config.hasOwnProperty("canvasSelections")) {
        config.canvasSelections = [];
      }

      for (const canvas of editor.canvases) {
        canvas.imageName = generateUid() + ".jpg";
        config.canvasSelections.push(canvas);
        insertHtml(
          createHtml({
            tag: "div",
            class: "source-image shadow",
            children: [canvas],
          }),
          sourceUpload.closest(".source-image-container")
        );
      }

      // Listen for clicks on the new source images
      sourceImageListener();
    });
  };
});

thumbUpload.onclick = async function () {
  let image = await imageUpload();
  launchSourceEditor(image.image, function (editor) {
    // Set the image to the background-url
    thumbUpload.style.backgroundImage =
      "url('" + editor.canvases[0].toDataURL() + "')";
    thumbUpload.style.backgroundSize = "cover";
    thumbUpload.style.backgroundPosition = "center";
    thumbUpload.querySelector("img").style.display = "none";
    // Save the image to the object
    config.thumbImage = editor.canvases[0];
  });
};

// Set the modified value when an input is changed
document.querySelector("[data-close]").onclick = function (event) {
  if (config.state.itemAdded == true) {
    event.preventDefault();
    pageLoad();
  }
};

function getMousePosition(event) {
  var canvasImageWidth = canvas.width;
  var boundingRect = canvas.getBoundingClientRect();
  var canvasViewWidth = boundingRect.right - boundingRect.left;
  var multiplier = canvasImageWidth / canvasViewWidth;
  var viewX = event.clientX - boundingRect.left;
  var viewY = event.clientY - boundingRect.top;
  var canvasX = viewX * multiplier;
  var canvasY = viewY * multiplier;
  return { x: canvasX, y: canvasY };
}

function sourceImageListener() {
  document.querySelectorAll(".source-image").forEach(function (elem) {
    // If the element doesn't have a data file attribute, it must be a new source image that hasn't been uploaded yet
    if (elem.hasAttribute("data-file")) {
      // Use the given filename
      var filename = elem.getAttribute("data-file");
      var src =
        config.state.area == "materials"
          ? config.mediaEndpoint +
            "/materials/" +
            config.state.id +
            "/4000/" +
            filename
          : config.mediaEndpoint +
            "/users/" +
            config.pageData.user +
            "/uploads/" +
            filename;
      var file = filename;
    } else {
      // Use the canvas element
      var canvas = elem.querySelector("canvas");
      var src = canvas.toDataURL();
      var filename = canvas.imageName;
      var file = "local";
    }

    // Construct source data object for this file
    if (!config.pageData.source_data) config.pageData.source_data = {};
    if (
      !config.pageData.source_data.hasOwnProperty(filename) ||
      (Array.isArray(config.pageData.source_data[filename]) &&
        config.pageData.source_data[filename].length === 0)
    )
      config.pageData.source_data[filename] = {};
    let sourceImageData = config.pageData.source_data[filename];

    elem.onclick = function () {
      // Create an image modal
      let imageModal = createHtml({
        tag: "div",
        id: "source-img-modal",
        class: "modal",
        children: [
          {
            tag: "div",
            class: "modal-window",
            children: [
              {
                tag: "div",
                class: "header",
                children: [
                  { tag: "div", text: "Image info" },
                  {
                    tag: "img",
                    src: "/img/icons/x.svg",
                    class: "icon",
                    "data-close": "#source-img-modal",
                  },
                ],
              },
              {
                tag: "div",
                class: "modal-body",
                children: [
                  {
                    tag: "div",
                    class: "modal-sidebar view-image-sidebar sv s-pad",
                    children: [
                      /*{tag: "div", text: "width", class: "input-label"},*/
                      {
                        tag: "div",
                        class: "fc s-gap",
                        children: [
                          {
                            tag: "div",
                            class: "s-gap fc",
                            children: [
                              {
                                tag: "input",
                                id: "new-tag-input",
                                class: "source-new-tag fw",
                                type: "text",
                                placeholder: "Add tag",
                              },
                              { tag: "div", class: "source-tag-container" },
                            ],
                          },
                          {
                            tag: "div",
                            class: "input-group xs-gap fc",
                            children: [
                              {
                                tag: "div",
                                class: "df",
                                children: [
                                  {
                                    tag: "div",
                                    text: "copies",
                                    class: "input-label",
                                  },
                                  {
                                    tag: "span",
                                    class: "tooltip-icon",
                                    "data-tooltip":
                                      "Total number of copies. A higher number increases the chances of this sample being selected at random. Defaults to 1 copy.",
                                    class: "tooltip-icon",
                                  },
                                ],
                              },
                              {
                                tag: "input",
                                "data-target": "total_copies",
                                type: "number",
                                placeholder: "1",
                                value: sourceImageData.total_copies ?? null,
                              },
                            ],
                          },
                          {
                            tag: "div",
                            class: "fr",
                            style:
                              config.user.type !== "admin" ? "display:none;" : "",
                            children: [
                              { tag: "div", text: "Laying pattern" },
                              {
                                tag: "span",
                                "data-tooltip":
                                  "Set a specific laying position for row and column, based on a laying pattern",
                                class: "tooltip-icon",
                              },
                            ],
                          },
                          {
                            tag: "div",
                            class: "s-gap fr ver-end",
                            style:
                              config.user.type !== "admin" ? "display:none;" : "",
                            children: [
                              {
                                tag: "div",
                                class: "input-group xs-gap fc",
                                children: [
                                  {
                                    tag: "div",
                                    text: "Row position",
                                    class: "input-label",
                                  },
                                  {
                                    tag: "input",
                                    "data-target": "row_position",
                                    type: "number",
                                    value: sourceImageData.row_position ?? null,
                                  },
                                ],
                              },
                              // {tag: "div", class:"cc", style:"height:var(--input-height);", text: "of"},
                              {
                                tag: "div",
                                class: "input-group xs-gap fc",
                                children: [
                                  {
                                    tag: "div",
                                    text: "Total rows",
                                    class: "input-label",
                                  },
                                  {
                                    tag: "input",
                                    "data-target": "total_rows",
                                    type: "number",
                                    value: sourceImageData.total_rows ?? null,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            tag: "div",
                            class: "s-gap fr ver-end",
                            style:
                              config.user.type !== "admin" ? "display:none;" : "",
                            children: [
                              {
                                tag: "div",
                                class: "input-group xs-gap fc",
                                children: [
                                  {
                                    tag: "div",
                                    text: "Col. position",
                                    class: "input-label",
                                  },
                                  {
                                    tag: "input",
                                    "data-target": "column_position",
                                    type: "number",
                                    value:
                                      sourceImageData.column_position ?? null,
                                  },
                                ],
                              },
                              // {tag: "div", class:"cc", style:"height:var(--input-height);", text: "of"},
                              {
                                tag: "div",
                                class: "input-group xs-gap fc",
                                children: [
                                  {
                                    tag: "div",
                                    text: "Total cols.",
                                    class: "input-label",
                                  },
                                  {
                                    tag: "input",
                                    "data-target": "total_columns",
                                    type: "number",
                                    value:
                                      sourceImageData.total_columns ?? null,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        tag: "div",
                        children: [
                          {
                            tag: "button",
                            id: "delete-source",
                            class: "fbutt",
                            children: [
                              { tag: "div", text: "Delete image" },
                              { tag: "img", src: config.cdn + "/img/icons/delete.svg" },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    class: "modal-body",
                    children: [
                      { tag: "img", class: "source-image-full", src: src },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      // Function updates the database with the current data
      function saveImageInfo() {
        function readTags() {
          var tags = [];
          imageModal
            .querySelectorAll(".source-tag-text")
            .forEach(function (elem) {
              let tagText = elem.innerHTML;
              if (!tags.includes(tagText)) tags.push(elem.innerHTML);
            });
          return tags;
        }

        sourceImageData.tags = readTags();

        // Save the stringified data to modified variable so data is saved for new materials
        config.modified.source_data = JSON.stringify(config.pageData.source_data);

        // Save the updated tags to database
        query({
          table: config.area.query.table,
          action: "update",
          values: {
            source_data: JSON.stringify(config.pageData.source_data),
          },
          id: config.pageData.id,
          auth: true,
        });
      }

      let sourceDataInputs = imageModal.querySelectorAll("[data-target]");
      for (const elem of sourceDataInputs) {
        elem.oninput = function () {
          sourceImageData[elem.getAttribute("data-target")] = elem.value;
          saveImageInfo();
        };
      }

      // Tags
      let tagContainer = imageModal.querySelector(".source-tag-container");
      function addTagElement(tag) {
        let tagElement = createHtml({
          tag: "div",
          class: "source-tag-item",
          children: [
            { tag: "div", class: "source-tag-text", text: tag.trim() },
            { tag: "div", class: "source-tag-x flex-centred" },
          ],
        });

        // Delete tag button logic
        tagElement.querySelector(".source-tag-x").onclick = function () {
          // Delete the HTML element for this tag
          tagElement.remove();
          // Read the tags
          saveImageInfo();
        };

        // Add this tag element to the container
        tagContainer.appendChild(tagElement);
      }

      let newTagInput = imageModal.querySelector("#new-tag-input");
      newTagInput.onkeydown = function (event) {
        if (event.key === "Enter") {
          // Add an HTML element for this tag
          addTagElement(newTagInput.value);
          // Clear the input
          newTagInput.value = "";
          saveImageInfo();
          adminListeners();
        }
      };

      // Add tag elements for all existing tags
      if (sourceImageData.hasOwnProperty("tags")) {
        for (const tag of sourceImageData.tags) {
          addTagElement(tag);
        }
      }

      config.currentImage = filename;

      insertHtml(imageModal);

      imageModal.querySelector("#delete-source").onclick = async function () {
        if (confirm("Are you sure you want to delete this image?")) {
          createLoadingScreen("Deleting source image...");
          imageModal.remove();
          // Remove the image from the DOM
          if (file == "local") {
            remove(elem);
            // Reset the canvas selections
            config.canvasSelections = [];
            document
              .querySelectorAll(".source-image>canvas")
              .forEach(function (elem) {
                config.canvasSelections.push(elem);
              });
            setTimeout(function () {
              removeLoadingScreen("Source image deleted");
            }, 200);
          } else {
            var sourceId =
              config.state.area == "materials"
                ? config.state.id
                : "u" + config.state.id;
            var table = config.area.query.table;
            // Remove the image from the CDN
            var deleteSource = await postJson("/app/delete-samples", {
              materialId: sourceId,
              files: [file],
            });
            if (deleteSource.status == "success") {
              // Remove the source name from the list
              config.pageData["source_names"] = config.pageData[
                "source_names"
              ].filter((item) => item !== file);
              if (
                config.pageData["source_data"] &&
                file in config.pageData["source_data"]
              ) {
                delete config.pageData["source_data"][file];
              }
              // Update the source names in the db
              var removeSourceName = await query({
                action: "update",
                table: table,
                id: config.pageData.id,
                values: {
                  source_names: JSON.stringify(config.pageData["source_names"]),
                  source_data: JSON.stringify(config.pageData["source_data"]),
                },
                auth: true,
              });
              if (removeSourceName.status == "success") {
                remove(elem);
                setTimeout(function () {
                  removeLoadingScreen("Source image deleted");
                }, 200);
              } else {
                setTimeout(function () {
                  removeLoadingScreen(
                    "Source names couldn't be updated",
                    "error"
                  );
                }, 200);
              }
            } else {
              setTimeout(function () {
                removeLoadingScreen("Image couldn't be deleted", "error");
              }, 200);
            }
          }
        }
      };
      adminListeners();
      uiListener();
    };
  });
}

saveButton.onclick = async function () {
  // Read the column names and values from the document
  let values = config.modified;
  let positionData = false;
  let isNewItem = config.state.id == "new" ? true : false;
  if (config.state.area == "uploads") {
    values.user = config.user.id;
  }

  // if there is an email field, trim it
  if (values["email"]) {
    values["email"] = values["email"].trim();
  }

  // Physical dimensions must be mm in database
  if (values["realwidth"] && config.units === "inches")
    values["realwidth"] = inchesToMm(values["realwidth"], 3);
  if (values["realheight"] && config.units === "inches")
    values["realheight"] = inchesToMm(values["realheight"], 3);

  // For new materials, set a default realwidth if none is provided
  if (
    isNewItem &&
    config.state.area === "materials" &&
    !values.hasOwnProperty("realwidth")
  )
    values.realwidth = 250;

  // set the country based on the brand's country if it is available
  if (config.state.area === "materials" && config.user.type === "brand") {
    const brandCountry = await postJson("/app/query", {
      table: "brands",
      columns: ["country"],
      auth: true,
      where: [["id", "=", config.user.brand]],
    }).then((res) => res.results[0].country);

    if (brandCountry) {
      values.country = brandCountry;
    }
  } else if (
    config.state.area === "materials" &&
    config.user.type === "admin" &&
    !values.country &&
    document.querySelector("[data-country='select-materials-button']")
      .textContent === "Country"
  ) {
    const select = document.querySelector("[data-materials='brand']");
    if (select.value) {
      for (const key in config.brands) {
        // loose comparison done on purpose
        if (config.brands[key].id == select.value) {
          const brand = config.brands[key];
          if (brand.country) {
            values.country = brand.country;
          }
        }
      }
    }
  }

  // If there's images to save, create a loading screen with progress bar
  if (
    config.hasOwnProperty("canvasSelections") ||
    config.hasOwnProperty("thumbImage") ||
    config.hasOwnProperty("appIcon") ||
    config.hasOwnProperty("brandLogo")
  ) {
    // Create a loading screen with a progress bar
    var savingScreen = createLoadingScreen(
      "Processing, please keep this tab active",
      { progressBar: true }
    );

    // For source images
    if (config.hasOwnProperty("canvasSelections")) {
      // If it's a new page create the source_names property
      if (
        !config.pageData.hasOwnProperty("source_names") ||
        config.pageData.source_names == null
      )
        config.pageData.source_names = [];
      if (typeof config.pageData.source_names == "string")
        config.pageData.source_names = JSON.parse(config.pageData.source_names);

      var images = {};
      // For every canvas image
      for (const canvas of config.canvasSelections) {
        // Generate a unique filename
        var name = uuidv4() + ".jpg";
        // Associate the canvas with the filename for saving later
        images[name] = canvas;
        // Pass the name to the filenames array
        config.pageData.source_names.push(name);
      }
      if (values === false) {
        values = {};
      }
      // If it's a new item, or it doesn't have an average color yet
      if (
        isNewItem ||
        config.pageData.color == null ||
        config.pageData.color == undefined
      ) {
        values["color"] = await averageColor(config.canvasSelections[0]);
      }
      values["source_names"] = JSON.stringify(config.pageData.source_names);
    }
  } else {
    // If there's no images, just create a normal loading screen
    var savingScreen = createLoadingScreen("Processing...");
  }

  // if positions are updated, save them
  if (config.modified.hasOwnProperty("positions")) {
    // await save positions data
    const saveSuccess = await PositionOverrideHandler.savePositions(
      config.modified.positions
    );
    if (!saveSuccess) {
      removeLoadingScreen("Failed to save due to positions", "error");
      return;
    }
    delete config.modified.positions;
  }

  let saveData = {};
  const thumbFile = generateUid() + generateUid() + ".jpg";
  // If there are any values to save or we have images
  if (
    Object.keys(values) ||
    config.hasOwnProperty("thumbImage") ||
    config.hasOwnProperty("brandLogo") ||
    config.hasOwnProperty("appIcon")
  ) {
    let response = { status: "success" };
    // If values are false, we're just updating the thumbnail
    if (Object.keys(values)) {
      // check if user has enough storage
      if (config.area.query.table === "user_materials") {
        const hasStorage = await checkStorageForUser();
        if (!hasStorage) {
          document.querySelector("#loading-screen")?.remove();
          showInfoMessage(
            "Storage Full",
            "You have exceeded your storage limit. Please delete some of your uploads to make room for new ones."
          );
          return;
        }
      }
      // Determine if it's a new or existing item
      if (isNewItem) {
        saveData = {
          action: "insert",
          table: config.area.query.table,
          values: values,
          auth: true,
        };
      } else {
        saveData = {
          action: "update",
          table: config.area.query.table,
          id: config.state.id,
          values: values,
          auth: true,
        };
      }
      if (config.user.type === "user") {
        saveData.if_owner = true;
      }
      if (
        (config.hasOwnProperty("canvasSelections") ||
          config.hasOwnProperty("thumbImage") ||
          config.hasOwnProperty("appIcon") ||
          config.hasOwnProperty("brandLogo")) &&
        config.state.area === "materials"
      ) {
        saveData.values.thumbnail = thumbFile;
      }

      // Send the request
      if (Object.keys(saveData.values).length > 0) {
        response = await postJson(`/api/materials/${saveData.id}/update`, {
          source_names: saveData.values.source_names
        });
      }
    }

    var savePromises = [];
    // Save images if the query is successful and there are new images
    if (
      response.status == "success" &&
      (config.hasOwnProperty("canvasSelections") ||
        config.hasOwnProperty("thumbImage") ||
        config.hasOwnProperty("appIcon") ||
        config.hasOwnProperty("brandLogo"))
    ) {
      if (isNewItem) {
        var targetId = response.id;
        // If there's no thumb image set, create one
        if (!config.hasOwnProperty("thumbImage")) {
          config.thumbImage == config.canvasSelections[0];
        }
      } else {
        var targetId = config.state.id;
      }

      var saveImages = [];
      // If there's a thumb image selected, or there's uploads but no thumbnail on a new material
      if (
        config.hasOwnProperty("thumbImage") ||
        (config.hasOwnProperty("canvasSelections") && isNewItem)
      ) {
        // If we need to generate a thumbnail dynamically
        if (config.hasOwnProperty("thumbImage")) {
          var thumbData = config.thumbImage.toDataURL();
        } else {
          var thumbData = config.canvasSelections[0].toDataURL();
        }
        if (config.state.area === "uploads") {
          saveImages.push({
            image: thumbData,
            resizeData: { format: "jpg", width: 400, height: 400, quality: 60 },
            location:
              "users/" + config.user.id + "/uploads/thumb-u" + targetId + ".jpg",
          });
        } else {
          // Create new save item
          saveImages.push({
            image: thumbData,
            resizeData: { format: "jpg", width: 500, height: 500 },
            location: "materials/" + targetId + "/thumb/" + thumbFile,
          });
        }
        // Delete the selections
        delete config.thumbImage;
      }

      if (config.hasOwnProperty("canvasSelections")) {
        // For every image
        for (const [name, canvas] of Object.entries(images)) {
          var dataUrl = canvas.toDataURL();
          if (config.state.area === "uploads") {
            // For user uploads, only save the original image size
            saveImages.push({
              image: dataUrl,
              resizeData: { format: "jpg", quality: 60 },
              location: "users/" + config.user.id + "/uploads/" + name,
            });
          } else {
            // Save the original at 95 quality
            saveImages.push({
              image: dataUrl,
              resizeData: { format: "jpg", quality: 95 },
              location: "materials/" + targetId + "/original/" + name,
            });
            // For every size
            for (const size of config.materialSizes) {
              let largestDim =
                canvas.width > canvas.height ? "width" : "height";
              // Only resize if the existing image is smaller than the new size, i.e don't upscale
              let resizeData =
                canvas[largestDim] < size
                  ? { format: "jpg" }
                  : { maxSize: size, format: "jpg" };
              saveImages.push({
                image: dataUrl,
                resizeData: resizeData,
                location: "materials/" + targetId + "/" + size + "/" + name,
              });
            }
          }
        }
        // Delete the selections
        delete config.canvasSelections;
      }

      // Save all images
      savingScreen.progressBar.setStepCount(saveImages.length);
      for (const saveImage of saveImages) {
        var savePromise = new Promise((resolve, reject) => {
          resizeImage(saveImage.image, saveImage.resizeData).then(function (
            image
          ) {
            var file = createBlob(image);
            saveFile(saveImage.location, file).then(function () {
              resolve();
              savingScreen.progressBar.incrementProgress();
            });
          });
        });
        savePromises.push(savePromise);
      }
    }

    if (
      !isNewItem &&
      saveData.values.hasOwnProperty("thumbnail") &&
      config.pageData.id &&
      config.pageData.thumbnail
    ) {
      // check if there is an existing thumbnail and delete it
      const filename =
        "materials/" + config.pageData.id + "/thumb/" + config.pageData.thumbnail;
      postJson("/api/delete-thumbnail", { filename: filename });
    }

    // check for errors when calculating the material's position
    let positionError = false;

    // weight the newly added material
    if (
      config.state.area === "materials" &&
      response.status === "success" &&
      config.state.id === "new"
    ) {
      const materialId = response.id;

      postJson("/api/materials/" + materialId + "/update-weight").then(
        (response) => {
          if (response.rawResponse.status !== 200) {
            positionError = true;
          }
        }
      );
    }

    // Remove the loading screen
    if (response.hasOwnProperty("error")) {
      removeLoadingScreen("Failed to save: " + response.error, "error");
    } else {
      Promise.all(savePromises).then(function () {
        if (isNewItem) {
          // Set the state id to the id of the new item
          config.state.id = response.id;
          config.state.itemAdded = true;
        }
        if (positionError) {
          removeLoadingScreen("Saved. Could not calculate material position!");
        } else {
          removeLoadingScreen("Saved");
        }
      });
    }
  } else {
    // There's nothing to do, remove the loading screen
    setTimeout(function () {
      removeLoadingScreen("Saved");
    }, 250);
  }

  // Reload the listing page if it's a new item
  if (isNewItem || config.area.id || config.area.hasOwnProperty("navClick")) {
    pageLoad();
  } else {
    updateListing(config.pageData, config.modified);
  }
};

function setPageHeading() {
  // Change header
  document.querySelectorAll(".admin-page-heading").forEach(function (elem) {
    elem.innerHTML = config.areas[config.state.area].name;
  });
}

function createListingItem(item) {
  let itemValues = createHtml({
    tag: "div",
    title: item._id,
    class:
      "admin-item" +
      (config.area.itemsUnclickable ? " unclickable" : "") +
      (item.deleted_at ? " bad" : ""),
    children: [],
  });
  let itemContainer = createHtml({
    tag: "div",
    "data-item-id": item._id,
    class: "admin-item-container",
  });

  // Add thumbnails for specific areas
  if (config.area.hasThumbnails) {
    const url = item.imgurl ? item.imgurl : item.thumbnail;
    itemValues.appendChild(
      createHtml({
        tag: "div",
        class: "admin-item-value thumb flex-centred",
        children: [
          {
            tag: "div",
            class: "admin-item-thumb",
            style:
              "background-image:url('" + config.cdn + "/" + url + "');background-color:" +
              item.color +
              ";" +
              (item.thumbnailSize
                ? "background-size:" + item.thumbnailSize + ";"
                : ""),
          },
        ],
      })
    );
  }

  // Add the values
  let valuesHtml = [];
  for (var [key, value] of Object.entries(item)) {
    if (
      !config.area.hasOwnProperty("showColumns") ||
      (config.area.hasOwnProperty("showColumns") &&
        config.area.showColumns.includes(key))
    ) {
      colInd = config.area.showColumns.indexOf(key);
      value =
        ["date", "added", "updated"].includes(key) && value !== 0
          ? unixToDate(value)
          : value;
      value = key === "created_at" && value ? downloadsDateTime(value) : value;
      value = key === "expires" && value ? naturalTimeDifference(value) : value;
      value = value == "" || value == null || value == undefined ? "—" : value;
      if (key === "points") {
        let profSvg = pointsToSvg(value);
        profSvg.style.height = "40px";
        profSvg.style.width = "auto";
        profSvg.style.maxWidth = "100%";
        valuesHtml[colInd] = createHtml({
          tag: "div",
          class: "admin-item-value",
          children: [profSvg],
        });
      } else {
        if (item.deleted_at && key === "status") {
          valuesHtml[colInd] = createHtml({
            tag: "div",
            "data-admin-column": key + "-" + item.id,
            text: "deleted",
            class: "admin-item-value",
          });
        } else {
          valuesHtml[colInd] = createHtml({
            tag: "div",
            "data-admin-column": key + "-" + item.id,
            text: value,
            class: "admin-item-value",
          });
        }
      }
    }
  }
  valuesHtml.forEach(function (v) {
    itemValues.appendChild(v);
  });
  itemContainer.appendChild(itemValues);

  // Create a link to the domain associated with the user's email
  if (config.state.area === "users" && item.email) {
    let commonEmailProviders = [
      "gmail",
      "googlemail",
      "yahoo",
      "web",
      "163",
      "hotmail",
      "seznam",
      "outlook",
      "naver",
      "aol",
      "icloud",
      "mail",
      "zoho",
      "protonmail",
      "yandex",
      "gmx",
      "inbox",
      "fastmail",
      "cox",
      "att",
      "live",
      "rocketmail",
      "me",
      "rediffmail",
      "sbcglobal",
    ];
    let domain = item.email.split("@").pop();
    let subdomain = domain.split(".").shift();
    let customDomain = !commonEmailProviders.includes(subdomain);
    let linkElement = createHtml({
      tag: "a",
      href: "https://" + domain,
      style: customDomain ? "" : "pointer-events:none;",
      class: "admin-item-button-right flex-centred",
      children: [
        customDomain
          ? {
              tag: "img",
              src: config.mediaEndpoint + "/icons/link.svg",
              class: "icon",
            }
          : false,
      ],
    });
    itemContainer.appendChild(linkElement);
  }

  // Add the meta buttons
  if (config.areas[config.state.area].showIds) {
    let itemId = createHtml({
      tag: "div",
      style: "font-size: 10px; color: #999",
      class: "admin-item-button-right flex-centred input-label",
      text: item.id,
    });
    itemId.onclick = function () {
      copyToClipboard(item.id);
    };
    itemContainer.appendChild(itemId);
  }

  if (config.area.hasOwnProperty("showPreview")) {
    let eyeUrl = config.area.showPreview + item._id;
    if (config.state.area === "pages") {
      eyeUrl = config.area.showPreview + item.slug;
    } else if (config.state.area === "materials") {
      if (
        item.hasOwnProperty("category") &&
        typeof item.category === "string"
      ) {
        if (
          [
            "fabric",
            "textile",
            "carpet",
            "wall finishes",
            "wallpaper",
          ].includes(item.category.toLowerCase())
        ) {
          eyeUrl += "&patternId=17";
        } else if (item.category.toLowerCase() === "brick") {
          eyeUrl += "&patternId=2";
        }
      }
    }
    let itemPreview = createHtml({
      tag: "a",
      href: eyeUrl,
      target: "_blank",
      class: "admin-item-button-right flex-centred",
      children: [
        {
          tag: "img",
          src: config.mediaEndpoint + "/icons/eye.svg",
          class: "icon",
        },
      ],
    });
    itemContainer.appendChild(itemPreview);
  }

  // Add the delete icon and delete logic
  let itemDelete = createHtml({
    tag: "div",
    class: "admin-item-button-right flex-centred",
    "data-admin-materials": "delete-" + item.id,
    children: [
      {
        tag: "img",
        src: config.cdn +"/img/icons/delete.svg",
        class: "icon",
      },
    ],
  });
  const itemDeleteEmpty = createHtml({
    tag: "div",
    class: "admin-item-button-right flex-centred",
  });
  if (item.deleted_at) {
    itemContainer.appendChild(itemDeleteEmpty);
  } else if (config.area.showDeleteButton) {
    itemContainer.appendChild(itemDelete);
    itemDelete.onclick = async function (event) {
      // Stop the click on the item
      event.stopPropagation();
      // Make sure confirm deletion
      // TODO: replace with modal
      if (
        confirm(
          "Are you sure you want to remove this " +
            config.areas[config.state.area].singular +
            "?"
        )
      ) {
        // TODO: replace with notification
        createLoadingScreen("Removing...");
        if (item.hasOwnProperty("deleted_at")) {
          const url =
            config.state.area === "materials"
              ? "/api/materials/" + item.id
              : "/api/textures/" + item.id;

          sendJson(url, "DELETE").then((response) => {
            if (response.status !== "success") {
              removeLoadingScreen(
                "Couldn't delete this item: " + response.error,
                "error"
              );
              return;
            }
            if (config.user.type === "admin") {
              document
                .querySelector("[title='" + item.id + "']")
                .classList.add("bad");
              itemDelete.firstChild.remove();
              // remove onclick function
              itemDelete.onclick = function () {};
              if (config.state.area === "materials") {
                document.querySelector(
                  "[data-admin-column='status-" + item.id + "']"
                ).innerText = "deleted";
              }
            } else {
              itemContainer.remove();
            }
            item.deleted_at = new Date().toISOString();
            removeLoadingScreen(
              config.areas[config.state.area].singular.ucFirst() + " removed"
            );
          });
        } else {
          var url = `/api/${config.area.query.table}/${item._id}/delete`;
          var response = await postJson(url);
          if (response.hasOwnProperty("error")) {
            removeLoadingScreen(
              "Couldn't delete this item: " + response.error,
              "error"
            );
          } else {
            removeLoadingScreen(
              config.areas[config.state.area].singular.ucFirst() + " removed"
            );
            // Remove the item from the dom
            itemContainer.remove();
          }
        }
      }
    };
  }

  // Add click listener
  itemValues.onclick = function () {
    config.area.itemsUnclickable ? "" : showSinglePage(item);
  };

  return itemContainer;
}

async function pageLoad() {

  document.querySelectorAll("li").forEach(function (elem) {
    elem.classList.remove("active");
  });
  document
    .querySelector("[data-area='" + config.state.area + "']")
    ?.classList.add("active");
  closeAdminPages();

  if (config.area.navClick) {
    await config.area.navClick();
  } else if (config.areas[config.state.area].hasOwnProperty("id")) {
    await showSinglePage("single");
  } else {
    let areaDbox = createDatabox({
      query: copy(config.area.query),
      moreButton: function () {
        return createHtml({
          tag: "div",
          class: "admin-item-footer shadow",
          text: "More",
        });
      },
      itemHtml: function (item) {
        return createListingItem(item);
      },
    });

    // Format the search input6
    areaDbox.search.setAttribute(
      "class",
      "search pill-input pill-box small fbutt search"
    );
    areaDbox.search.setAttribute("id", "admin-search");

    let colHeaders = [];
    let storageMessage = "";
    if (config.area.hasThumbnails)
      colHeaders.push({
        tag: "div",
        class: "admin-item-value input-label thumb",
        text: "img",
      });
    if (config.area.hasOwnProperty("showColumns")) {
      config.area.showColumns.forEach(function (col) {
        let columnName =
          config.area.replaceColumnNames && config.area.replaceColumnNames[col]
            ? config.area.replaceColumnNames[col]
            : col;
        if (columnName === "created_at") columnName = "date";
        colHeaders.push({
          tag: "div",
          class: "admin-item-value input-label",
          text: columnName,
        });
      });
    }
    if (config.area.showIds)
      colHeaders.push({
        tag: "div",
        class: "admin-item-button-right input-label",
        text: "id",
      });
    if (config.area.hasOwnProperty("showPreview") || config.state.area === "users")
      colHeaders.push({
        tag: "div",
        class: "admin-item-button-right input-label",
      });
    if (config.area.showDeleteButton)
      colHeaders.push({
        tag: "div",
        class: "admin-item-button-right input-label",
      });
    let addButton = createHtml({
      tag: "button",
      id: "add-button",
      text: "Add " + config.area.singular,
      class: "fbutt",
      style: "margin-left:20px;padding: 0 10px;",
    });
    const tooltip = createTooltip("");

    // disable upload button until user storage check
    if (config.state.area === "uploads") {
      addButton.classList.add("button-inactive");
      addButton.appendChild(tooltip);
    }

    // disable brand upload until checking tier
    if (config.user.type === "brand" && config.state.area === "materials") {
      addButton.setAttribute(
        "data-tooltip",
        "You’ve reached the limit for your account, please subscribe for unlimited materials. <a href='mailto:contact@architextures.org?subject=Increase%20material%20limit&body=I%20would%20like%20to%20add%20more%20materials%20to%20our%20account.'>Contact us</a>."
      );
      tooltipListener(addButton);
      addButton.classList.add("button-inactive");
      addButton.style.pointerEvents = "auto";
    }

    let areaHtml = createHtml({
      tag: "div",
      id: "admin-list",
      class: "admin-content",
      children: [
        {
          tag: "div",
          class: "admin-header-container",
          children: [
            {
              tag: "div",
              class: "admin-header",
              children: [
                {
                  tag: "div",
                  class: "flex-centred",
                  children: [
                    {
                      tag: "h1",
                      class: "admin-page-heading",
                      text: config.area.name,
                    },
                    config.area.showAddButton ? addButton : false,
                  ],
                },
                config.area.showSearchBar === false
                  ? ""
                  : {
                      tag: "div",
                      id: "admin-search-container",
                      class: "flex-centred",
                      children: [
                        {
                          tag: "div",
                          class: "pill-input-container",
                          children: [areaDbox.search],
                        },
                      ],
                    },
              ],
            },
            {
              tag: "div",
              class: "admin-item-header-container",
              children: [
                {
                  tag: "div",
                  class: "admin-item-header",
                  children: colHeaders,
                },
              ],
            },
          ],
        },
        { tag: "div", class: "admin-items", children: [areaDbox.container] },
        areaDbox.moreButton,
      ],
    });

    areaDbox.container.style.minHeight = "100vh";
    addButton.onclick = function () {
      showSinglePage("new");
    };
    if (config.page) config.page.remove();
    insertHtml(areaHtml, ".admin-area", "prepend");
    config.page = areaHtml;
    window.scrollTo(0, 0);
    // Add table headers
    //if (response.results.length > 0) {
    //parseResults(response.results);
    //putHeaders(response.results);
    //}
    //setPageHeading();
    //fadeIn("#admin-list", 100);
    //fadeOut(".admin-spinner", 100);
    function calculatePercentage(used, limit) {
      if (limit === 0) {
        throw new Error("Limit cannot be zero."); // Avoid division by zero
      }
      return (used / limit) * 100;
    }
    if (config.state.area === "uploads") {
      await postJson("/api/check-storage").then(
        (response) => {
          if (response.rawResponse.status !== 200) {
            storageMessage =
              "There was an error calculating available storage.";
            return;
          }
          if (response.used > response.limit) {
            storageMessage =
              "Storage is full. Consider removing some materials.";
          } else {
            addButton.classList.remove("button-inactive");
            storageMessage =
              "You have used " +
              calculatePercentage(response.used, response.limit) +
              "% of your available storage";
          }
          tooltip.replaceWith(createTooltip(storageMessage));
        }
      );
    }

    if (config.user.type === "brand" && config.state.area === "materials") {
      const totalMaterials = await postJson("/app/query", {
        table: "protextures",
        columns: ["id"],
        auth: "true",
        where: [["brand", "=", config.user.brand]],
      }).then((response) => response.results.length);

      // ensure brand tier data is available
      if (!config.brand) await getBrand();
      // else as a failsafe when brand does not have a tier or there is an error - requested 30-04-2024
      if (totalMaterials && config.brand.brand_tiers_material_limit) {
        if (config.brand.brand_tiers_material_limit > totalMaterials) {
          addButton.classList.remove("button-inactive", "tooltip");
          addButton.removeAttribute("data-tooltip");
        }
      } else {
        addButton.classList.remove("button-inactive", "tooltip");
        addButton.removeAttribute("data-tooltip");
      }
    }
  }
}

async function showSinglePage(item) {
  if (item == "new") {
    config.state.id = "new";
    var itemName = "New " + config.areas[config.state.area].singular.ucFirst();
  } else if (item == "single") {
    config.state.id = config.areas[config.state.area].id;
    var itemName = "Something";
  } else {
    config.state.id = item.id;
    var itemName = item.name;
  }
  if (itemName == null || itemName == "null") {
    itemName = "—";
  }

  // setup country selection for protextures
  if (config.area.name === "Materials") {
    const button = document.querySelector(
      "[data-country='select-materials-button']"
    );
    if (button) {
      // get and organise countries
      let countries = config.countries;
      countries = sortCountries(countries);
      let currentCountry = item.country
        ? countries.find((c) => c.Iso2 === item.country)
        : null;
      currentCountry = currentCountry ? currentCountry.name : null;
      button.innerHTML = currentCountry ?? "Country";

      // remove existing countries menu
      if (
        document.querySelectorAll(".nav-menu [data-country-code]").length !== 0
      ) {
        document
          .querySelector(".nav-menu [data-country-code]")
          .parentNode.parentNode.remove();
      }

      const countriesMenu = createContextMenu({
        items: countries,
        search: true,
        width: 285,
        height: 700,
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
              '", "select-materials-button")',
            "data-country-code": country.Iso2,
            text: country.name,
          }),
        anchorElement: button,
      });
      countriesMenu.style.display = "none";

      button.addEventListener("click", () => {
        countriesMenu.style.display =
          countriesMenu.style.display === "none" ? "block" : "none";
        document.querySelector(
          ".nav-menu [data-country-code]"
        ).parentNode.scrollTop = 0;
      });
    }
  }

  if (config.modified && config.positionInputs) {
    const pos = config.positionInputs;
    config.modified = {};
    config.positionInputs = pos;
  } else {
    config.modified = {};
  }
  if (config.areas[config.state.area].itemClick) {
    config.areas[config.state.area].itemClick(typeof item === "string" ? {} : item);
  } else if (config.areas[config.state.area].itemTarget.startsWith("/")) {
    // Open link in new tab
    createHtml({
      tag: "a",
      href: config.areas[config.state.area].itemTarget + config.state.id,
      target: "_blank",
    }).click();
  } else {
    // Hide all content
    fadeOut("#admin-single", 0).then(async function () {
      document
        .querySelectorAll(".admin-single-content")
        .forEach(function (elem) {
          elem.style.display = "none";
        });
      setPageHeading();
      fadeIn("#admin-single", 0);
      // Hide any open editor windows
      pluginReturn();

      if (
        config.areas[config.state.area].hasOwnProperty("showSaveButton") &&
        config.areas[config.state.area].showSaveButton == false
      ) {
        fadeOut(saveButton, 0);
      } else {
        fadeIn(saveButton);
      }

      let table = config.area.query.table;

      // If it's a single item page with no list
      if (item == "single") {
        // Remove the x icon, otherwise show it
        fadeOut(singleX, 25);
        fadeOut(document.querySelector(".admin-single-heading"), 0);
      } else {
        fadeIn(singleX, 25);
        fadeIn(document.querySelector(".admin-single-heading"), 0);
      }

      document.querySelector(".admin-single-heading").innerHTML = itemName;
      if (config.user.type === "admin") {
        if (
          (config.state.area === "materials" || config.state.area === "textures") &&
          item.deleted_at
        ) {
          addResurrectButton(config.state.area);
          handleResurrectClick(item, config.state.area);
        }

        if (
          document.querySelector(
            "[data-resurrect='" + config.state.area + "']"
          ) &&
          !item.deleted_at
        ) {
          document
            .querySelector("[data-resurrect='" + config.state.area + "']")
            .remove();
        }
      }

      // Protexture stuff to do before waiting for page data
      let thumbElement = document.getElementById("admin-material-thumbnail");
      if (["materials", "uploads"].includes(config.state.area)) {
        // Set the units on source width inputs
        document
          .querySelectorAll("[data-units-select]")
          .forEach(function (elem) {
            elem.value = config.units;
          });

        thumbElement.style.display = "";
        // Set the thumbnail
        if (config.state.id !== "new") {
          thumbElement.style.backgroundImage = "url('" + config.mediaEndpoint + "/" + item.thumbnail + "')"
          thumbElement.style.backgroundSize = "cover";
          thumbElement.querySelector("img").style.display = "none";
        } else {
          thumbElement.style.backgroundImage = "";
          thumbElement.querySelector("img").style.display = "";
        }

        // Clear the source container and selections
        document.querySelectorAll(".source-image").forEach(function (elem) {
          elem.remove();
        });
        delete config.canvasSelections;

        // Remove previous design options
        document
          .querySelectorAll(".admin-design-option")
          .forEach(function (elem) {
            elem.remove();
          });
      } else {
        thumbElement.style.display = "none";
      }

      // Load the data
      if (item !== "new") {
        let fetch = await postJson(`/api/saves/${item._id}`);
        config.pageData = fetch.results[0];
        var newItem = false;
      } else {
        config.pageData = {};
        var newItem = true;
      }

      // Stuff to do for brands only
      if (config.area.query.table == "brands") {
        if (config.state.id !== "new") {
          // Reset the logo and icon
          brandLogoImg.src = "";
          //appIconButton.style.backgroundImage = "url('/img/upload.svg')";
          // Set the logo and icon
          var logoUrl = config.cdn + config.pageData.logo;
          var logo = new Image();
          logo.onload = function () {
            brandLogoImg.src = logoUrl + "?v=" + generateUid();
          };
          logo.src = logoUrl + "?v=" + generateUid();
          var icon = new Image();
          icon.onload = function () {
            //appIconButton.style.backgroundImage = "url('" + folder + "/icon/100.png?v=" + generateUid() + "')";
          };
          icon.src = logoUrl + "?v=" + generateUid();
        }
      }

      // Check for additional fetches
      var moreFetches = [];
      elements("[data-fetch]").forEach(function (elem) {
        moreFetches.push(
          new Promise(function (resolve) {
            var table = elem.getAttribute("data-fetch");
            query({ table: table }).then(function (response) {
              if (elem.tagName == "SELECT") {
                elem.innerHTML = "";
                response.results.forEach(function (cat, i) {
                  elem.appendChild(
                    createHtml({ tag: "option", value: cat.id, text: cat.name })
                  );
                });
              }
              resolve();
            });
          })
        );
      });

      await Promise.all(moreFetches).then(function () {
        // Set all regular inputs
        document
          .querySelectorAll(
            config.areas[config.state.area].itemTarget + " [data-column]"
          )
          .forEach(function (elem) {
            // Set the modified value to false
            elem.setAttribute("data-modified", "false");
            let column = elem.getAttribute("data-column");
            // If column name has a dot, interpret it as a JSON column
            if (column.includes(".")) {
              var objectParts = column.split(".");
              column = objectParts[0];
              var readJson = true;
            } else {
              var readJson = false;
            }

            if (elem.hasAttribute("data-type")) {
              if (elem.getAttribute("data-type") == "array") {
                if (
                  Array.isArray(config.pageData[column]) &&
                  (config.pageData[column].includes(elem.value) ||
                    config.pageData[column].includes(parseInt(elem.value)))
                ) {
                  elem.checked = true;
                } else {
                  elem.checked = false;
                }
              }
              if (elem.getAttribute("data-type") == "string-array") {
                elem.value = config.pageData[column]
                  ? JSON.stringify(config.pageData[column])
                  : "";
              }
              if (elem.getAttribute("data-type") == "jsol") {
                if (newItem) createJsol(elem);
                if (!newItem)
                  createJsol(elem, JSON.parse(config.pageData[column]));
              }
            } else {
              // If this column is in the results array
              if (Object.keys(config.pageData).includes(column) || newItem) {
                // Interpret the value
                if (readJson && !newItem) {
                  if (
                    objectParts.length == 2 &&
                    config.pageData[column].hasOwnProperty(objectParts[1])
                  ) {
                    var value = config.pageData[column][objectParts[1]];
                  }
                  if (
                    objectParts.length == 3 &&
                    config.pageData[column].hasOwnProperty(objectParts[1]) &&
                    config.pageData[column][objectParts[1]].hasOwnProperty(
                      objectParts[2]
                    )
                  ) {
                    var value =
                      config.pageData[column][objectParts[1]][objectParts[2]];
                  }
                } else {
                  var value = config.pageData[column];
                }
                // If it's a new item, set blank values
                if (newItem) {
                  // If the element has a default value associated with it
                  if (elem.hasAttribute("data-value")) {
                    // Set this value
                    value = elem.getAttribute("data-value");
                    // Save to modified so that these default values will be saved
                    config.modified[column] = value;
                  } else {
                    value = "";
                  }
                } else if (value == undefined || value == null) {
                  value = "";
                }

                // If units are set to inches, convert physical dimensions from mm
                if (
                  ["realwidth", "realheight"].includes(column) &&
                  config.units === "inches" &&
                  value
                ) {
                  value = mmToInches(value, 3);
                }

                // If the element is a checkbox set it to checked or not checked
                if (elem.getAttribute("type") == "checkbox") {
                  if (value == 1) {
                    elem.checked = true;
                  } else {
                    elem.checked = false;
                  }
                } else {
                  // Set the value
                  elem.value = value;
                }
              }
            }
          });
      });

      // Stuff to do for texture previews
      if (config.state.area == "textures" || config.state.area == "saved") {
        if (config.state.id !== "new") {
          elements(".texture-preview").forEach(function (elem) {
            elem.style.backgroundColor = config.pageData.color;
            elem.style.backgroundImage =
              "url(" +
              config.mediaEndpoint +
              "" +
              config.pageData.imgurl +
              "?s=400&q=60" +
              ")";
          });
          console.log("pageData", config.pageData)
          elements("#admin-texture-edit").forEach(function (elem) {
            const textureUrl = new URL(
              window.location.protocol + window.location.host + "/create"
            );
            if (config.state.area == "textures")
              textureUrl.searchParams.append("id", config.pageData._id);
            if (config.state.area == "saved")
              textureUrl.searchParams.append("save", config.pageData._id);
            elem.href = textureUrl.href;
          });
        }
      }

      // Set the source images
      if (["materials", "uploads"].includes(config.state.area)) {
        // Update the thumbnail color
        thumbElement.style.backgroundColor = config.pageData.color;
        // If it's an existing material, load the source images
        if (config.state.id !== "new") {
          if (Array.isArray(config.pageData.source_names)) {
            for (const filename of config.pageData.source_names) {
              var imgSrc =
                config.state.area == "uploads"
                  ? config.mediaEndpoint +
                    "/users/" +
                    config.pageData.user +
                    "/uploads/" +
                    filename
                  : config.mediaEndpoint +
                    "/materials/" +
                    config.pageData.id +
                    "/800/" +
                    filename;
              insertHtml(
                createHtml({
                  tag: "div",
                  class: "source-image shadow",
                  "data-file": filename,
                  children: [
                    {
                      tag: "img",
                      src: imgSrc,
                    },
                  ],
                }),
                ".source-image-container"
              );
            }
            sourceImageListener();
          }
        }

        // Add the design options
        if (config.brand) {
          sendJson(
            "/api/design-options?brand=" + config.pageData.brand,
            "GET"
          ).then(function (allDesignOptions) {
            // Get material design options
            query({
              table: "material_x_design_option",
              where: [["material", "=", config.pageData.id]],
              limit: 1000,
            }).then(function (materialOptions) {
              let selectedMaterialOptions = materialOptions.results;
              // Sort alpha numerically
              allDesignOptions.sort(function (a, b) {
                var comparison = a.name.localeCompare(b.name, "en", {
                  numeric: true,
                  sensitivity: "base",
                });
                return comparison > 0 ? 1 : comparison < 0 ? -1 : 0;
              });

              let categories = {};
              for (var option of allDesignOptions) {
                // Create an object for this categroy if it doesn't exist
                if (!categories[option.categoryName])
                  categories[option.categoryName] = {};
                option.selected = selectedMaterialOptions.find(
                  (element) => element.design_option === option.id
                )
                  ? true
                  : false;
                categories[option.categoryName][option.name] = option;
              }

              // For each category create buttons and menus
              for (const [category, options] of Object.entries(categories)) {
                var html = createHtml({
                  tag: "div",
                  class: "admin-design-option",
                  children: [
                    {
                      tag: "div",
                      class: "input-label",
                      text: category.toLowerCase(),
                    },
                    {
                      tag: "div",
                      class: "input dropdown-trigger",
                      "data-type": category,
                      children: [
                        {
                          tag: "div",
                          class: "pseudo-select-text",
                          text: "Select " + category.toLowerCase(),
                        },
                      ],
                    },
                  ],
                });
                insertHtml(html, ".admin-design-options");

                // Dropdown button trigger
                let selectOptionsButton =
                  html.querySelector(".dropdown-trigger");
                selectOptionsButton.onclick = function () {
                  createContextMenu({
                    items: Object.values(options),
                    itemHtml: function (item) {
                      let optionCheckbox = createHtml({
                        tag: "input",
                        type: "checkbox",
                      });
                      let label = createHtml({
                        tag: "label",
                        class: "nav-menu-item",
                        children: [
                          optionCheckbox,
                          { tag: "span", text: item.name },
                        ],
                      });
                      if (item.name === "210 x 100 x 50 mm") console.log(item);
                      label.querySelector("input").checked = item.selected;

                      optionCheckbox.onchange = function () {
                        var material = config.pageData.id;
                        var option = item.id;
                        if (optionCheckbox.checked) {
                          item.selected = true;
                          // Add this option
                          query({
                            table: "material_x_design_option",
                            action: "insert",
                            values: {
                              material: material,
                              design_option: option,
                            },
                            auth: true,
                          });
                        } else {
                          item.selected = false;
                          // Remove this option
                          query({
                            table: "material_x_design_option",
                            action: "delete",
                            where: [
                              ["material", "=", material],
                              ["design_option", "=", option],
                            ],
                            auth: true,
                          });
                        }
                      };

                      return label;
                    },
                    anchorElement: selectOptionsButton,
                  });
                };
              }
            });
          });
        }

        // Clear additional sizes
        document.querySelectorAll(".available-size").forEach(function (elem) {
          elem.remove();
        });
        // Clear base size
        elements(".available-width").forEach(function (elem) {
          elem.value = "";
        });
        elements(".available-height").forEach(function (elem) {
          elem.value = "";
        });
      }
      // Show page template
      fadeIn(config.areas[config.state.area].itemTarget, 100);
      fadeIn("#admin-single", 100);
    });

    // position handler
    if (config.user.type === "admin") {
      let positions;
      let element;

      if (config.state.area === "materials") {
        element = document.querySelector("[data-admin='materials-position']");
        element.innerHTML = "";
        positions = materialPositions;
      }
      if (config.state.area === "textures") {
        element = document.querySelector("[data-admin='textures-position']");
        element.innerHTML = "";
        positions = texturePositions;
      }

      // instantiate position handler
      const positionHandler = new PositionOverrideHandler(
        element,
        item.id,
        positions,
        config.state.area
      );
      positionHandler.init();
      positionHandler.addEventListeners();
    }
  }
  setProxies();
  adminListeners();
  uiListener();
}

document.querySelectorAll("li").forEach(function (element) {
  element.onclick = function (el) {
    fadeOut("#admin-single", 0);
    if (config.currentPage) config.currentPage.remove();
    // Set the state
    config.state.area = this.getAttribute("data-area");
    config.area = config.areas[config.state.area];
    // Load the new page unless it is statistics
    pageLoad();
  };
});

pageLoad();
if (config.state.item) {
  if (!config.area.table) {
    config.area.itemClick();
  } else {
    postJson("/app/query", {
      table: config.area.table,
      where: [["id", "=", config.state.item]],
      auth: true,
    }).then((response) => {
      if (config.area.itemClick) {
        config.area.itemClick(response.results[0]);
      } else if (config.area.table) {
        showSinglePage(response.results[0]);
      }
    });
  }
}

/**
 * Setup charts and display them
 * @param data
 * @param select
 * @param brandsFilter
 */
function generateStatisticsCharts(data, select = null, brandsFilter = null) {
  // remove old content if the page is refreshed or the dates were changed
  closeAdminPages();
  const userStatistics = document.querySelector(
    "[data-statistics='user-statistics']"
  );
  if (userStatistics) {
    userStatistics.remove();
  }

  // check if dates are set
  const dates = data.dates.length ? data.dates : Statistics.dates;

  // setup main container
  document
    .querySelector(".admin-area")
    .appendChild(Statistics.createMainContainer(dates));

  // show spinner
  document.querySelector(".admin-area").appendChild(Statistics.spinner);
  document.querySelector(".admin-area").style.pointerEvents = "none";

  // setup labels to be used
  const viewsLabel = "Views";
  const downloadsLabel = "Downloads";
  const referralsLabel = "Referrals";

  // setup views chart
  const views = new Statistics(data.views, dates, viewsLabel);
  const htmlViews = views.generate();
  const configViews = views.config();

  // setup downloads chart
  const downloads = new Statistics(data.downloads, dates, downloadsLabel);
  const htmlDownloads = downloads.generate();
  const configDownloads = downloads.config();

  // setup referrals chart
  const referrals = new Statistics(data.referrals, dates, referralsLabel);
  const htmlReferrals = referrals.generate();
  const configReferrals = referrals.config();

  // remove charts if they exist within the dom
  Statistics.removeChart(viewsLabel);
  Statistics.removeChart(downloadsLabel);
  Statistics.removeChart(referralsLabel);

  // add brand filter here, so it is available even if no results are found
  if (brandsFilter) {
    document.querySelector('[data-brand-filter="brand"]').remove();
    document
      .querySelector("[data-statistics='date-picker-filters']")
      .appendChild(brandsFilter);
  } else {
    if (config.user.type === "admin") Statistics.addBrandFilter();
  }

  // check if data exists and show message if not
  if (!data.views.length && !data.downloads.length && !data.referrals.length) {
    // hide spinner
    document.querySelector(".admin-area").removeChild(Statistics.spinner);
    document.querySelector(".admin-area").style.pointerEvents = "auto";
    document.querySelector(".chartjs-no-results").style.display = "block";
    return;
  }

  // add new chart htmls
  document
    .querySelector('[data-main-chart-container="container"]')
    .appendChild(htmlViews);
  document
    .querySelector('[data-main-chart-container="container"]')
    .appendChild(htmlDownloads);
  document
    .querySelector('[data-main-chart-container="container"]')
    .appendChild(htmlReferrals);

  views.attachFilterListeners();
  downloads.attachFilterListeners();

  // set dropdown if selected
  if (select) {
    document.querySelector('[data-fixed-date="date-range"]').value = select;
  }

  // attach listeners for date range and buttons
  Statistics.attachListeners();

  // create and display charts
  views.chart = new Chart(
    document.querySelector(
      '[data-chart-graph="chartjs-' + viewsLabel.toLowerCase() + '"]'
    ),
    configViews
  );

  downloads.chart = new Chart(
    document.querySelector(
      '[data-chart-graph="chartjs-' + downloadsLabel.toLowerCase() + '"]'
    ),
    configDownloads
  );

  referrals.chart = new Chart(
    document.querySelector(
      '[data-chart-graph="chartjs-' + referralsLabel.toLowerCase() + '"]'
    ),
    configReferrals
  );

  // hide spinner
  document.querySelector(".admin-area").removeChild(Statistics.spinner);
  document.querySelector(".admin-area").style.pointerEvents = "auto";

  // add filters
  views.addSourceFilter();
  downloads.addSourceFilter();
  // unused filters
  // referrals.addSourceFilter();

  // show user statistics
  if (config.user.type === "admin") {
    new UserStatistics().showStatistics();
  }
}
