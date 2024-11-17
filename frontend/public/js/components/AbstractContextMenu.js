class AbstractContextMenu extends AbstractMenuItems
{
    constructor({
        name,
        items,
        anchor,
        width,
        height,
        maxHeight,
        maxWidth,
        persist,
        container,
        defaultHtml,
        header,
        x,
        y,
        isHiddenOnClose
    }) {
        super({
            items: items,
            defaultHtml: defaultHtml
        });

        this.name = name;
        this.items = items;
        this.width = width;
        this.height = height;
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
        this.anchor = anchor;
        this.persist = persist;
        this.container = container;
        this.header = header;
        this.x = x;
        this.y = y;
        this.isHiddenOnClose = isHiddenOnClose;
        this.cdn = config.cdn;
    }

    getContextMenu()
    {
        this.createContextMenu();
        return this.menu;
    }

    createContextMenu()
    {
        this.validateRequired();
        if (this.menuExists()) {
            this.showMenu();
        } else {
            this.addMenuItems();
            this.createMenuContent();
            this.createContainer();
            this.addHeader();
            this.setStyles();
            this.addEventListeners();
        }
    }

    createMenuContent()
    {
        if (undefined === this.menuContent) {
            this.menuContent = new CreateElement({
                tag: "div",
                class: "nav-menu-items",
                "data-menu": "content-" + this.name,
                children: this.menuItems
            }).createHTML();
        }
    }

    createContainer()
    {
        const close = new CreateElement({tag:"img", "data-menu": "close", class:"menu-icon", src: this.cdn + "/icons/x.svg"}).createHTML();
        this.menu = new CreateElement({
            tag: "div", class: "nav-menu", style: "display: none;", children: [
                {tag: "div", class: "eh", "data-menu": "header-" + this.name, children: [
                    {tag: "div", class: "nav-menu-header cv fw fr hor-sb s-gap", children: [ close ]}
                ]},
                this.menuContent
            ],
        }).createHTML();
    }

    addMenuItems()
    {
        this.menuItems = super.getMenuItems();
    }

    setStyles()
    {
        this.menu.style.position = "fixed";
        this.menu.style.zIndex = 5000;

        if (null !== this.maxWidth) {
            this.menu.style.maxWidth = this.maxWidth + "px";
        } else {
            this.menu.style.width = this.width + "px";
        }
        if (null !== this.maxHeight) {
            this.menu.style.maxHeight = this.maxHeight + "px";
            this.menu.style.overflowY = "scroll";
        } else {
            this.menu.style.height = this.height + "px";
        }
        this.updatePosition();
    }

    updatePosition()
    {
        switch (true) {
            case undefined !== this.x && undefined !== this.y:
                this.setPositionX();
                this.setPositionY();
                break;
            case undefined !== this.x:
                this.setPositionX();
                this.calculateY();
                break;
            case undefined !== this.y:
                this.setPositionY();
                this.calculateX();
                break;
            default:
                this.calculatePosition();
        }
    }

    /*
     * optional header prepended to the header
     */
    addHeader()
    {
        if (false !== this.header) {
            const element = this.menu.querySelector("[data-menu='header-" + this.name +  "'] .nav-menu-header");
            element.insertBefore(this.header, element.firstChild);
        }
    }

    validateRequired()
    {
        if (!this.name) {
            throw new Error("Name is required to create a context menu");
        }

        if (!this.items) {
            throw new Error("Content is required to create a context menu");
        }

        if (!Number.isInteger(Number(this.width)) && !Number.isInteger(Number(this.maxWidth))) {
            throw new Error("Width or max width is required to create a context menu");
        }

        if (!Number.isInteger(Number(this.height)) && !Number.isInteger(Number(this.maxHeight))) {
            throw new Error("Height or max height is required to create a context menu");
        }

        if (!this.anchor) {
            throw new Error("Anchor is required to create a context menu");
        }

        if (typeof this.persist !== "boolean") {
            throw new Error("Persist must be a boolean value");
        }
    }

    menuExists()
    {
        const menu = document.querySelector("[data-menu='header-" + this.name + "']");

        if (menu && menu.parentNode) {
            this.menu = menu.parentNode;
            return true;
        }
        return false;
    }

    toggleMenu()
    {
        if (this.menu.style.display === "block") {
            if (this.isHiddenOnClose) {
                this.menu.style.display = "none";
            } else {
                this.menu.remove();
            }
        } else {
            this.menu.style.display = "block";
            this.setPosition();
        }
    }

    showMenu()
    {
        if (this.menu) {
            this.menu.style.display = "block";
            this.setPosition();
        }
    }

    hideMenu()
    {
        if (this.menu) {
            if (this.isHiddenOnClose) {
                this.menu.style.display = "none";
            } else {
                this.menu.remove();
            }
        }
    }

    addEventListeners()
    {
        this.clickOutsideMenu();
        this.menuSticksToAnchor();
        this.addCloseEventListener();
    }

    addCloseEventListener()
    {
        this.menu.querySelector("[data-menu='close']").addEventListener("click", () => {
                this.hideMenu();
            });
    }

    clickOutsideMenu()
    {
        document.addEventListener("click", (event) => {
            if (
                event.target !== this.menu &&
                event.target !== this.anchor &&
                !this.menu.contains(event.target)
            ) {
                this.hideMenu();
                if (!this.isHiddenOnClose) {
                    document.removeEventListener("click", this.clickOutsideMenu, false);
                }
            }
        });
    }

    /**
     * element positioning methods
     */
    updateElementPosition(anchor, menu, x, y)
    {
        const rectangleArea = anchor.getBoundingClientRect();
        menu.style.left = (rectangleArea.left + x) + "px";
        menu.style.top = (rectangleArea.top + y) + "px";
    }

    getRectangleArea()
    {
        const rectangleArea = this.anchor.getBoundingClientRect();
        if (rectangleArea.x === 0 && rectangleArea.y === 0) {
            setTimeout(() => this.updateElementPosition(this.anchor, this.menu, rectangleArea.x, rectangleArea.y), 10);
        }
        return rectangleArea;
    }

    calculateY()
    {
        const rectangleArea = this.getRectangleArea();
        this.menu.style.top = Math.round(rectangleArea.top + rectangleArea.height) + "px";
    }

    calculateX()
    {

        const rectangleArea = this.getRectangleArea();
        if (rectangleArea.x === 0 && rectangleArea.y === 0) {
            setTimeout(() => this.updateElementPosition(this.anchor, this.menu, rectangleArea.x, rectangleArea.y), 10);
        }
        this.menu.style.left = Math.round(rectangleArea.left) + "px";
    }

    calculatePosition()
    {
        const rectangleArea = this.anchor.getBoundingClientRect();
        if (rectangleArea.x === 0 && rectangleArea.y === 0) {
            setTimeout(() => this.updateElementPosition(this.anchor, this.menu, rectangleArea.x, rectangleArea.y), 10);
        }
        this.menu.style.left = Math.round(rectangleArea.left) + "px";
        this.menu.style.top = Math.round(rectangleArea.top + rectangleArea.height) + "px";
    }

    setPositionX()
    {
        this.menu.style.left = Math.round(this.x) + "px";
    }

    setPositionY()
    {
        this.menu.style.top = Math.round(this.y) + "px";
    }

    menuSticksToAnchor()
    {
        const anchor = this.anchor;
        const menu = this.menu;

        const anchorTop = anchor.getBoundingClientRect().top;
        const initialMenuTop = parseInt(menu.style.top || 0, 10);
        const body = document.querySelector("#page-body") ? document.querySelector("#page-body") : document.querySelector("body");

        body.addEventListener("scroll", () => {
            const currentAnchorTop = anchor.getBoundingClientRect().top;
            const currentAnchorBottom = anchor.getBoundingClientRect().bottom;

            if (menu.style.top !== '' && menu.style.top !== 'null') {
                let top;
                if (initialMenuTop === anchorTop) {
                    top = currentAnchorTop;
                } else {
                    top = currentAnchorBottom;
                }

                menu.style.top = top + "px";
            } else if (menu.style.bottom !== 'null') {
                let bottom;
                bottom = window.innerHeight - currentAnchorBottom;
                menu.style.bottom = bottom + "px";
            }
        });
    }

    setPosition()
    {
        const menu = this.menu;
        const anchor = this.anchor;
        const menuHeight = menu.offsetHeight;
        const distanceTop = anchor.getBoundingClientRect().bottom;
        const distanceBottom = window.innerHeight - anchor.getBoundingClientRect().top;

        if (distanceBottom >= distanceTop) {
            menu.style.top = anchor.getBoundingClientRect().top + "px";
            menu.style.bottom = null;

            if (distanceBottom > menuHeight) {
                this.resetMenuHeight();
            } else {
                menu.style.height = distanceBottom + "px";
            }
        } else {
            menu.style.bottom = window.innerHeight - anchor.getBoundingClientRect().bottom + "px";
            menu.style.top = null;

            if (distanceTop > menuHeight) {
                this.resetMenuHeight();
            } else {
                menu.style.height = distanceTop + "px";
            }
        }

        this.setMenuHeight();
    }

    setMenuHeight()
    {
        const headerHeight = this.menu.querySelector("[data-menu='header-" + this.name + "']").offsetHeight;
        this.menuContent.style.height = this.menu.offsetHeight - headerHeight + "px";
    }

    resetMenuHeight()
    {
        if (null !== this.maxHeight) {
            this.menu.style.maxHeight = this.maxHeight + "px";
        } else if (null !== this.height) {
            this.menu.style.height = this.height + "px";
        } else {
            this.menu.style.height = "unset";
            this.menu.style.maxHeight = "unset";
        }
    }
}