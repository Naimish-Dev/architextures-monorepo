// Publish new texture
document.querySelector("[data-action='publish_new']").addEventListener("click", () => {
    const saveFileProms = [];
    const fileNameParts = [];
    const textureNameParts = [];
    const matId = params.tileStyles.a.materialId;
    const category = config.materials[matId] ? config.materials[matId].category : "Graphic";

    if (config.materials[matId]) {
        fileNameParts.push(config.materials[matId].name);
        textureNameParts.push(config.materials[matId].name);
    }

    if (params.patternId != 17 && config.patterns.hasOwnProperty(params.patternId) && !fileNameParts.includes(config.patterns[params.patternId].name)) {
        fileNameParts.push(config.patterns[params.patternId].name);
        textureNameParts.push(config.patterns[params.patternId].name);
    }

    if (config.materials[matId] && config.materials[matId].brand) {
        fileNameParts.push(config.materials[matId].brands_name);
    }
    fileNameParts.push(generateUid());
    const fileBaseName = trainify(fileNameParts.join("-"));
    const filePath = "textures/" + (currentDate.getFullYear() - 2000) + "/" + (currentDate.getMonth() + 1) + "/" + fileBaseName + ".jpg";

    let publishModal = createModal(
        "Publish texture",
        createHtml({
            tag: "div", class: "section fc m-gap", children: [
                {
                    tag: "div", class: "input-group", children: [
                        {tag: "div", class: "input-label", text: "Name"},
                        {tag: "input", type: "text", class: "input", value: textureNameParts.join(", ")}
                    ]
                },
                {
                    tag: "div", class: "input-row", children: [
                        {
                            tag: "div", class: "input-group", children: [
                                {tag: "div", class: "input-label", text: "Publish date"},
                                {
                                    tag: "input",
                                    class: "input",
                                    type: "datetime-local",
                                    value: getArtxCookie("publishDate") ? getArtxCookie("publishDate") : new Date().toISOString().slice(0, -8).replace("T", " ")
                                },
                            ]
                        },
                        {tag: "div", class: "input square-input cc", "data-now-button": "", text: "Now"}
                    ]
                },
                {
                    tag: "div", class: "input-group", children: [
                        {tag: "button", "data-publish-button": "", class: "button fw", text: "Publish"}
                    ]
                }
            ]
        })
    );

    publishModal.querySelector(".modal-window").style.width = "500px";

    hideDownloadMenu();

    // Publish date input
    const publishDateInput = publishModal.querySelector("input[type='datetime-local']");
    publishDateInput.oninput = () => {
        setArtxCookie("publishDate", publishDateInput.value);
    };

    // Set date to now button
    const nowButton = publishModal.querySelector("[data-now-button]");
    nowButton.onclick = () => {
        publishDateInput.value = new Date().toISOString().slice(0, -8).replace("T", " ");
        setArtxCookie("publishDate", null);
    };

    // Publish name input
    const publishNameInput = publishModal.querySelector("input[type='text']");

    // Publish button
    const publishButton = publishModal.querySelector("[data-publish-button]");
    publishButton.onclick = () => {

        const publishNotification = addNotification({text: "Publishing", image: "spinner"});

        saveFileProms.push(new Promise((resolve, reject) => {
            resizeImage(config.color.canvas, {maxSize: 1200, quality: 80}).then(resizedImage => {
                const file = createBlob(resizedImage);
                saveFile(filePath, file).then(() => {
                    resolve();
                });
            });
        }));

        // Draw sphere preview
        const sphereSaving = !config.user.brand ? saveSphere() : false;
        const sphUrl = sphereSaving ? sphereSaving.path : null;
        if (sphereSaving) {
            saveFileProms.push(sphereSaving.promise);
        }

        // Once the images have saved, save the texture to the database
        Promise.all(saveFileProms).then(() => {
            const values = {
                "name": publishNameInput.value,
                "category": category,
                "width_mm": parseInt(config.textureWidth),
                "height_mm": parseInt(config.textureHeight),
                "params": JSON.stringify(copy(params, {view: "texture"})),
                "imgurl": "/" + filePath,
                "color": averageColor(canvas),
                "materials": config.materialsUsed.join(","),
                "sphere": sphUrl,
                "published_at": isoDateToSql(publishDateInput.value),
                "country": config.materials[Object.keys(config.materials)[0]].country
            };
            if (config.brandsUsed.length) values.brand = config.brandsUsed[0];

            query({
                "table": "textures",
                "action": "insert",
                "auth": true,
                "values": values
            }).then(response => {
                publishModal.remove();

                if (response.error === "success") {
                    publishNotification.updateNotification({text: "Texture was not published", image: "warning"});

                } else if (response.status === "success") {
                    const textureId = response.id;

                    postJson('/api/textures/' + textureId + '/update-weight')
                        .then(response => {
                            if (response.rawResponse.status === 200) {
                                publishNotification.updateNotification({text: "Texture published", image: "tick", duration: 2000});
                            } else {
                                publishNotification.updateNotification({text: "Texture published. Could not calculate texture position!", image: "warning", duration: 5000});
                            }
                        });
                }
            });
        });
    };
});

// Update existing published asset
document.querySelector("[data-action='publish_update']").addEventListener("click", () => {

    const updatePublishedNotification = addNotification({text: "Updating...", image: "spinner"});

    const values = {};
    const proms = [];

    if (document.querySelector("#upd-pub-params").checked) values.params = JSON.stringify(copy(params, {view: "texture"}));

    if (document.querySelector("#upd-pub-sphere").checked)  {
        const sphSaving = saveSphere();
        values.sphere = sphSaving.path;
        proms.push(sphSaving.promise);
    }

    proms.push(query({table: "textures", id: config.asset.id, action: "update", values: values, auth: true}));

    Promise.all(proms).then(() => {
        updatePublishedNotification.updateNotification({text: "Updated", image: "tick", duration: 2000});
    }).catch(() => {
        updatePublishedNotification.updateNotification({text: "Failed", image: "warning"});
    });
});
