// Save material button listener
document.querySelector("[data-action='material_params']").addEventListener("click", () => {
    hideDownloadMenu();

    const saveMaterialParams = {inches: params.inches};
    const saveMaterialButton = createHtml({tag: "button", text: "Save"});
    const saveMaterialMenu = {tag: "div", class: "m-pad fc m-gap", style: "width:400px;", children: [
            {tag: "span", text: "Select which settings apply", children: [
        {tag:"span", "data-save-material-tooltip":"", class:'tooltip-icon', "data-tooltip":"The settings you choose will be applied when this material is loaded"}
        ]},
        {tag: "div", children: [
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"brightness", type:"checkbox", checked: true},
                "Brightness"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"contrast", type:"checkbox", checked: true},
                "Contrast"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"hue", type:"checkbox", checked: true},
                "Hue"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"saturation", type:"checkbox", checked: true},
                "Saturation"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"invert", type:"checkbox", checked: true},
                "Invert"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"edge", type:"checkbox", checked: true},
                "Edge"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"rows,columns", type:"checkbox", checked: true},
                "Rows & columns"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"tileWidth,tileHeight", type:"checkbox", checked: true},
                "Width & height"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"jointWidthHorizontal,jointWidthVertical", type:"checkbox", checked: true},
                "Joint size"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"profile", type:"checkbox", checked: true},
                "Profile"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-mat-params":"finish", type:"checkbox", checked: true},
                "Finish"
            ]},
        ]},
        saveMaterialButton,
    ]};


    const subMenuModal = createModal("Save material settings", saveMaterialMenu);
    tooltipListener(document.querySelector("[data-save-material-tooltip]"));

    saveMaterialButton.onclick = function(){
        const saveMaterialNotification = addNotification({text: "Saving material settings", image: "spinner"});

        document.querySelectorAll("[data-read-mat-params]").forEach(input => {
            let paramNames = input.getAttribute("data-read-mat-params").split(",");
            paramNames.forEach(param => {
                if (input.checked) {
                    saveMaterialParams[param] = config.generalParams.includes(param) ? params[param] : params.tileStyles.a[param];
                }
            });
        });

        const query = {action: "update", table: "protextures", id: params.tileStyles.a.materialId, values: {params: JSON.stringify(saveMaterialParams)}, auth: true};

        postJson("/app/query", query).then(response => {
            if (!response.status || response.status !== "success") {
                saveMaterialNotification.updateNotification({text: "Error saving material settings", image: "warning"});
            } else {
                saveMaterialNotification.updateNotification({text: "Material settings saved", image: "tick"});
                subMenuModal.remove();
            }
        });
    }
});



// Save pattern button listener
document.querySelector("[data-action='pattern_params']").addEventListener("click", () => {
    hideDownloadMenu();

    const savePatternParams = {inches: params.inches};
    const savePatternButton = createHtml({tag: "button", text: "Save"});
    const savePatternMenu = createHtml({tag: "div", class: "m-pad fc m-gap", style: "width:400px;", children: [
        {tag: "span", text: "Select which settings apply", children: [
            {tag:"span", "data-save-material-tooltip":"", class:'tooltip-icon', "data-tooltip":"The settings you choose will be applied when this pattern is loaded"}
        ]},
        {tag: "div", children:[
            {tag: "label", children: [
                {tag: "input", "data-read-pat-params": "rows,columns", type: "checkbox", checked: true},
                    "Rows & columns"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-pat-params": "tileWidth,tileHeight", type: "checkbox", checked: true},
                    "Width & height"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-pat-params": "jointWidthHorizontal,jointWidthVertical", type: "checkbox", checked: true},
                    "Joint size"
            ]},
            {tag: "label", children: [
                {tag: "input", "data-read-pat-params":"edge", type:"checkbox", checked: true},
                    "Edges"
            ]}
        ]},
        savePatternButton
    ]});

    const subMenuModal = createModal("Save pattern settings", savePatternMenu);
    tooltipListener(document.querySelector("[data-save-material-tooltip]"));

    savePatternButton.onclick = function(){
        const savePatternNotification = addNotification({text: "Saving pattern settings", image: "spinner"});
        // return short to avoid deleting existing record
        if (!config.user.brand) {
            savePatternNotification.updateNotification({text: "Brand is required", image: "warning"});
            return;
        }

        const delQuery = {action:"delete", table: "default_params", where: [["pattern","=",params.patternId]], auth: true};
        postJson("/app/query", delQuery).then(response => {
            if (!response.status || response.status !== "success") {
                savePatternNotification.updateNotification({text: "Error saving pattern settings", image: "warning"});
                return;
            }
            document.querySelectorAll("[data-read-pat-params]").forEach(input => {
                if (input.checked) {
                    const param = input.getAttribute("data-read-pat-params");
                    savePatternParams[param] = config.generalParams.includes(param) ? params[param] : params.tileStyles.a[param];
                }
            });

            const query = {action: "insert", table: "default_params", values: {pattern: params.patternId, brand: config.user.brand, params: JSON.stringify(savePatternParams)}, auth: true};

            postJson("/app/query", query).then(response => {
                if (!response.status && response.status !== "success") {
                    savePatternNotification.updateNotification({text: "Error saving pattern settings", image: "warning"});
                } else {
                    savePatternNotification.updateNotification({text: "Pattern settings saved", image: "tick"});
                    subMenuModal.remove();
                }
            });
        });
    }
});



// Save web app user settings listener
document.querySelector("[data-action='app_params']").addEventListener("click", () => {
    const saveWebNotification = addNotification({text: "Saving app settings", image: "spinner"});

    const query = {action: "update", table: "users", id: config.user.id, values: {app_default_params: JSON.stringify(params)}, auth: true};

    postJson("/app/query", query).then(response => {
        if (!response.status && response.status !== "success") {
            saveWebNotification.updateNotification({text: "Error saving app settings", image: "warning"});
        } else {
            saveWebNotification.updateNotification({text: "App settings saved", image: "tick"});
        }
    });
});



// Save custom app settings listener
document.querySelector("[data-action='branded_app_params']").addEventListener("click", () => {
    const saveCustomAppNotification = addNotification({text: "Saving custom settings", image: "spinner"});

    const query = {action: "update", table: "apps", id: config.appdata.id, values: {params: JSON.stringify(params)}, auth: true};

    postJson("/app/query", query).then(response => {
        if (!response.status && response.status !== "success") {
            saveCustomAppNotification.updateNotification({text: "Error saving custom settings", image: "warning"});
        } else {
            saveCustomAppNotification.updateNotification({text: "Custom settings saved", image: "tick"});
        }
    });
});