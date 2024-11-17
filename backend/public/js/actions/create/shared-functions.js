function drawCroppedSphere(){
    return new Promise(function(resolve){
        var sphParams = copy(params);
        sphParams.view = "sphere";
        config.draw(sphParams).then(function(canvas){
            drawSphere({
                color: config.color.canvas.toDataURL(),
                bump: config.bump.canvas.toDataURL(),
                displacement: config.displacement.canvas.toDataURL(),
                roughness: config.roughness.canvas.toDataURL(),
                metalness: config.metalness.canvas.toDataURL(),
                cameraWidth: 2048,
                cameraHeight: 2048,
                divisions: 2048,
                newScene: true
            }).then(function(sphere){
                resolve(sphere);
            });
        });
    });
}

function saveSphere(){
    const fileBaseName = trainify(config.nameParts.join("-"))+"-"+generateUid()+"-sphere.png";
    const filePath = "textures/"+(currentDate.getFullYear()-2000)+"/"+(currentDate.getMonth()+1)+"/"+fileBaseName;
    const savePromise = new Promise(function(resolve){
        drawCroppedSphere().then(function(sphere){
            var file = createBlob(sphere.toDataURL());
            saveFile(filePath, file).then(function(){
                resolve();
            });
        });
    });
    return {path: "/"+filePath, promise: savePromise};
}

function hideDownloadMenu(){
    DOWNLOAD_MENU.style.display = "none";
    DOWNLOAD_MENU.classList.remove("active");
}