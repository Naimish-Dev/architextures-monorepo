class AbstractMenuItems
{
    constructor({
        items,
        defaultHtml
    }) {
        this.items = items;
        this.defaultHtml = defaultHtml;
    }

    getMenuItems()
    {
        this.createMenuItems();
        return this.htmlItems;
    }

    createMenuItems()
    {
        if (this.defaultHtml) {
            this.createDefault();
        } else {
            this.createCustom();
        }
    }

    createDefault()
    {
        this.htmlItems = this.items.map(item => {
            return new CreateElement({
                tag: "div",
                class: "nav-menu-item sh",
                text: item
            }).createHTML();
        });
    }

    createCustom()
    {
        this.htmlItems = this.items.map(item => {
            return new CreateElement(item).createHTML();
        });
    }
}