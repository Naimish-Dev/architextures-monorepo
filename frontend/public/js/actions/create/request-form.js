const requestButton = document.querySelector("[data-request='app-button']");
if (requestButton) {
    requestButton.addEventListener("click", () => {
        const textureName = document.querySelector("#material-pseudo .pseudo-select-text").innerHTML;
        const patternName = document.querySelector("#pattern .pseudo-select-text").innerHTML;
        const imageName = params.patternId == 17 ? textureName : textureName + " " + patternName;

        const modal = new BrandRequest();
        modal.setName(imageName);
        modal.setParams(params);
        const material = Object.values(config.materials).find(material => material.category !== "Joint");
        modal.setBrand(material.brand || null);
        if (document.querySelector("[data-modal='request-modal']")) {
            modal.toggleRequestModal();
        } else {
            insertHtml(modal.getRequestModal());
        }
    });
}