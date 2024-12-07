class LoadCollections {
  constructor({
    shouldClosePages = true,
    isAdmin = true,
    isPlugin = false,
  } = {}) {
    this.shouldClosePages = shouldClosePages;
    this.isAdmin = isAdmin;
    this.isPlugin = isPlugin;
  }
  showAllCollections() {
    if (this.shouldClosePages) closeAdminPages();

    // closing collection page removes .admin-collection element
    if (!document.querySelector(".admin-collection")) {
      if (this.isAdmin) {
        document
          .querySelector(".admin-area")
          .appendChild(CollectionAdmin.createMainContainer(this.isAdmin));
      } else {
        document
          .querySelector(".user-area")
          .appendChild(CollectionAdmin.createMainContainer(this.isAdmin));
      }
    }

    if (this.shouldClosePages) CollectionAdmin.showSpinner();

    postJson("/app/collections", { method: "getUserCollections" }).then(
      (response) => {
        if (response.rawResponse.status !== 200) {
          CollectionAdmin.hideSpinner();
          showInfoMessage(
            "Error",
            "There was an error loading the collections. Please try again later."
          );
          return;
        }
        CollectionAdmin.removeCollection();

        const collection = new CollectionAdmin(
          response.results,
          artx.user.id,
          this.isAdmin,
          this.isPlugin
        );
        collection.addTotalTextures();
        collection.addUserCollections();
        collection.addEventListeners();
        if (!this.isAdmin) {
          collection.collectionsSearch("#collections-search");
        }
        collection.collections.forEach((col, index) => {
          collection.generateCollectionImage(index);
        });
        CollectionAdmin.hideSpinner();
      }
    );
  }
}
