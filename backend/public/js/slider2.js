class ImageSlides {
  constructor(images, isModal = false) {
    this.images = images;
    this.cdn = artx.cdn;
    this.isModal = isModal;
  }

  getSlidesElement() {
    return this.container;
  }

  createSlides() {
    this.createContainer();
    this.checkImagesLoaded();
    this.loadFlickity();
  }

  createContainer() {
    this.container = createHtml({
      tag: "div",
      class: "slider-container fw fh left",
      children: this.images.map((image) => {
        return {
          tag: "div",
          "data-slider-cell": "",
          class: "slider-cell fh",
          style: "background: " + image.color,
          children: [
            {
              tag: "img",
              src: this.cdn + "slider/" + image.src,
              srcset: this.cdn + "slider/" + image.src,
              alt: image?.text || "img",
            },
            {
              tag: "div",
              class: "slider-caption",
              style: "background-color: " + image.color + ";",
              children: [
                {
                  tag: "div",
                  class: "slider-cell-text inlab sline",
                  text: image.text,
                },
                { tag: "div", "data-dots-container": "" },
              ],
            },
          ],
        };
      }),
    });
  }

  checkImagesLoaded() {
    const images = this.container.querySelectorAll("img");
    this.imagePromises = [];
    images.forEach((img) => {
      let imagePromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          img.closest("[data-slider-cell]").remove();
          resolve;
        };
      });
      this.imagePromises.push(imagePromise);
    });
  }

  loadFlickity() {
    Promise.all(this.imagePromises).then(() => {
      const flkty = new Flickity(this.container, {
        draggable: false,
        autoPlay: 4000,
        wrapAround: true,
        selectedAttraction: 0.1,
        friction: 0.6,
        setGallerySize: false,
        resize: true,
      });

      // Function puts the default flickity dots into the current slide
      function putDots() {
        flkty.selectedCell.element
          .querySelector("[data-dots-container]")
          .appendChild(flkty.pageDots.holder);
      }
      putDots();

      flkty.on("change", () => {
        putDots();
      });

      // On window size change, set flickity viewport height
      window.addEventListener("resize", () => {
        console.log(`Container height: ${this.container.clientHeight}`);
        flkty.viewport.style.height = this.container.clientHeight + "px";
      });
    });
  }
}
