class SearchSelect extends AbstractContextMenu
{
    constructor({
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
            name: name,
            items: items,
            anchor: anchor,
            width: width,
            height: height,
            maxHeight: maxHeight,
            maxWidth: maxWidth,
            persist: persist,
            container: container,
            defaultHtml: defaultHtml,
            header: new CreateElement({tag:"input", type:"search", class:"fbutt search menu-search", "data-input":"search-" + name, "placeholder":"Search"}).createHTML(),
            x: x,
            y: y,
            isHiddenOnClose: isHiddenOnClose
        });

        this.items = items;
        this.name = name;
        this.showSelectedOnElement = showSelectedOnElement;
    }

    getMenu()
    {
        this.createSearchSelect();
        return this.searchMenu;
    }

    createSearchSelect()
    {
        this.validateRequiredParameters();
        this.createMenu();
        this.addSearchEventListener();
        this.addSelectEventListener();
    }

    createMenu()
    {
        this.searchMenu = super.getContextMenu();
    }

    addSearchEventListener()
    {
        this.searchMenu.querySelector("[data-input='search-" + this.name + "']").addEventListener("keyup", e => {
            const value = e.target.value.toLowerCase();
            const items = this.menuItems;
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                if (text.match(value)) {
                    // setting flex may not work in all cases
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }

    addSelectEventListener()
    {
        this.menuItems.forEach(item => {
            item.addEventListener("click", () => {
                this.showSelectedOnElement.innerHTML = item.innerText;
                super.hideMenu();
            });
        });
    }

    checkDataSearch(item)
    {
        if (undefined === item["data-search"]) {
            if (item.children) {
                return Array.from(item.children).some(child => this.checkDataSearch(child));
            } else {
                return false;
            }
        } else {
            return item["data-search"].startsWith("item");
        }
    }

    validateRequiredParameters()
    {
        if (!this.items) {
            throw new Error("Items are required to create a search select");
        }

        if (!this.items.every(item => this.checkDataSearch(item))) {
            throw new Error("Items must have a data-search=item attribute to create a search select");
        }
    }

    toggleMenuWithFocus()
    {
        super.toggleMenu();
        this.searchMenu.querySelector("[data-input='search-" + this.name + "']").focus();
    }
}