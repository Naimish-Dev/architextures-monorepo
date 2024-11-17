class CreateElement
{
    constructor(object) {
        this.object = object;
        this.svgTags = ["svg","clipPath","use","path","g","defs","image","foreignObject"];
        this.element = "";
    }

    createHTML()
    {
        if (typeof this.object === "string") {
            return this.createFromString();
        }

        this.setTag();
        this.setAttributes();
        this.setText();
        this.createChildren();
        return this.getElement();
    }

    setTag()
    {
        if (this.svgTags.includes(this.object.tag)) {
            this.element = document.createElementNS("http://www.w3.org/2000/svg", this.object.tag);
        } else {
            this.element = document.createElement(this.object.tag);
        }
    }

    setAttributes()
    {
        for (const [key, value] of Object.entries(this.object)) {
            if (!["tag","attributes","text","children"].includes(key)) {
                this.element.setAttribute(key, value);
            }
        }

        const objectAttribute = this.object.attributes || this.object.attr || null;

        if (null !== objectAttribute) {
            for (const [attr, value] of Object.entries(objectAttribute)) {
                this.element.setAttribute(attr, value);
            }
        }
    }

    setText()
    {
        if (this.object.text) {
            this.element.innerHTML = this.object.text;
        }
    }

    createChildren()
    {
        if (this.object.hasOwnProperty("children")) {
            this.object.children.forEach((childObject) => {
                // Check that the child object isn't false, allowing false helps create if conditions in large html objects
                if (childObject) {
                    // If the element is already a DOM node
                    let childElement = childObject.outerHTML !== undefined ? childObject : new CreateElement(childObject).createHTML();
                    // Append it to the element
                    if (childElement) {
                        this.element.appendChild(childElement);
                    }
                }
            });
        }
    }

    createFromString()
    {
        return document.createTextNode(this.object);
    }

    getElement()
    {
        return this.element;
    }
}