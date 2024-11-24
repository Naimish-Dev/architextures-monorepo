document.querySelector("[data-action='import_new']").onclick = function(){
    config.updateExisting = false;
    let temParams = copy(params);
    temParams.pxSize = parseInt(document.querySelector("[data-import-pixel-width]").value);
    showImportMessage();
    config.draw(temParams).then(function(newCanvas){
        prepareAppExport(newCanvas);

    });
};

document.querySelector("[data-action='import_update']").onclick = function(){
    let temParams = copy(params);
    temParams.pxSize = parseInt(document.querySelector("[data-import-pixel-width]").value);
    showImportMessage();
    config.draw(temParams).then(function(newCanvas){
        prepareAppExport(newCanvas);
    });
};
