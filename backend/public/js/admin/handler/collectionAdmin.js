class CollectionAdmin {
  constructor(collections, userId, isAdmin, isPlugin) {
    this.collections = collections;
    this.colour5 = "#e1e1e1";
    this.colour4 = "#d1d1d1";
    this.colour3 = "#c1c1c1";
    this.colour2 = "#b1b1b1";
    this.colour1 = "#a1a1a1";
    this.userId = userId;
    this.isAdmin = isAdmin;
    this.isPlugin = isPlugin;
  }
  static adminSpinner = createHtml({
    tag: "div",
    "data-admin-collections": "spinner",
    class: "flex-centred cc archive-message",
    style:
      "pointer-events:none;position:fixed;top:104;width:calc(100% - 200px);height:calc(100% - 104px);z-index:999999; background-color: rgba(255,255,255,0.6);",
    children: [{ tag: "div", style: "width:40px;", class: "spinner" }],
  });
  static userSpinner = createHtml({
    tag: "div",
    "data-user-collections": "spinner",
    class: "flex-centred cc archive-message",
    style:
      "pointer-events:none;position:fixed;left:0;right:0;height:100%;z-index:999999; background-color: rgba(255,255,255,0.6);",
    children: [{ tag: "div", style: "width:40px;", class: "spinner" }],
  });
  static createMainContainer(isAdmin) {
    return createHtml({
      tag: "div",
      class: "admin-content admin-collection",
      children: [
        {
          tag: "div",
          class: "admin-header-container",
          children: [
            {
              tag: "div",
              class: "admin-header admin-header-single",
              style: "border-bottom: unset;",
              children: [
                {
                  tag: "div",
                  class: "admin-single-heading-left",
                  style: "justify-content: space-between;",
                  children: [
                    {
                      tag: "div",
                      "data-admin-collections": "header-div",
                      children: [
                        {
                          tag: "div",
                          "data-admin-collections": "main-header",
                          children: [{ tag: "h1", text: "Collections" }],
                        },
                      ],
                    },
                    isAdmin
                      ? {
                          tag: "input",
                          class: "search pill-input pill-box small fbutt",
                          "data-admin-collections": "search",
                          placeholder: "Search",
                          style: "width: unset",
                        }
                      : "",
                  ],
                },
              ],
            },
            {
              tag: "div",
              class: "admin-item-header",
              "data-admin-collections": "total-collections",
              style: "width: unset; height: 16px;",
            },
          ],
        },
        {
          tag: "div",
          class: "collection-container asset-container",
          children: [
            {
              tag: "div",
              class: "collection-row asset-grid",
              "data-admin-collections": "row",
              children: [
                {
                  tag: "div",
                  "data-id": "new-collection",
                  "data-admin-collections": "new-collection-container",
                  children: [
                    {
                      tag: "div",
                      class: "collection-item asset",
                      "data-admin-collections": "new-collection",
                      children: [
                        {
                          tag: "img",
                          src: "https://cdn.architextures.org/icons/x.svg",
                          width: "32",
                          style: "transform:rotate(45deg);",
                        },
                      ],
                    },
                    {
                      tag: "div",
                      text: "Add collection",
                      style: "margin-top:10px;",
                      class: "collection-item-title",
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

  addUserCollections() {
    this.collections.forEach((collection, index) => {
      collection.instanceIndex = index;
      const item = createHtml({
        tag: "div",
        "data-id": collection.id,
        style: "position: relative;",
        "data-admin-collections": "show-collection-" + collection.id,
        children: [
          {
            tag: "div",
            class: "collection-item asset pntr",
            "data-admin-collections": "item-" + index,
            "data-admin-collections-id": collection.id,
            "data-admin-collections-name": collection.name,
          },
          {
            tag: "div",
            style:
              "display: flex; justify-content: space-between;margin-top:10px;",
            children: [
              {
                tag: "div",
                style: "max-width: 90%;",
                children: [
                  {
                    tag: "div",
                    text: collection.name,
                    class: "collection-item-title sline",
                  },
                  {
                    tag: "div",
                    class: "input-label",
                    text:
                      collection.totalTextures +
                      " texture" +
                      (collection.totalTextures === 1 ? "" : "s"),
                  },
                ],
              },
              {
                tag: "div",
                class: "cv",
                children: [
                  {
                    tag: "div",
                    "data-admin-collections": "menu-" + collection.id,
                    class: "cc",
                    style: "background:white;",
                    children: [
                      {
                        tag: "img",
                        class: "icon",
                        src: artx.cdn + "/icons/kebab.svg?v=2",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      document
        .querySelector("[data-admin-collections='row']")
        .appendChild(item);
    });
  }

  addTotalTextures() {
    if (
      document.querySelector("[data-admin-collections='total-collections']")
        .firstChild
    )
      document
        .querySelector("[data-admin-collections='total-collections']")
        .firstChild.remove();
    document
      .querySelector("[data-admin-collections='total-collections']")
      .appendChild(
        createHtml({
          tag: "div",
          class: "admin-item-value input-label thumb",
          text:
            this.collections.length +
            " collection" +
            (this.collections.length === 1 ? "" : "s"),
        })
      );
  }

  addEventListeners() {
    // add new collection
    document
      .querySelector("[data-admin-collections='new-collection']")
      .addEventListener("click", () => {
        const modal = this.createModal();
        if (document.querySelector("#new-collection-modal"))
          document.querySelector("#new-collection-modal").remove();
        insertHtml(modal);

        document
          .querySelector("[data-user-collection='new-collection-name']")
          .addEventListener("click", () => {
            // ensure name is at least 2 characters long
            if (
              document.querySelector("[data-user-collection='new-name']").value
                .length < 2
            ) {
              addNotification({
                text: "Name must be at least 2 characters",
                image: "warning",
                duration: 3000,
              });
              return;
            }

            document.querySelector(
              "[data-user-collection='new-collection-name']"
            ).disabled = true;
            const notification = addNotification({
              image: "spinner",
              text: "Creating new collection...",
            });
            const name = document.querySelector(
              "[data-user-collection='new-name']"
            ).value;
            postJson("/app/collections", {
              method: "createCollection",
              name: name,
            }).then((response) => {
              modal.remove();
              if (response.rawResponse.status !== 200) {
                notification.updateNotification({
                  text: "Error creating collection",
                  image: "warning",
                });
              } else {
                notification.updateNotification({
                  text: "Collection created",
                  image: "tick",
                });
              }
              CollectionAdmin.refreshCollections(this.isAdmin);
            });
          });

        // handle modal close
        document
          .querySelector("[data-close='#new-collection-modal']")
          .addEventListener("click", () => {
            modal.remove();
          });
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            modal.remove();
          }
        });
      });

    // show collection
    document
      .querySelectorAll("[data-admin-collections^='item']")
      .forEach((collection) => {
        collection.addEventListener("click", () => {
          CollectionAdmin.showSpinner();
          const id = collection.getAttribute("data-admin-collections-id");
          const name = collection.getAttribute("data-admin-collections-name");
          const collectionInstance = new SingleCollectionAdmin(
            id,
            name,
            this.userId,
            this.isAdmin,
            this.isPlugin
          );
          collectionInstance.loadInitialPage();
          collectionInstance.init();
        });
      });

    // show menu
    document
      .querySelectorAll("[data-admin-collections^='menu-']")
      .forEach((menu) => {
        menu.addEventListener("click", (e) => {
          const id = menu.getAttribute("data-admin-collections").split("-")[1];
          const items = [
            { text: "Rename", "data-admin-collections": "rename-" + id },
            { text: "Rearrange", "data-admin-collections": "rearrange-" + id },
            { text: "Delete", "data-admin-collections": "delete-" + id },
          ];
          this.generateMenu(items, id);
          this.addMenuEventListeners();
        });
      });

    // handle search
    if (this.isAdmin) {
      this.collectionsSearch("[data-admin-collections='search']");
    }
  }

  collectionsSearch(inputElement) {
    document.querySelector(inputElement).addEventListener("keyup", (e) => {
      const query = e.target.value;
      const collections = document.querySelectorAll(
        "[data-admin-collections^='show-collection']"
      );
      collections.forEach((collection) => {
        const name = collection
          .querySelector(".collection-item-title")
          .innerText.toLowerCase();
        if (name.includes(query.toLowerCase())) {
          collection.style.display = "block";
        } else {
          collection.style.display = "none";
        }
      });
    });
  }

  generateMenu(items, menuId) {
    const anchor = document.querySelector(
      "[data-admin-collections='menu-" + menuId + "']"
    );
    const menu = createContextMenu({
      items: items,
      itemHtml: function (item) {
        return createHtml({
          tag: "div",
          class: "nav-menu-item sh",
          text: item.text,
          "data-admin-collections": item["data-admin-collections"],
          "data-admin-collections-kebab-menu": "1",
        });
      },
      x: anchor.getBoundingClientRect().x - 270,
      y: anchor.getBoundingClientRect().y,
      width: 300,
      height: false,
      isHiddenOnClose: true,
    });
    insertHtml(menu);
  }

  addMenuEventListeners() {
    // handle rename
    this.handleRenameCollection();

    // handle rearrange
    this.handleRearrangeCollection();

    // handle delete
    this.handleDeleteCollection();
  }

  handleRenameCollection() {
    document
      .querySelectorAll("[data-admin-collections^='rename-']")
      .forEach((rename) => {
        const id = rename.getAttribute("data-admin-collections").split("-")[1];
        const name = document.querySelector(
          "[data-admin-collections='show-collection-" +
            id +
            "'] .collection-item-title"
        ).innerText;

        rename.addEventListener("click", () => {
          // hide menu
          rename.parentNode.parentNode.style.display = "none";

          // show renaming modal
          const modal = createHtml({
            tag: "div",
            id: "rename-collection-modal",
            class: "modal",
            children: [
              {
                tag: "div",
                class: "modal-window modal-window-collection-small",
                style: "padding: var(--padding);",
                children: [
                  {
                    tag: "div",
                    class: "modal-header",
                    children: [
                      {
                        tag: "div",
                        class: "modal-title",
                        text: "Rename Collection",
                      },
                      {
                        tag: "img",
                        class: "icon",
                        src: "https://cdn.architextures.org/icons/x.svg",
                        "data-close": "#rename-collection-modal",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    class: "modal-footer modal-footer-collection",
                    children: [
                      {
                        tag: "input",
                        type: "text",
                        "data-admin-collections": "new-name",
                        value: name,
                      },
                      {
                        tag: "button",
                        "data-admin-collections": "update-collection-name",
                        text: "Save",
                      },
                    ],
                  },
                ],
              },
            ],
          });
          insertHtml(modal);

          // handle renaming
          document
            .querySelector("[data-admin-collections='update-collection-name']")
            .addEventListener("click", () => {
              // show spinner notification
              const notification = addNotification({
                text: "Renaming collection...",
                image: "spinner",
              });

              const newName = document.querySelector(
                "[data-admin-collections='new-name']"
              ).value;

              document.querySelector(
                "[data-admin-collections='show-collection-" +
                  id +
                  "'] .collection-item-title"
              ).innerText = newName;

              postJson("/app/collections", {
                method: "updateCollection",
                collection: id,
                name: newName,
              }).then((response) => {
                // remove modal
                modal.remove();

                // update notification
                if (response.status !== "success") {
                  notification.updateNotification({
                    text: "Error renaming collection",
                    image: "warning",
                    duration: 3000,
                  });
                } else {
                  notification.updateNotification({
                    text: "Collection renamed",
                    image: "tick",
                    duration: 2000,
                  });
                }
              });
            });

          // handle modal close
          document
            .querySelector("[data-close='#rename-collection-modal']")
            .addEventListener("click", () => {
              modal.remove();
            });
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              modal.remove();
            }
          });
        });
      });
  }

  handleRearrangeCollection() {
    document
      .querySelectorAll("[data-admin-collections^='rearrange-']")
      .forEach((rearrange) => {
        rearrange.addEventListener("click", () => {
          this.originalOrder = this.collections.map((col) => col.id);

          // hide menu
          rearrange.parentNode.parentNode.style.display = "none";

          // disable add new
          const addNew = document.querySelector(
            "[data-admin-collections='new-collection']"
          );
          addNew.style.pointerEvents = "none";
          addNew.style.opacity = "0.5";
          addNew.style.backgroundColor = "#a1a1a1";

          // show icon on top of each collection
          this.showMoveIcons();

          // enable sortable
          this.sortable = Sortable.create(
            document.querySelector(".collection-row"),
            {
              animation: 150,
              ghostClass: "sortable-chosen-ghost",
              filter: "[data-admin-collections='new-collection-container']",
              onUpdate: function (element) {
                document.querySelector(
                  "[data-admin-collections='reset-rearrange']"
                ).style.display = "block";
                document.querySelector(
                  "[data-admin-collections='cancel-rearrange']"
                ).style.display = "none";

                const parent = element.item.parentElement;
                const firstChild = parent.firstElementChild;
                if (
                  firstChild.dataset.adminCollection !==
                  "new-collection-container"
                ) {
                  const itemToMove = document.querySelector(
                    '[data-admin-collections="new-collection-container"]'
                  );
                  parent.insertBefore(itemToMove, firstChild);
                }
              },
            }
          );
          this.sortable.option("disabled", false);

          // show save button next to title in header
          this.handleSaveNewCollectionOrder();
        });
      });
  }

  showMoveIcons() {
    document
      .querySelectorAll("[data-admin-collections^='item-']")
      .forEach((collection) => {
        const moveIcon = createHtml({
          tag: "div",
          class: "move-icon-collections",
          children: [
            {
              tag: "img",
              width: "10%",
              src: "https://cdn.architextures.org/icons/drag2.svg",
            },
          ],
        });

        moveIcon.style.position = "absolute";
        moveIcon.style.top = 0;
        moveIcon.style.width = "100%";
        moveIcon.style.height = "100%";

        collection.firstChild.style.opacity = "0.5";
        collection.style.boxShadow = "none";
        Array.from(collection.parentNode.children).forEach(
          (c) => (c.style.pointerEvents = "none")
        );
        collection.appendChild(moveIcon);
      });
  }

  handleSaveNewCollectionOrder() {
    this.rearrangeSaveButton = createHtml({
      tag: "button",
      "data-admin-collections": "save-rearrange",
      style: "margin-left: 15px;",
      text: "Save",
      class: "fbutt",
    });
    this.rearrangeResetButton = createHtml({
      tag: "button",
      "data-admin-collections": "reset-rearrange",
      style: "margin-left: 15px;",
      text: "Reset",
      class: "fbutt",
    });
    this.rearrangeCancelButton = createHtml({
      tag: "button",
      "data-admin-collections": "cancel-rearrange",
      style: "margin-left: 15px;",
      text: "Cancel",
      class: "fbutt",
    });
    this.rearrangeResetButton.style.display = "none";

    document
      .querySelector("[data-admin-collections='header-div']")
      .appendChild(this.rearrangeSaveButton);
    document
      .querySelector("[data-admin-collections='header-div']")
      .appendChild(this.rearrangeResetButton);
    document
      .querySelector("[data-admin-collections='header-div']")
      .appendChild(this.rearrangeCancelButton);

    // handle save
    this.handleSaveOrder();

    // handle cancel
    this.handleCancelOrder();

    // handle reset
    this.handleResetOrder();
  }

  handleResetOrder() {
    this.rearrangeResetButton.addEventListener("click", () => {
      this.rearrangeResetButton.style.display = "none";
      this.rearrangeCancelButton.style.display = "block";

      // use this.originalOrder to reset the order
      const parent = document.querySelector("[data-admin-collections='row']");
      this.originalOrder.forEach((id) => {
        parent.append(document.querySelector("[data-id='" + id + "']"));
      });
    });
  }

  handleCancelOrder() {
    this.rearrangeCancelButton.addEventListener("click", () => {
      this.sortable.option("disabled", true);

      this.rearrangeSaveButton.remove();
      this.rearrangeResetButton.remove();
      this.rearrangeCancelButton.remove();

      this.resetAfterOrdering();
    });
  }

  resetAfterOrdering() {
    const addNew = document.querySelector(
      "[data-admin-collections='new-collection']"
    );
    addNew.style.pointerEvents = "auto";
    addNew.style.opacity = "1";
    addNew.style.backgroundColor = "#e1e1e1";
    document
      .querySelectorAll(".move-icon-collections")
      .forEach((icon) => icon.remove());
    document
      .querySelectorAll("[data-admin-collections^='item-']")
      .forEach((collection) => {
        collection.firstChild.style.opacity = "1";
        Array.from(collection.parentNode.children).forEach(
          (c) => (c.style.pointerEvents = "auto")
        );
        collection.style.boxShadow = "";
      });
  }

  handleSaveOrder() {
    this.rearrangeSaveButton.addEventListener("click", () => {
      let collectionOrder = this.sortable.toArray();
      collectionOrder = collectionOrder.filter((id) => id !== "new-collection");
      this.sortable.option("disabled", true);

      this.rearrangeSaveButton.remove();
      this.rearrangeResetButton.remove();
      this.rearrangeCancelButton.remove();

      postJson("/app/collections", {
        method: "updateCollectionsPosition",
        collectionsPosition: collectionOrder,
      }).then((response) => {
        if (response.rawResponse.status !== 200) {
          addNotification({
            text: "Error saving collection order",
            image: "warning",
          });
        } else {
          addNotification({
            text: "Collection order saved",
            image: "tick",
          });
        }
        // re-enable all functionality
        this.resetAfterOrdering();
      });
    });
  }

  handleDeleteCollection() {
    document
      .querySelectorAll("[data-admin-collections^='delete-']")
      .forEach((delButton) => {
        const id = delButton
          .getAttribute("data-admin-collections")
          .split("-")[1];
        const name = document.querySelector(
          "[data-admin-collections='show-collection-" +
            id +
            "'] .collection-item-title"
        ).innerText;

        delButton.addEventListener("click", () => {
          // hide menu
          delButton.parentNode.parentNode.style.display = "none";

          const modal = createHtml({
            tag: "div",
            id: "delete-collection-modal",
            class: "modal",
            children: [
              {
                tag: "div",
                class: "modal-window modal-window-collection-small",
                style: "padding: var(--padding);",
                children: [
                  {
                    tag: "div",
                    class: "modal-header",
                    children: [
                      {
                        tag: "div",
                        class: "modal-title",
                        text: "Delete " + name,
                      },
                      {
                        tag: "img",
                        class: "icon",
                        src: "https://cdn.architextures.org/icons/x.svg",
                        "data-close": "#delete-collection-modal",
                      },
                    ],
                  },
                  {
                    tag: "div",
                    class: "modal-body",
                    children: [
                      {
                        tag: "div",
                        class: "modal-content",
                        children: [
                          {
                            tag: "div",
                            style: "padding: 0 10px;",
                            text: "Deleting this collection will remove the textures from it. The textures will remain in the Saved section, or in any other collections.",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    tag: "div",
                    class: "modal-footer modal-footer-collection",
                    children: [
                      {
                        tag: "button",
                        "data-admin-collections": "delete-collection-confirm",
                        text: "Delete",
                      },
                    ],
                  },
                ],
              },
            ],
          });
          insertHtml(modal);

          // handle delete
          document
            .querySelector(
              "[data-admin-collections='delete-collection-confirm']"
            )
            .addEventListener("click", () => {
              postJson("/app/collections", {
                method: "deleteCollection",
                collection: id,
              }).then((response) => {
                modal.remove();
                if (response.rawResponse.status !== 200) {
                  addNotification({
                    text: "Error deleting collection",
                    image: "warning",
                  });
                } else {
                  addNotification({
                    text: "Collection deleted",
                    image: "tick",
                  });
                }
                CollectionAdmin.refreshCollections(this.isAdmin);
              });
            });

          // handle modal close
          document
            .querySelector("[data-close='#delete-collection-modal']")
            .addEventListener("click", () => {
              modal.remove();
            });
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
              modal.remove();
            }
          });
        });
      });
  }

  createModal() {
    return createHtml({
      tag: "div",
      id: "new-collection-modal",
      class: "modal",
      children: [
        {
          tag: "div",
          class: "modal-window modal-window-collection",
          style: "padding: var(--padding);",
          children: [
            {
              tag: "div",
              class: "modal-header",
              children: [
                { tag: "div", class: "modal-title", text: "New Collection" },
                {
                  tag: "img",
                  class: "icon",
                  src: "https://cdn.architextures.org/icons/x.svg",
                  "data-close": "#new-collection-modal",
                },
              ],
            },
            {
              tag: "div",
              class: "modal-body modal-body-collection",
              children: [
                {
                  tag: "div",
                  class: "modal-content modal-img-collection",
                  children: [
                    {
                      tag: "div",
                      style:
                        "background-color: #e1e1e1; width: 100%; height: 100%",
                    },
                  ],
                },
              ],
            },
            {
              tag: "div",
              class: "modal-footer modal-footer-collection",
              children: [
                {
                  tag: "input",
                  type: "text",
                  "data-user-collection": "new-name",
                  placeholder: "collection name",
                },
                {
                  tag: "button",
                  "data-user-collection": "new-collection-name",
                  text: "Save",
                },
              ],
            },
          ],
        },
      ],
    });
  }

  generateCollectionImage(index) {
    postJson("/app/collections", {
      collection: this.collections[index].id,
      method: "getCollectionItemsPositions",
    }).then((imgUrls) => {
      const widths = ["100%", "90%", "80%", "70%", "60%"];
      const imgUrlsArray = Array.isArray(imgUrls)
        ? imgUrls.map((img) => img.imgurl).filter((img) => img !== null)
        : Array(5).fill(null);
      const imgColors = Array.isArray(imgUrls)
        ? imgUrls.map((img) => img.color).filter((img) => img !== null)
        : Array(5).fill(null);
      const imageContainer = createHtml({
        tag: "div",
        "data-admin-collections": "image-container",
      });

      for (let i = 0; i < 5; i++) {
        // ensure we always create 5 elements
        let img = imgUrlsArray[4 - i]; // get the image URL in reverse order, or undefined
        img = img && img + "?s=400&q=60"; // add query string to reduce image size
        const imgColor = imgColors[4 - i]; // get the image color in reverse order, or undefined
        const width = widths[i] || "100%";
        const background = img
          ? imgColor
            ? "background-color: " +
              imgColor +
              "; background-image: url( " +
              artx.cdn +
              img +
              ")"
            : "background-image: url(" + artx.cdn + img + ")"
          : "background-color: " + this["colour" + (i + 1)];

        const style =
          background +
          "; width: " +
          width +
          "; height: 100%; position: absolute; float: left; border-radius: var(--radius); box-shadow: var(--shadow); background-size: 200px;";
        document
          .querySelector('[data-admin-collections="item-' + index + '"]')
          .appendChild(imageContainer);
        document
          .querySelector(
            '[data-admin-collections="item-' +
              index +
              "\"] [data-admin-collections='image-container']"
          )
          .appendChild(
            createHtml({
              tag: "div",
              style,
            })
          );
      }
    });
  }

  static refreshCollections(isAdmin) {
    CollectionAdmin.showSpinner();
    CollectionAdmin.removeCollection();
    CollectionAdmin.removeMenus();
    postJson("/app/collections", { method: "getUserCollections" }).then(
      function (response) {
        const collectionAdmin = new CollectionAdmin(
          response.results,
          artx.user.id,
          isAdmin
        );
        collectionAdmin.addTotalTextures();
        collectionAdmin.addUserCollections();
        collectionAdmin.addEventListeners();
        collectionAdmin.collections.forEach((col, index) => {
          collectionAdmin.generateCollectionImage(index);
        });
        CollectionAdmin.hideSpinner();
      }
    );
  }

  static removeCollection() {
    if (
      document.querySelectorAll("[data-admin-collections^='show-collection']")
        .length > 0
    ) {
      document
        .querySelectorAll("[data-admin-collections^='show-collection']")
        .forEach((collection) => collection.remove());
    }
  }

  static removeMenus() {
    document
      .querySelectorAll("[data-admin-collections-kebab-menu]")
      .forEach((menu) => menu.parentNode.parentNode.remove());
  }

  static showSpinner() {
    if (!document.querySelector("[data-admin-collections='spinner']")) {
      if (document.querySelector(".admin-area")) {
        document
          .querySelector(".admin-collection")
          .parentNode.appendChild(CollectionAdmin.adminSpinner);
      } else {
        document
          .querySelector(".admin-collection")
          .parentNode.prepend(CollectionAdmin.userSpinner);
      }
      document.body.style.pointerEvents = "none";
    }
  }

  static hideSpinner() {
    if (document.querySelector("[data-admin-collections='spinner']")) {
      document.querySelector("[data-admin-collections='spinner']").remove();
    }
    if (document.querySelector("[data-user-collections='spinner']")) {
      document.querySelector("[data-user-collections='spinner']").remove();
    }
    document.body.style.pointerEvents = "auto";
  }
}
