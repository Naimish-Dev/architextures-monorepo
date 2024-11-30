class RegistrationForm
{
    constructor({ isModal = false, hasHome = false, userType = "user", referrer = "", pro = false, country = "US", title = "Create an account", email = ""} = {} ) {

        this.isModal = isModal;
        this.hasHome = hasHome;
        this.userType = userType;
        this.referrer = referrer;
        this.country = country;
        this.pro = pro;
        this.title = title;
        this.email = email;
        this.industries = config.industries.map(industry => ({name: industry, selected: false}));
    }

    init()
    {
        this.createForm();
        if(this.isModal) this.formInModal();
        this.attachFormListeners();
    }

    getForm()
    {
        return this.form;
    }

    getData()
    {
        return {
            first_name: this.form.querySelector("[data-form='first_name']").value,
            last_name: this.form.querySelector("[data-form='last_name']").value,
            email: this.form.querySelector("[data-form='email']").value,
            company: this.form.querySelector("[data-form='company']").value,
            industry: this.industries ? this.industries.filter(i => i.selected).map(i => i.name).join(", ") : null,
            password: this.form.querySelector("[data-form='password']").value,
            referrer: this.referrer,
            type: this.userType,
            country: this.country,
            is_sub_marketing: this.form.querySelector("[data-form='accept-email']").checked,
        };
    }

    createForm()
    {
        this.form = createHtml({tag: "div", "data-form": "parent-element", class: "fw df", children: [
            {tag:"div", class: "fc fw s-gap m-pad right", style:"box-sizing:border-box;padding-left:0;", children: [
                {tag: "div", class:"sb", children: [
                    this.hasHome ? {tag: "a", style: "padding: 20px; display: inline-block;", href: "/", children: [
                        {tag: "img", class: "logo", alt: "ARTX, the Architextures logo", src: "/img/config-logo.svg"}
                    ]} : {tag: "div"},
                    this.isModal ? {tag:"img", "data-close-modal":"", class:"icon", src:config.cdn+"/icons/x.svg"} : "",
                ]},
                {tag: "div", class: "fc l-gap l-pad", style:"max-width: 500px;overflow-y:scroll", children: [
                    {tag:"div", class:"fc s-gap", children: [
                        {tag:"h1", class:"title", text: this.title},
                        {tag: "div", "data-error": "general-error", Style: "display: none", text: "Something went wrong, please try again later."},
                        this.isModal ? {tag: "div", class: "inlab", text: "Or <a class='uline' href='/login'>Log in</a>"} : ""
                    ]},
                    {tag:"div", class:"fc m-gap", children:[
                        {tag:"div", class:"bv m-gap fw", children: [
                            {tag:"div", class:"fc xs-gap fw", children: [
                                {tag: "div", class: "inlab", text: "name"},
                                {tag: "input", "data-form": "first_name", "data-required": "first_name", class: "fw", type:"text", placeholder: "First"}
                            ]},
                            {tag:"div", class:"fc xs-gap fw", children: [
                                {tag: "input", "data-form": "last_name", "data-required": "last_name", class: "fw", type:"text", placeholder: "Last"}
                            ]},
                        ]},
                        {tag:"div", class:"fc xs-gap", children: [
                            {tag: "div", class: "inlab", text: "email"},
                            {tag: "input", "data-form": "email", "data-required": "email", type:"text", placeholder: "alvar@example.com", value: this.email}
                        ]},
                        {tag:"div", class:"fc xs-gap", children: [
                            {tag: "div", class: "inlab", text: "password"},
                            {tag: "input", "data-form": "password", "data-required": "password", type:"password", placeholder: "●●●●●●●●"}
                        ]},
                        {tag:"div", class:"bv m-gap", children: [
                            {tag:"div", class:"fc xs-gap " + (this.userType === "user" ? "hw" : "fw"), children: [
                                {tag: "div", class: "inlab", text: "company"},
                                {tag: "input", "data-form": "company", type:"text", placeholder: "Company name"}
                            ]},
                            this.userType === "user" ? {tag: "div", class:"fc xs-gap hw", children: [
                                {tag: "div", class: "inlab", text: "what do you do?"},
                                {tag: "input", readonly: true, placeholder: "Architect, Designer...", type: "text", "data-form": "industry", style: "padding: 12px; display: unset;", class: "sline input pntr"}
                            ]}
                            : ""
                        ]},
                        {tag:"div", class: "fc xs-gap", children: [
                            {tag: "label", children:[
                                {tag:"input", "data-form": "accept-email", type:"checkbox"},
                                {tag: "div", style: "user-select:none;", text:"Receive updates by email"}

                            ]},
                            {tag: "label", children:[
                                {tag:"input", "data-form": "accept-terms", "data-required": "accept-terms", type:"checkbox"},
                                {tag: "div", style: "user-select:none;", text:"I agree to the <a target='_blank' class='uline' href='/page/terms'>Terms of Use</a>"}
                            ]},
                        ]},
                    ]},
                    this.pro ? ""
                    : {tag:"button", "data-form": "register-btn", children: [{tag: "div", "data-form-btn": "text", text: "Register"}, {tag: "div", class: "spinner", "data-form-btn": "spinner", style: " display: none;"}]}
                ]}
            ]}
        ]});
    }

    formInModal()
    {
        this.form = createHtml({tag:"div", class:"modal fw", children: [
            {tag: "div", class:"modal-window left-right-modal", style: "width: 900px; flex-direction: row;", children:[
                this.form
            ]}
        ]});
    }

    attachFormListeners()
    {
        if (this.form.querySelector("[data-form='industry']")) {
            this.form.querySelector("[data-form='industry']").parentNode.addEventListener("click", () => {
                this.handleIndustryOptions();
            });
        }

        if(this.isModal) {
            this.form.querySelector("[data-close-modal]").addEventListener("click", () => {
                this.form.remove();
            });

            // close modal on click outside
            document.onclick = e => {
                if(
                    e.target === this.form && e.target !== document.querySelector("#continue")) {
                    this.form.remove();
                }
            }
        }

        this.form.querySelector("[data-form='email']").addEventListener("keyup", () => {
            this.form.querySelector("[data-form='email']").value = this.form.querySelector("[data-form='email']").value.trim();
        });
    }

    showError(field, errors)
    {
        const text = errors?.[0] || "Field is required";
        let formField = this.form.querySelector("[data-form='" + field + "']");
        formField.classList.add("input-error");
        const errorDiv = createHtml({tag: "div", id: "error-" + field, text: text});
        if(document.querySelector("#error-"+ field)) {
            document.querySelector("#error-" + field).remove();
        }
        formField.parentNode.appendChild(errorDiv);
    }

    removeErrors()
    {
        this.form.querySelector("[data-error='general-error']").style.display = "none";
        const formFields = this.form.querySelectorAll("[data-form]");
        formFields.forEach(field => {
            field.classList.remove("input-error");
            if(document.querySelector("#error-"+ field.getAttribute("data-form"))) {
                document.querySelector("#error-" + field.getAttribute("data-form")).remove();
            }
        });
    }

    handleIndustryOptions()
    {
        const options = {
            items: this.industries,
            itemHtml: (item) => {
                // inline styling to override create.css styles
                let itemHtml = createHtml({tag:"label", class:"nav-menu-item", style: "border-bottom: unset; justify-content: unset; padding: 10px;", children: [
                    {tag:"input", type:"checkbox", name:"sector", value:item.name},
                    item.name
                ]});
                let itemInput = itemHtml.querySelector("input");
                if (item.selected) itemInput.checked = true;
                itemHtml.onclick = () =>{
                    // Select the item
                    item.selected = itemInput.checked;
                    this.industries[item.name] = item.selected;
                    // Update the input
                    this.form.querySelector("[data-form='industry']").value = this.industries.filter(i => i.selected).map(i => i.name).join(", ");
                }
                return itemHtml;
            },
            anchorElement: this.form.querySelector("[data-form='industry']"),
        }
        if(!this.isModal) {
            delete options.anchorElement
            options.x = this.form.querySelector("[data-form='industry']").offsetLeft
            options.y = this.form.querySelector("[data-form='industry']").offsetTop;
        }
        const menu = createContextMenu(options);
        menu.style.position = "absolute";
        this.form.appendChild(menu);
    }
}