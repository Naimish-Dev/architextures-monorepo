document.querySelector("[data-action='download']").addEventListener("click", () => {
    iframeMessage("downloadRequest");
    if (config.appdata && config.appdata.preventDownloads === true) return;
    const filename = config.nameParts.join(" ") + " " + params.view + ".jpg";
    recordAppDownload();
    if (params.hasOwnProperty("view") && params.view == "scene") {
        downloadTexture(config.scene.canvas, 0.95);
    } else if (params.hasOwnProperty("view") && params.view === "plane") {
        drawPlane().then(planeCanvas => {
            downloadFile(planeCanvas.toDataURL("image/jpeg", 0.7), filename);
        });
    } else if (params.hasOwnProperty("view") && params.view === "sphere") {
        drawCroppedSphere().then(sphere => {
            filename.replace(".jpg", ".png");
            downloadFile(sphere.toDataURL(), filename);
        });
    } else if (config.ui.formatSelect.value === "hatch") {
        setHatchName();
        const hparams = copy(params);
        // Add the row data to the params
        hparams.rowData = rowData;
        hparams.hatchName = config.hatchName;
        // Stores the decimal inches value, convert user value which may include unit symbols like ' or "
        hparams.tileWidthInches = (params.inches === true) ? mmToInches(inchesToMm(params.tileWidth)) : mmToInches(params.tileWidth);
        hparams.tileHeightInches = (params.inches === true) ? mmToInches(inchesToMm(params.tileHeight)) : mmToInches(params.tileHeight);

        const hatchMethod = (hparams.hatchJoints == true) ? config.patterns[hparams.patternId].hatchJoints : config.patterns[hparams.patternId].hatchEdges;
        if (hatchMethod == "standard") {
            postJson("/app/hatch", hparams).then(response => {
                downloadHatch(response.hatch);
            });
        } else {
            $.ajax({
                method: "POST",
                url: "/app/hatch",
                data: JSON.stringify(hparams),
                contentType: "application/json"
            })
        }
    } else if (config.pro) {
        predraw("high-res");
    } else {
        downloadTexture("canvas", 0.95);
    }
    config.materialsUsed.forEach(matId => postJson("/app/material-download", {id:matId,page:window.location.href}) );
});

function recordAppDownload(){
    // Send params to download database
    const data = {
        "params": JSON.stringify(params),
    };

    postJson("/app/downloads", data);
}
