// Save new listener
document.querySelector("[data-action='save_new']").addEventListener("click", () => {
    // setup data
    const textureName = document.querySelector("#material-pseudo .pseudo-select-text").innerText;
    const patternName = document.querySelector("#pattern .pseudo-select-text").innerText;
    const imageName = params.patternId == 17 ? textureName : textureName + " " + patternName;
    const category = document.querySelector("#material-menu .active").getAttribute("data-category") || null;

    resizeImage(canvas.toDataURL(), {maxSize: 800}).then(image => {
        const jsonpost = {
            "name": imageName,
            "realwidth": config.textureWidth,
            "category": category,
            "params": JSON.stringify(params),
            "image": image,
            "type": "save",
        };

        const brandedMaterial = Object.values(config.materials).find(mat => mat.category !== "Joint" && mat.brand) || null;
        if (brandedMaterial) {
            jsonpost.brand = brandedMaterial.brand;
        }

        if(!config.user) {
            // show reg form modal
            const regForm = new RegistrationForm({isModal: true, referrer: getArtxCookie('referrer'), country: config.userCountry});
            regForm.init();
            const form = regForm.getForm();

            // add image to form
            const imageSliderModal = new ImageSlides(sliderImages.slides, true);
            imageSliderModal.createSlides();
            form.querySelector("[data-form='parent-element']").prepend(imageSliderModal.getSlidesElement());
            insertHtml(form);

            form.querySelector("[data-form='register-btn']").onclick = () => {
                if(!form.querySelector("[data-form='accept-terms']").checked) {
                    regForm.showError("accept-terms");
                    return;
                }
                form.querySelector("[data-form='register-btn']").innerHTML = "<div class='spinner'></div>";
                new CollectRegistrationData({registrationForm: regForm, refreshPage: true, params: jsonpost}).startRegistration();
            }
        } else {
            const saveId = SAVE_ID || null;

            const collection = new CollectionUser({
                saveId: saveId,
                imgurl: config.color.canvas.toDataURL("image/jpeg"),
                anchor: document.querySelector("#download-menu"),
                persistMenu: true,
                userId: config.user.id,
                hasSaved: false
            });

            const notification = addNotification({
                text: "Saving texture...",
                image: "spinner"
            });

            const savePromise = new Promise((resolve, reject) => {
                postJson("/api/library", jsonpost).then(response => {
                    if (typeof parseInt(response) !== "number") {
                        notification.updateNotification({
                            text: "Could not save texture",
                            image: "warning"
                        });
                        reject();
                    } else {
                        notification.updateNotification({
                            text: "Texture saved",
                            image: "tick",
                            duration: 2000
                        });

                        SAVE_ID = parseInt(response);
                        // userHasSaved = true;
                        resolve(parseInt(response));
                    }
                });
            });

            savePromise.then(newSaveId => {
                collection.saveId = newSaveId;
                collection.showCollections().then(() => {
                    hideDownloadMenu();
                    document.querySelector("[data-label-id='update_saved']").classList.remove("hide-me");
                });
            });
        }
    });
});

// Update saved listener
document.querySelector("[data-action='save_update']").addEventListener("click", () => {
    hideDownloadMenu();

    const notification = addNotification({
        text: "Updating texture...",
        image: "spinner"
    });

    let category = document.querySelector("#material-menu .active").getAttribute("data-category") || null;

    if(!category) {
        const id = Object.keys(config.materials).find(id => config.materials[id].category !== "Joint")
        category = config.materials[id].category;
    }
    const saveId = SAVE_ID || (config.textureData.sourceTable === "saves" ? config.textureData.id : null);
    if (!saveId) {
        notification.updateNotification({
            text: "Could not update texture",
            image: "warning"
        });
        return;
    }

    resizeImage(canvas.toDataURL(), {maxSize: 800}).then(image => {
        postJson("/api/library", {
            id: saveId,
            type: "update",
            realwidth: config.textureWidth,
            category: category,
            params: JSON.stringify(params),
            image: image
        }).then(response => {
            if (response.toString().toLowerCase().includes("error")) {
                notification.updateNotification({
                    text: "Could not update texture",
                    image: "warning"
                });
                return;
            }
            notification.updateNotification({
                text: "Texture updated",
                image: "tick",
                duration: 2000
            });
        });
    });
});