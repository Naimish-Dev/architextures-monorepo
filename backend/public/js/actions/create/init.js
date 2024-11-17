const DOWNLOAD_MENU = document.getElementById("download-menu");
let SAVE_ID = "" || false;
const actionInputs = document.querySelectorAll(
  "input[name='action-option'], input[data-sub-action]"
);
const saveOptions = document.querySelector("[data-save-options]");
const downloadOptions = document.querySelector("[data-download-options]");
const saveParamsOptions = document.querySelector("[data-save-params-options]");
const publishOptions = document.querySelector("[data-publish-options]");
const importOptions = document.querySelector("[data-import-options]");
const saveContainer = document.querySelector("[data-save-container]");
const publishContainer = document.querySelector("[data-publish-container]");
const saveParamsContainer = document.querySelector(
  "[data-save-params-container]"
);
const shareContainer = document.querySelector("[data-share-container]");
const downloadContainer = document.querySelector("[data-download-container]");
const importContainer = document.querySelector("[data-import-container]");

function setSaveMenuState() {
  // Check inputs based on cookie
  const action = getArtxCookie("saveMenuState")
    ? getArtxCookie("saveMenuState")
    : config.plugin
    ? "import"
    : "download";
  const subAction = document.querySelector(
    "[name='" + action + "-option']:checked"
  )
    ? document.querySelector("[name='" + action + "-option']:checked").value
    : action;
  document.querySelector("input[value='" + action + "']").checked = true;

  // Set visibilities for main radio options
  saveParamsContainer.style.display = config.user ? "flex" : "none";
  if (
    !config.appdata ||
    (config.user && ["brand", "admin", "editor"].includes(config.user.type))
  ) {
    saveContainer.style.display = "flex";
    shareContainer.style.display = "flex";
  } else {
    saveContainer.style.display = "none";
    shareContainer.style.display = "none";
  }
  publishContainer.style.display = ["brand", "admin", "editor"].includes(
    config.user.type
  )
    ? "flex"
    : "none";
  importContainer.style.display = config.plugin ? "flex" : "none";
  downloadContainer.style.display = !config.plugin ? "flex" : "none";

  // Set visibilities for additional options
  saveOptions.style.display = action === "save" ? "flex" : "none";
  saveParamsOptions.style.display = action === "params" ? "flex" : "none";
  publishOptions.style.display = action === "publish" ? "flex" : "none";
  downloadOptions.style.display = action === "download" ? "flex" : "none";
  importOptions.style.display = action === "import" ? "flex" : "none";

  // Hide all action buttons, and display matching button
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.style.display = "none";
  });

  if (document.querySelector("[data-action='" + subAction + "']")) {
    document.querySelector("[data-action='" + subAction + "']").style.display =
      "block";
  }

  positionMenu(document.getElementById("download"));

  document.dispatchEvent(new Event("save-menu-updated"));
}

actionInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const action = document.querySelector(
      "input[name='action-option']:checked"
    ).value;
    setArtxCookie("saveMenuState", action);
    setSaveMenuState();
  });
});

setSaveMenuState();

// Set the correct aspect ratio when resolution is changed
function setResolution(inputElement) {
  const container = inputElement.closest("[data-resolution-container]");
  const pixelWidthInput = container.querySelector("[data-pixel-width]");
  const pixelHeightInput = container.querySelector("[data-pixel-height]");
  const aspectRatio = canvas.width / canvas.height;

  if (inputElement === pixelWidthInput) {
    const widthValue = pixelWidthInput.value;
    pixelHeightInput.value = parseInt(widthValue / aspectRatio);
  } else if (inputElement === pixelHeightInput) {
    const heightValue = pixelHeightInput.value;
    pixelWidthInput.value = parseInt(heightValue * aspectRatio);
  }
  params.pixelWidth = pixelWidthInput.value;
}

function sanitiseResolution(container) {
  const pixelWidthInput = container.querySelector("[data-pixel-width]");
  const pixelHeightInput = container.querySelector("[data-pixel-height]");
  const maxResolution = get("maxres") ? get("maxres") : 8192;
  const width = pixelWidthInput.value;
  const height = pixelHeightInput.value;

  // Check input size
  if (width > maxResolution || height > maxResolution) {
    // Check canvas orientation
    if (canvas.width > canvas.height) {
      pixelWidthInput.value = maxResolution;
      setResolution(pixelWidthInput);
    } else {
      pixelHeightInput.value = maxResolution;
      setResolution(pixelHeightInput);
    }
  }
}

// Add event listener to all resolution containers
document
  .querySelectorAll("[data-resolution-container]")
  .forEach(function (container) {
    container
      .querySelectorAll("[data-pixel-width], [data-pixel-height]")
      .forEach(function (input) {
        input.addEventListener("keyup", function (event) {
          setResolution(event.target);
        });

        input.addEventListener("change", function () {
          sanitiseResolution(container);
        });
      });
  });
