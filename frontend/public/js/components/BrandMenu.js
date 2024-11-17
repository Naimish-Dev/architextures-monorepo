class BrandMenu extends SearchSelect
{
    constructor({
        databox,
        items,
        anchor,
        showSelectedOnElement,
        name,
        defaultHtml = true,
        width = 200,
        height = 450,
        maxHeight = null,
        maxWidth = null,
        persist = false,
        container = null,
        x,
        y,
        isHiddenOnClose = true
    }) {
        super({
            items: items,
            anchor: anchor,
            showSelectedOnElement: showSelectedOnElement,
            name: name,
            defaultHtml: defaultHtml,
            width: width,
            height: height,
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            persist: persist,
            container: container,
            x: x,
            y: y,
            isHiddenOnClose: isHiddenOnClose
        });

        this.databox = databox;
    }

    getBrandMenu()
    {
        this.createBrandMenu();
        return this.brandMenu;
    }

    createBrandMenu()
    {
        this.validateRequiredParameters();
        this.brandMenu = super.getMenu();
        this.addSelectListener();
    }

    /*
     * overrides the addSelectListener() method
     */
    addSelectListener()
    {
        this.menuItems.forEach(item => {
            item.addEventListener("click", () => {
                const itemId = item.getAttribute("data-id");
                const itemName = item.getAttribute("data-name");

                let newQuery = copy(this.databox.ogQuery.where);
                if (itemId === "all") {
                    newQuery = newQuery.filter(where => {
                        return where[0] !== "brand";
                    });
                } else {
                    newQuery.push(["brand","=",itemId]);
                }
                this.databox.query.where = newQuery;
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

                this.resetCatMenu();
                this.databox.fetchItems(true);
                this.showSelectedOnElement.innerHTML = itemName;
                this.brandMenu.style.display="none";
            });
        });
    }

    resetCatMenu()
    {
        const selectedCat = document.querySelector("#filter-cats");
        if (selectedCat.innerText !== "Category") {
            selectedCat.innerText = "Category";
        }
    }
}