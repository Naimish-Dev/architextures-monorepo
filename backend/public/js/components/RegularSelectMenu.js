class RegularSelectMenu extends AbstractContextMenu
{
    constructor({
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
            isHiddenOnClose: isHiddenOnClose
        });

        this.showSelectedOnElement = showSelectedOnElement;
    }

    getMenu()
    {
        this.createRegularSelectMenu();
        return this.menu;
    }

    createRegularSelectMenu()
    {
        this.validateRequiredParameters();
        this.createMenu();
        this.addSelectListener();
    }

    addSelectListener()
    {
        // show selected item on the element
        this.menuItems.forEach(item => {
            item.addEventListener("click", () => {
                this.showSelectedOnElement.innerHTML = item.innerText;
                super.hideMenu();
            });
        });
    }

    createMenu()
    {
        this.menu = super.getContextMenu();
    }

    validateRequiredParameters() {
         if (!this.items) {
            throw new Error("Items are required to create a select menu");
        }
    }
}