// Share button listener
document.querySelector("[data-action='share']").addEventListener("click", () => {
    const linkNotification = addNotification({
        text: "Creating link",
        image: "spinner"
    });
    // main data
    const data = {
        type: "share",
        name: document.querySelector("#material-pseudo .pseudo-select-text").innerText,
        realwidth: config.textureWidth,
        category: config.materials[config.materialsUsed[0]].category,
        params: JSON.stringify(params),
        image: canvas.toDataURL("image/jpeg", 0.9)
    };
    // add brand if available
    if (config.materials.hasOwnProperty(params.tileStyles.a.materialId) && config.materials[params.tileStyles.a.materialId].brand) {
        data.brand = config.materials[params.tileStyles.a.materialId].brand;
    }
    // send data
    postJson("/app/tolibrary", data).then(response => {
        if (parseInt(response)) {
            linkNotification.updateNotification({
                text: "Link created",
                image: "tick",
                duration: 2000
            });
            let shareLink = "https://architextures.org/create/share/" + response;
            if (config.appdata) {
                shareLink = shareLink + '?appid=' + config.appdata.id;
            }

            createModal("Share link", {tag: "div", class: "m-pad", style: "width:600px;", children: [createCopyInput(shareLink)]});
            hideDownloadMenu();

        } else {
            linkNotification.updateNotification({
                text: "Error creating link",
                image: "warning",
                duration: 2000
            });
        }
    });
});
