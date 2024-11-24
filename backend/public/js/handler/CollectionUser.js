class CollectionUser
{
    constructor({
        textureId = null,
        saveId = null,
        anchor = null,
        imgurl = null,
        persistMenu = false,
        userId = null,
        saveButton = null
    })
    {
        this.userId = userId;
        this.textureId = textureId;
        this.saveId = saveId;
        this.anchor = anchor;
        this.imgurl = imgurl;
        this.menu = null;
        this.persistMenu = persistMenu;
        this.saveButton = saveButton;
        this.positions = {};
        this.positions.x = this.anchor.getBoundingClientRect().left;
        this.positions.y = this.anchor.getBoundingClientRect().top;
    }

    checkIfInSaves(id = this.textureId)
    {
        if(!this.userId || !id) return false;

        // check if texture is in saves
        return postJson("/api/query", {
            table: "saves",
            columns: ["id"],
            where: [
                ["texture", "=", id],
                ["user", "=", this.userId],
                ["updated_at", "IS NULL"]
            ],
            auth: true
        }).then(response => {
            // get save id
            if(response.results && response.results.length > 0) {
                this.saveId = response.results[0].id;
                return true;
            }
            return false;
        })
    }

    showCollections()
    {
        // get user collections
        return postJson("/api/collections", {method: "getUserCollections"}).then(response => {
            const collections = response.results;
            const saveOptions = [];
            let inCollection;

            // get save id
            const promise = this.saveId ?
                postJson("/api/query", {
                    table: "collection_saves",
                    columns: ["collection"],
                    where: [
                        ["save", "=", this.saveId]
                    ],
                    auth: true
                }) :
                postJson("/api/collections", {method: "textureInCollections", texture: this.textureId}).then(response => {
                    if(!response.error) inCollection = response.map(collection => collection.collection);
                });

            return promise.then(response => {
                // check if save is in collection
                if(response && response.results && response.results.length > 0) {
                    inCollection = response.results.map(collection => collection.collection);
                }

                // organise collections array
                collections.forEach(collection => {
                    saveOptions.push({
                        name: collection.name,
                        "data-user-collection": collection.id
                    });
                    if(inCollection && inCollection.includes(collection.id)) {
                        saveOptions[saveOptions.length - 1].checked = true;
                    }
                });
                saveOptions.push({name: "Add Collection", "data-user-collection": "new"});

                // show menu
                const menu = this.generateMenu(saveOptions);
                insertHtml(menu);
                menu.dataset.userCollection = "main-menu";
                this.menu = menu;
                // add event listeners
                this.attachEventListeners();
                return true;
            });
        });
    }

    generateMenu(saveOptions)
    {
        const top = this.positions.y ? this.positions.y : this.anchor.getBoundingClientRect().top;
        const left = this.positions.x ? this.positions.x : this.anchor.getBoundingClientRect().left;

        return createContextMenu({
            header: {tag: "div", text: "Save to Collections"},
            items: saveOptions,
            itemHtml: function (saveOption) {
                // set different type of entries
                let checkbox;
                switch(saveOption["data-user-collection"]) {
                    case "saved":
                        checkbox = createHtml({
                            tag: "input",
                            "type": "checkbox",
                            "checked": true
                        });
                        break;
                    case "new":
                        checkbox = createHtml({
                            tag: "img",
                            width: "20",
                            src: "https://cdn.architextures.org/icons/plus.svg"
                        });
                        break;
                    default:
                        checkbox = createHtml({
                            tag: "input",
                            type: "checkbox"
                        });

                        if(saveOption.checked) checkbox.checked = true;

                }

                // actual return html
                return createHtml({tag: "div", class: "s-gap", style: "justify-content: space-between;",  children: [
                    {tag: "label", class: "nav-menu-item sh", style: "width: 70%;", children: [
                        {tag: "div", "data-user-collection": saveOption['data-user-collection'], style: "max-width: 100%", class: "cv", children: [
                                checkbox,
                                {tag: "div", style: "margin-left: 6px; overflow: hidden; text-overflow: ellipsis;", text: saveOption.name}
                            ]
                        },
                    ]},
                    saveOption["data-user-collection"] === "new" ? "" :
                    {tag: "div", "data-user-collection": "admin-collection-" + saveOption["data-user-collection"], style: "width: unset;", class: "nav-menu-item sh", children: [
                        {tag: "img", style: "cursor: pointer;", width: "20", src: "https://cdn.architextures.org/icons/arrow-right.svg"}
                    ]}
                ]});
            },
            x: Math.floor(left),
            y: Math.floor(top),
            width: 300,
            maxHeight: 450,
            isHiddenOnClose: false,
            persistMenu: this.persistMenu
        });
    }

    attachEventListeners()
    {
        this.handleResize();
        this.goToAdminCollection();
        this.handleCheckboxes();
        this.handleNewCollections();
    }

    handleResize()
    {
        window.addEventListener("resize", () => {
            this.menu.style.top = "var(--app-panel-top)";
            if(window.innerWidth < 600) {
                this.menu.style.left = "var(--app-panel-left)";
                return;
            }
            this.menu.style.left = "calc(var(--app-panel-left) + var(--app-panel-width) + 50px)";
        });
    }

    goToAdminCollection()
    {
        this.menu.querySelectorAll("[data-user-collection^='admin-collection']").forEach(arrow => {
            arrow.addEventListener("click", () => {
                if(arrow.getAttribute("data-user-collection") === "saved") {
                    window.open("/admin/saved", "_blank");
                } else {
                    const collectionId = arrow.getAttribute("data-user-collection").split("-")[2];
                    const url = collectionId === "saved" ? "/admin/saved" : "/admin/collections/" + collectionId;
                    window.open(url, "_blank");
                }
            });
        });
    }

    handleCheckboxes()
    {
        this.menu.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                // show spinner notification
                const notification = addNotification({
                    text: "Saving...",
                    image: "spinner"
                });

                // special case for saves checkbox
                if(checkbox.parentElement.getAttribute("data-user-collection") === "saved") {
                    if(!checkbox.checked) {
                        let saveIdPromise;
                        if(this.saveId) {
                            saveIdPromise = Promise.resolve(this.saveId);
                        } else {
                            saveIdPromise = this.getSaveId();
                        }
                        // delete from saves and all collections
                        saveIdPromise.then(saveId => {
                            postJson("/api/query", {
                                table: "saves",
                                action: "delete",
                                where: [
                                    ["id", "=", saveId],
                                ],
                                auth: true
                            }).then(response => {
                                // reset this.saveId
                                this.saveId = null;

                                // uncheck all checkboxes
                                this.menu.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
                                    checkbox.checked = false;
                                });

                                // remove menu
                                this.menu.remove();

                                if (this.saveButton) {
                                    // update save button
                                    this.saveButton.innerText = "Save";
                                    this.saveButton.classList.remove("save-full");
                                    this.saveButton.classList.add("save");
                                }

                                // if at /create update button data
                                const addButton = document.querySelector(".add-button");
                                if(addButton) {
                                    addButton.dataset.saveId = "";
                                    addButton.dataset.isSaved = "false";
                                }

                                // show notification
                                if (!response.status || response.status !== "success") {
                                    notification.updateNotification({
                                        text: "Error removing from saved",
                                        image: "warning"
                                    });
                                } else {
                                    notification.updateNotification({
                                        text: "Texture removed",
                                        image: "tick",
                                        duration: 2000
                                    });
                                }
                            });
                        });
                    } else if(checkbox.checked) {
                        // add to saves
                        postJson("/api/query", {
                            table: "saves",
                            action: "insert",
                            values: {
                                user: this.userId,
                                texture: this.textureId,
                            },
                            auth: true
                        }).then(response => {
                            this.saveId = response.id;

                            // show notification
                            if(!response.status || response.status !== "success") {
                                notification.updateNotification({
                                    text: "Error saving texture",
                                    image: "warning"
                                });
                            } else {
                                notification.updateNotification({
                                    text: "Texture saved",
                                    image: "tick"
                                });
                                if(this.saveButton) {
                                    // update save button
                                    this.saveButton.innerText = "Save";
                                    this.saveButton.classList.remove("save-full");
                                    this.saveButton.classList.add("save");
                                }
                            }
                        });
                    }
                } else if(!checkbox.checked) {
                    // get all IDs
                    const collectionId = checkbox.parentElement.getAttribute("data-user-collection");
                    const saveIdPromise = this.getSaveId();

                    // remove from the collection
                    saveIdPromise.then(saveId => {
                        postJson("/api/query", {
                            table: "collection_saves",
                            action: "delete",
                            where: [
                                ["collection", "=", collectionId],
                                ["save", "=", saveId]
                            ],
                            auth: true
                        }).then(response => {
                            // show notification
                            if(!response.status || response.status !== "success") {
                                notification.updateNotification({
                                    text: "Error removing from collection",
                                    image: "warning"
                                });
                            } else {
                                notification.updateNotification({
                                    text: "Removed from " + checkbox.parentElement.textContent,
                                    image: "tick"
                                });
                            }
                        });
                    });
                } else if(checkbox.checked) {
                    // get all IDs
                    const collectionId = checkbox.parentElement.getAttribute("data-user-collection");
                    const saveIdPromise = this.getSaveId();

                    // add to collection
                    saveIdPromise.then(saveId => {
                        // check if texture is already in the collection
                        postJson("/api/collections", {method: "isTextureInCollection", collection: collectionId, saveId: saveId}).then(response => {
                            if(response.isInCollection){
                                // show error message
                                notification.updateNotification({
                                    text: "Texture already in collection",
                                    image: "warning"
                                });
                                return;
                            }
                            // save in collection
                            postJson("/api/query", {
                                table: "collection_saves",
                                action: "insert",
                                values: {
                                    collection: collectionId,
                                    save: saveId,
                                    user: this.userId
                                },
                                auth: true
                            }).then(response => {
                                // show notification
                                if(!response.status || response.status !== "success") {
                                    notification.updateNotification({
                                        text: "Error saving texture",
                                        image: "warning"
                                    });
                                } else {
                                    notification.updateNotification({
                                        text: "Saved to " + checkbox.parentElement.textContent,
                                        image: "tick"
                                    });
                                }
                            });
                        });
                    });
                }
            });
        });
    }

    handleNewCollections()
    {
        document.querySelector("[data-user-collection='new']").parentNode.addEventListener("click", () => {
            // show modal
            const modal = this.createModal();
            insertHtml(modal)
            if(!this.persistMenu) this.menu.remove();

            // handle save click
            document.querySelector("[data-user-collection='new-collection-name']").addEventListener("click", () => {
                // ensure name is at least 2 characters long
                if(document.querySelector("[data-user-collection='new-name']").value.length < 2) {
                    addNotification({
                        text: "Name must be at least 2 characters",
                        image: "warning",
                        duration: 3000
                    });
                    return;
                }

                // add spinner notification
                const notification = addNotification({
                    text: "Creating new collection...",
                    image: "spinner"
                });

                // create collection
                postJson("/api/collections", {method: "createCollection", name: document.querySelector("[data-user-collection='new-name']").value}).then(response => {
                    modal.remove();
                    if(this.persistMenu) {
                        this.resetMenu();
                    }

                    if(response.error) {
                        // show error notification
                        notification.updateNotification({
                            text: "Error creating collection",
                            image: "warning"
                        });
                        return;
                    }

                    // show success notification
                    notification.updateNotification({
                        text: "Collection created",
                        image: "tick",
                        duration: 2000
                    });
                });
            });
            // handle clicking the data-close image
            document.querySelector("[data-close='#new-collection-modal']").addEventListener("click", () => {
                modal.remove();
            });
            // handle escape key press
            document.addEventListener("keydown", e => {
                if(e.key === "Escape") {
                    // e.preventDefault();
                    modal.remove();
                }
            })
        });
    }

    createModal()
    {
        return createHtml(
            {tag: "div", id: "new-collection-modal", class: "modal", children:[
                {tag: "div", class: "modal-window modal-window-collection", style: "padding: var(--padding);", children: [
                    {tag: "div", class: "modal-header", children: [
                        {tag: "div", class: "modal-title", text: "New Collection"},
                        {tag: "img", class: "icon", src: "https://cdn.architextures.org/icons/x.svg", "data-close": "#new-collection-modal"}
                    ]},
                    {tag: "div", class: "modal-body modal-body-collection", children: [
                        {tag: "div", class: "modal-content modal-img-collection", children: [
                            {tag: "img", src: this.imgurl, alt: "collection image"},
                        ]}
                    ]},
                    {tag: "div", class: "modal-footer modal-footer-collection", children: [
                        {tag: "input", type: "text", "data-user-collection": "new-name", placeholder: "collection name"},
                        {tag: "button", "data-user-collection":"new-collection-name", text: "Save"}
                    ]}
                ]}
            ]}
        );
    }

    getSaveId()
    {
        return this.saveId ?
            Promise.resolve(this.saveId) :
            postJson("/api/query", {
                table: "saves",
                columns: ["id"],
                where: [
                    ["texture", "=", this.textureId],
                    ["user", "=", this.userId],
                    ["updated_at", "IS NULL"]
                ],
                auth: true
            }).then(response => response.results[0].id);
    }

    resetMenu()
    {
        this.positions.x = parseInt(this.menu.style.left);
        this.positions.y = parseInt(this.menu.style.top);
        this.menu.remove();
        this.showCollections();
    }
}
