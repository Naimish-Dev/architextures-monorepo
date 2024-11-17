class CategoryMenu extends RegularSelectMenu
{
    constructor({
        databox,
        name,
        items,
        anchor,
        width = null,
        height = null,
        maxWidth = null,
        maxHeight = null,
        persist = false,
        container = null,
        defaultHtml = true,
        header = false,
        x,
        y,
        isHiddenOnClose = true,
        showSelectedOnElement
    }) {
        super({
            name: name,
            items: items,
            anchor: anchor,
            width: width,
            height: height,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            persist: persist,
            container: container,
            defaultHtml: defaultHtml,
            header: header,
            x: x,
            y: y,
            isHiddenOnClose: isHiddenOnClose,
            showSelectedOnElement: showSelectedOnElement
        });

        this.databox = databox;
    }


    getCategoryMenu()
    {
        this.createCategoryMenu();
        return this.categoryMenu;

    }
    createCategoryMenu()
    {
        this.validateRequiredForCat();
        this.categoryMenu = super.getMenu();
        this.addSelectListener();
    }

    /*
     * overrides the addSelectListener() method
     */
    addSelectListener()
    {
        this.menuItems.forEach(item => {
            item.addEventListener("click", () => {
                if (item.innerText === "All") {
                    this.showSelectedOnElement.innerHTML = "Category";
                    this.databox.query.where = [["type", "IS NULL"]];
                } else {
                    this.showSelectedOnElement.innerHTML = item.innerText;
                    const newQuery = copy(this.databox.ogQuery.where);
                    newQuery.push(["category", "like", item.dataset.categoryName])
                    this.databox.query.where = newQuery;
                }
                if (this.databox.query.table === "saves") {
                    // check if in joins there is reference to position
                    this.databox.query.joins = this.databox.query.joins.filter(join => {
                        return !(join.table && join.table.startsWith("textures_position"));
                    });
                    // check if in where there is reference to position
                    const positionTable = "textures_position_" + config.userRegion.toLowerCase();
                    const removePositionWhere = [positionTable + ".position", "IS NOT NULL"];
                    this.databox.query.where = this.databox.query.where.filter(where => {
                        return where.toString() !== removePositionWhere.toString();
                    });
                }

                this.resetBrandMenu();

                this.databox.fetchItems(true);
                super.hideMenu();
            });
        });
    }

    validateRequiredForCat()
    {
        if (!this.databox) {
            throw new Error("databox is required parameter for CategoryMenu");
        }
    }

    resetBrandMenu()
    {
        const selectedBrand = document.querySelector("#filter-brand");
        if (selectedBrand.innerText !== "Maker") {
            selectedBrand.innerText = "Maker";
        }
    }
}