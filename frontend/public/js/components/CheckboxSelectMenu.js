class CheckboxSelectMenu extends AbstractContextMenu
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
        defaultHtml = false,
        header = false,
        x,
        y,
        isHiddenOnClose = true,
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
    }

    getCheckboxMenu()
    {
        this.createCheckboxSelectMenu();
        return this.menu;
    }

    createCheckboxSelectMenu()
    {
        this.validateRequiredParameters();
        this.createMenu();
        this.addCheckboxEventListeners();
    }

    validateRequiredParameters()
    {
        if (typeof this.items !== "object") {
            throw new Error("Items must be an object containing the required HTML");
        }
    }

    createMenu()
    {
        this.menu = super.getContextMenu();
    }

    addCheckboxEventListeners()
    {

    }
}