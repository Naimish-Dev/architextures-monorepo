class SingleCollectionAdmin {
  constructor(collectionId, collectionName, userId, isAdmin, isPlugin) {
    this.collectionId = collectionId;
    this.collectionName = collectionName;
    this.userId = userId;
    this.saveId = null;
    this.isAdmin = isAdmin;
    this.isPlugin = isPlugin;
  }

  checkOwner() {
    return postJson("/app/query", {
      table: "collections",
      columns: ["user"],
      where: [["id", "=", this.collectionId]],
      auth: true,
      owned: true,
    }).then((response) => {
      if (response.results.length > 0) {
        return response.results[0].user;
      }
      return false;
    });
  }

  loadInitialPage() {
    this.createContainer();
    this.showCollection();
  }

  init() {
    // confirm the user is the owner
    this.checkOwner().then((ownerId) => {
      if (ownerId !== artx.user.id) return;

      postJson("/app/collections", {
        method: "getCollectionItems",
        collection: this.collectionId,
      }).then((response) => {
        this.collectionItems = response.results;
        this.createItemContainer();
        this.showTotalTextures();
        this.attachEventListeners();
        this.addSortable();
      });
      CollectionAdmin.hideSpinner();
    });
  }

  createContainer() {
    this.container = createHtml({
      tag: "div",
      class: "admin-area admin-page",
      style: "position: absolute; z-index: 2;",
      "data-admin-page": "show-collection-" + this.collectionId,
      children: [
        {
          tag: "div",
          class: "admin-header admin-header-single",
          style: "border-bottom: unset;",
          children: [
            {
              tag: "div",
              "data-admin-single-collection": "header-div",
              children: [
                {
                  tag: "div",
                  children: [
                    {
                      tag: "h1",
                      "data-admin-single-collection":
                        "collection-header-name-" + this.collectionId,
                      text: this.collectionName,
                    },
                  ],
                },
              ],
            },
            {
              tag: "div",
              style: "display: flex;",
              children: [
                {
                  tag: "div",
                  class: "admin-single-x",
                  children: [
                    {
                      tag: "img",
                      src: "https://cdn.architextures.org/icons/x.svg",
                      class: "icon",
                      alt: "close",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          tag: "div",
          class: "admin-item-header",
          "data-admin-single-collection": "total-textures",
          style: "width: unset; height: 16px;",
        },
        {
          tag: "div",
          class: "asset-container",
          children: [
            {
              tag: "div",
              class: "asset-grid row",
              "data-admin-page": "collection-items",
              style:
                "padding: var(--admin-section-padding); gap: var(--admin-section-padding);",
            },
          ],
        },
      ],
    });
  }

  createItemContainer() {
    this.collectionItems.forEach((item) => {
      const itemElement = createHtml({
        tag: "div",
        "data-id": item.id,
        style: "position: relative;",
        children: [
          {
            tag: this.isPlugin ? "div" : "a",
            "data-admin-single-collection": "item-" + item.id,
            class: "asset pr",
            target: this.isAdmin ? "_blank" : "_self",
            href: "/create?save=" + item.id,
            style:
              "display: inline-block; width: 100%; height: 100%; background-color: " +
              item.color +
              "; background-image: url(" +
              artx.cdn +
              item.imgurl +
              "?s=400&q=60);",
            children: [
              {
                tag: "div",
                class: "asset-label cv sh",
                children: [
                  {
                    tag: "div",
                    style: "max-width: 90%;",
                    children: [
                      { tag: "div", class: "sline", text: item.name },
                      { tag: "div", class: "inlab", text: item.category },
                    ],
                  },
                  {
                    tag: "div",
                    class: "cc s-gap",
                    "data-texture-menu": "save-" + item.id,
                    children: [
                      {
                        tag: "div",
                        class: "cc",
                        style: "padding:5px;background:white;",
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
          },
        ],
      });
      this.container
        .querySelector("[data-admin-page='collection-items']")
        .appendChild(itemElement);
    });
  }

  showTotalTextures() {
    if (
      document.querySelector("[data-admin-single-collection='total-textures']")
        .firstChild
    ) {
      document
        .querySelector("[data-admin-single-collection='total-textures']")
        .firstChild.remove();
    }
    document
      .querySelector("[data-admin-single-collection='total-textures']")
      .appendChild(
        createHtml({
          tag: "div",
          class: "admin-item-value input-label thumb",
          text:
            this.collectionItems.length +
            " texture" +
            (this.collectionItems.length === 1 ? "" : "s"),
        })
      );
  }

  showCollection() {
    if (this.isAdmin) {
      document.querySelector(".admin-area").appendChild(this.container);
    } else {
      document.querySelector(".user-area .admin-collection").style.display =
        "none";

      // custom styling for plugin page
      this.container.style.position = "relative";
      this.container.style.height = "100%";

      document.querySelector(".user-area").appendChild(this.container);
    }
  }

  attachEventListeners() {
    // close collection view
    document
      .querySelector(
        "[data-admin-page='show-collection-" +
          this.collectionId +
          "'] .admin-single-x"
      )
      .addEventListener("click", () => {
        this.sortable.option("disabled", true);
        if (!this.isAdmin) {
          document.querySelector(".user-area .admin-collection").style.display =
            "block";
        }
        this.container.remove();
      });
    // show collection item menu
    document.querySelectorAll("[data-texture-menu^='save']").forEach((menu) => {
      menu.addEventListener("click", (e) => {
        e.preventDefault();
        this.saveId = menu.getAttribute("data-texture-menu").split("-")[1];
        this.generateMenu();
      });
    });

    if (this.isPlugin) {
      // open texture in iframe
      const items = document.querySelectorAll(
        "[data-admin-single-collection^='item']"
      );
      const parentItems = Array.from(items).map((item) => item.parentNode);
      parentItems.forEach((item) => {
        item.parentNode.addEventListener("click", (e) => {
          if (item.contains(e.target) && e.target.tagName !== "IMG") {
            const objectItem = this.collectionItems.find(
              (i) => i.id == item.dataset.id
            );
            objectItem.params =
              typeof objectItem.params === "string"
                ? JSON.parse(objectItem.params)
                : objectItem.params;
            objectItem.sourceTable = "saves";
            artx.launchEditor({ type: "new", data: objectItem });
          }
        });
      });
    }
  }

  addSortable() {
    // initialise sortable
    this.sortable = Sortable.create(
      document.querySelector("[data-admin-page='collection-items']"),
      {
        animation: 150,
        ghostClass: "sortable-chosen-ghost",
        onUpdate: () => {
          this.rearrangeResetButton.style.display = "block";
          this.rearrangeCancelButton.style.display = "none";
        },
      }
    );
    // disable by default
    this.sortable.option("disabled", true);
  }

  generateMenu() {
    const items = [];
    items.push({ name: "Rename", "data-admin-single-collection": "rename" });
    items.push({
      name: "Rearrange textures",
      "data-admin-single-collection": "rearrange",
    });
    items.push({
      name: "Remove from collection",
      "data-admin-single-collection": "remove",
    });
    items.push({
      name: "Add to collections",
      "data-admin-single-collection": "add-to-collection",
    });
    // create menu and add event listeners
    this.createMenu(items);
    this.addMenuEventListeners();
  }

  createMenu(items) {
    const anchor = document.querySelector(
      "[data-texture-menu='save-" + this.saveId + "']"
    );
    const menu = createContextMenu({
      items: items,
      itemHtml: function (item) {
        return createHtml({
          tag: "label",
          class: "nav-menu-item sh",
          children: [
            {
              tag: "div",
              "data-admin-single-collection":
                "menu-id-" + item["data-admin-single-collection"],
              class: "cv",
              children: [
                { tag: "div", style: "margin-left: 5px;", text: item.name },
              ],
            },
          ],
        });
      },
      x: anchor.getBoundingClientRect().x - 270,
      y: anchor.getBoundingClientRect().y,
      width: 300,
      maxHeight: 450,
      isHiddenOnClose: false,
    });
    insertHtml(menu);
  }

  addMenuEventListeners() {
    // handle renaming
    document
      .querySelector("[data-admin-single-collection='menu-id-rename']")
      .parentNode.addEventListener("click", () => {
        // hide menu
        document
          .querySelector("[data-admin-single-collection='menu-id-rename']")
          .parentNode.parentNode.parentNode.remove();
        this.renameTexture();
      });

    // handle rearranging
    document
      .querySelector("[data-admin-single-collection='menu-id-rearrange']")
      .parentNode.addEventListener("click", () => {
        // hide menu
        document
          .querySelector("[data-admin-single-collection='menu-id-rearrange']")
          .parentNode.parentNode.parentNode.remove();
        this.handleRearrangeTexture();
      });

    // handle remove
    document
      .querySelector("[data-admin-single-collection='menu-id-remove']")
      .parentNode.addEventListener("click", () => {
        // hide menu
        document
          .querySelector("[data-admin-single-collection='menu-id-remove']")
          .parentNode.parentNode.parentNode.remove();
        this.confirmRemoveModal();
      });

    // handle add to collection
    document
      .querySelector(
        "[data-admin-single-collection='menu-id-add-to-collection']"
      )
      .parentNode.addEventListener("click", () => {
        // hide menu
        document
          .querySelector(
            "[data-admin-single-collection='menu-id-add-to-collection']"
          )
          .parentNode.parentNode.parentNode.remove();
        this.generateCollectionsMenu();
      });
  }

  generateCollectionsMenu(e) {
    const anchor = document.querySelector(
      "[data-texture-menu='save-" + this.saveId + "']"
    );
    const loadingMenu = createContextMenu({
      items: [{}],
      itemHtml: function () {
        return createHtml({
          tag: "div",
          class: "cc fw fh",
          children: [{ tag: "div", style: "width:40px", class: "spinner" }],
        });
      },
      x: anchor.getBoundingClientRect().x - 270,
      y: anchor.getBoundingClientRect().y,
      width: 300,
      height: 450,
      isHiddenOnClose: false,
    });
    insertHtml(loadingMenu);

    // get all collections
    return postJson("/app/collections", { method: "getUserCollections" }).then(
      (response) => {
        const collections = response.results;
        const items = [];
        postJson("/app/collections", {
          method: "checkSavedIsInCollection",
          saveId: this.saveId,
        }).then((response) => {
          collections.forEach((collection) => {
            // loose comparison on purpose, type is irrelevant
            if (collection.id == this.collectionId) return;

            items.push({
              name: collection.name,
              "data-admin-single-collection": collection.id,
            });

            if (response.some((i) => i.collection === collection.id)) {
              items[items.length - 1].checked = true;
            }
          });

          // create menu and add event listeners
          this.createCollectionsMenu(items, loadingMenu);
          this.handleCollectionsCheckboxes();
        });
      }
    );
  }

  createCollectionsMenu(items, loadingMenu) {
    const anchor = document.querySelector(
      "[data-texture-menu='save-" + this.saveId + "']"
    );
    const menu = createContextMenu({
      items: items,
      itemHtml: function (item) {
        const checkbox = createHtml({
          tag: "input",
          type: "checkbox",
        });
        if (item.checked) checkbox.checked = true;

        return createHtml({
          tag: "label",
          class: "nav-menu-item sh",
          style: "cursor: unset;",
          children: [
            {
              tag: "div",
              "data-admin-single-collection":
                "collection-id-" + item["data-admin-single-collection"],
              class: "cv",
              children: [
                checkbox,
                { tag: "div", style: "margin-left: 5px;", text: item.name },
              ],
            },
          ],
        });
      },
      x: anchor.getBoundingClientRect().x - 270,
      y: anchor.getBoundingClientRect().y,
      width: 300,
      height: 450,
      isHiddenOnClose: false,
    });
    // Replace the loading menu with the actual menu
    loadingMenu.remove();
    insertHtml(menu);
  }

  handleCollectionsCheckboxes() {
    document
      .querySelectorAll("[data-admin-single-collection^='collection-id']")
      .forEach((item) => {
        item.addEventListener("change", () => {
          const collection = item
            .getAttribute("data-admin-single-collection")
            .split("-")[2];

          // handle adding/removing from collection
          if (item.querySelector("input").checked) {
            // save to collection
            postJson("/app/query", {
              table: "collection_saves",
              action: "insert",
              auth: true,
              values: {
                collection: collection,
                save: this.saveId,
                user: artx.user.id,
              },
            }).then((response) => {
              // show notification
              if (response.status !== "success") {
                addNotification({
                  text: "Error saving to collection",
                  image: "warning",
                });
              } else {
                addNotification({
                  text: "Saved to " + item.querySelector("div").textContent,
                  image: "tick",
                });
              }
            });
          } else {
            // remove from collection
            postJson("/app/query", {
              table: "collection_saves",
              action: "delete",
              auth: true,
              where: [
                ["save", "=", this.saveId],
                ["collection", "=", collection],
              ],
            }).then((response) => {
              // show notification
              if (response.status !== "success") {
                addNotification({
                  text: "Error removing from collection",
                  image: "warning",
                });
              } else {
                addNotification({
                  text: "Removed from " + item.querySelector("div").textContent,
                  image: "tick",
                });
              }
            });
          }

          // refresh collections page in the background
          const collections = new LoadCollections({
            shouldClosePages: false,
            isAdmin: this.isAdmin,
          });
          collections.showAllCollections();
        });
      });
  }

  confirmRemoveModal() {
    // create confirm modal
    const modal = createModal(
      "Remove texture",
      {
        tag: "div",
        class: "m-pad",
        text: "Are you sure you want to remove this texture from the collection?",
      },
      {
        tag: "div",
        class: "s-gap fw",
        children: [
          {
            tag: "button",
            class: "fw",
            text: "Remove",
            "data-collection-menu": "remove",
          },
          {
            tag: "button",
            class: "fw",
            text: "Cancel",
            "data-collection-menu": "cancel",
          },
        ],
      }
    );

    // handle cancel
    modal
      .querySelector("[data-collection-menu='cancel']")
      .addEventListener("click", () => {
        modal.remove();
      });

    // handle remove
    modal
      .querySelector("[data-collection-menu='remove']")
      .addEventListener("click", () => {
        this.removeTexture(modal);
      });
    // show modal
    insertHtml(modal);
  }

  removeTexture(modal) {
    postJson("/app/query", {
      table: "collection_saves",
      action: "delete",
      auth: true,
      where: [
        ["save", "=", this.saveId],
        ["collection", "=", this.collectionId],
      ],
    }).then((response) => {
      // show notification
      if (response.status !== "success") {
        addNotification({
          text: "Error removing texture",
          image: "warning",
        });
      } else {
        addNotification({
          text: "Texture removed",
          image: "tick",
        });
        // remove texture from view
        document.querySelector("[data-id='" + this.saveId + "']").remove();

        // remove texture from collectionItems
        this.collectionItems = this.collectionItems.filter(
          (item) => item.id != this.saveId
        );

        // recalculate total textures
        this.showTotalTextures();

        // refresh collections page in the background
        const collections = new LoadCollections({
          shouldClosePages: false,
          isAdmin: this.isAdmin,
        });
        collections.showAllCollections();
      }

      modal.remove();
    });
  }

  handleRearrangeTexture() {
    // get original order
    this.originalOrder = this.collectionItems.map((item) => item.id);
    // enable sortable
    this.sortable.option("disabled", false);
    // show save button
    this.rearrangeSaveButton = createHtml({
      tag: "button",
      "data-admin-single-collection": "save-rearrange",
      style: "margin-left: 15px;",
      text: "Save",
      class: "fbutt",
    });
    this.rearrangeResetButton = createHtml({
      tag: "button",
      "data-admin-single-collection": "reset-rearrange",
      style: "margin-left: 15px;",
      text: "Reset",
      class: "fbutt",
    });
    this.rearrangeCancelButton = createHtml({
      tag: "button",
      "data-admin-single-collection": "cancel-rearrange",
      style: "margin-left: 15px;",
      text: "Cancel",
      class: "fbutt",
    });
    this.rearrangeResetButton.style.display = "none";

    document
      .querySelector("[data-admin-single-collection='header-div']")
      .appendChild(this.rearrangeSaveButton);
    document
      .querySelector("[data-admin-single-collection='header-div']")
      .appendChild(this.rearrangeResetButton);
    document
      .querySelector("[data-admin-single-collection='header-div']")
      .appendChild(this.rearrangeCancelButton);

    // show move icons
    this.showMoveIcons();

    // handle save
    this.handleSaveNewOrder();

    // handle cancel
    this.handleCancelOrder();

    // handle reset
    this.handleResetOrder();
  }

  showMoveIcons() {
    document
      .querySelectorAll("[data-admin-single-collection^='item']")
      .forEach((textureCard) => {
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

        textureCard.style.pointerEvents = "none";
        textureCard.style.opacity = "0.5";
        textureCard.style.boxShadow = "none";
        textureCard.parentNode.append(moveIcon);
      });
  }

  handleSaveNewOrder() {
    this.rearrangeSaveButton.addEventListener("click", () => {
      this.resetAfterOrdering();
      // send updated order
      postJson("/app/collections", {
        method: "updateCollectionItemsPositions",
        collection: this.collectionId,
        itemsPosition: this.sortable.toArray(),
      }).then((response) => {
        if (response.rawResponse.status !== 200) {
          addNotification({
            text: "Error saving new order",
            image: "warning",
          });
        } else {
          addNotification({
            text: "New order saved",
            image: "tick",
          });
        }
        this.rearrangeSaveButton.remove();
        this.rearrangeResetButton.remove();
        this.rearrangeCancelButton.remove();

        // refresh collections page in the background
        const collections = new LoadCollections({
          shouldClosePages: false,
          isAdmin: document.querySelector(".user-area") === null,
        });
        collections.showAllCollections();
      });
    });
  }

  handleCancelOrder() {
    this.rearrangeCancelButton.addEventListener("click", () => {
      this.resetAfterOrdering();
      // cancel order
      this.sortable.sort(this.sortable.toArray());
      this.rearrangeSaveButton.remove();
      this.rearrangeResetButton.remove();
      this.rearrangeCancelButton.remove();
    });
  }

  handleResetOrder() {
    this.rearrangeResetButton.addEventListener("click", () => {
      this.rearrangeResetButton.style.display = "none";
      this.rearrangeCancelButton.style.display = "block";

      // use this.originalOrder to reset the order
      const parent = document.querySelector(
        "[data-admin-page='collection-items']"
      );
      this.originalOrder.forEach((id) => {
        parent.append(document.querySelector("[data-id='" + id + "']"));
      });
    });
  }

  resetAfterOrdering() {
    // disable sortable
    this.sortable.option("disabled", true);
    // remove icons
    document.querySelectorAll(".move-icon-collections").forEach((icon) => {
      icon.remove();
    });
    document
      .querySelectorAll("[data-admin-single-collection^='item']")
      .forEach((textureCard) => {
        textureCard.style.pointerEvents = "auto";
        textureCard.style.opacity = "1";
        textureCard.style.boxShadow = "";
      });
  }

  renameTexture() {
    // modal
    const modal = createHtml({
      tag: "div",
      id: "rename-texture-modal",
      class: "modal",
      children: [
        {
          tag: "div",
          class: "modal-window",
          style: "width:400px",
          children: [
            {
              tag: "div",
              class: "modal-header",
              children: [
                { tag: "div", class: "modal-title", text: "Rename Texture" },
                {
                  tag: "img",
                  class: "icon",
                  src: "https://cdn.architextures.org/icons/x.svg",
                  "data-close": "#rename-texture-modal",
                },
              ],
            },
            {
              tag: "div",
              class: "modal-footer fc",
              children: [
                {
                  tag: "input",
                  type: "text",
                  "data-admin-single-collection": "new-name",
                  value: document.querySelector(
                    "[data-id='" + this.saveId + "'] .sline"
                  ).textContent,
                },
                {
                  tag: "button",
                  class: "fw",
                  "data-admin-single-collection": "update-texture-name",
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
      .querySelector("[data-admin-single-collection='update-texture-name']")
      .addEventListener("click", () => {
        const name = document.querySelector(
          "[data-admin-single-collection='new-name']"
        ).value;
        // save new name
        document.querySelector(
          "[data-id='" + this.saveId + "'] .sline"
        ).innerText = name;
        postJson("/app/query", {
          table: "saves",
          action: "update",
          auth: true,
          values: {
            name: name,
          },
          where: [["id", "=", this.saveId]],
        }).then((response) => {
          modal.remove();
          // show notification
          if (response.status !== "success") {
            addNotification({
              text: "Error renaming texture",
              image: "warning",
            });
          } else {
            addNotification({
              text: "Texture renamed",
              image: "tick",
            });
          }
        });
      });

    // handle modal close
    document
      .querySelector("[data-close='#rename-texture-modal']")
      .addEventListener("click", () => {
        modal.remove();
      });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.remove();
      }
    });
  }
}
