class CollectRegistrationData
{
    constructor({userPlanData = {}, registrationForm, goToPayment = false, refreshPage = false, params = {}, redirect = ""})
    {
        const ALLOWED_FORMDATA_KEYS = ["first_name", "last_name", "email", "company", "industry", "password", "referrer", "type", "is_sub_marketing", "country"];
        const ALLOWED_PLANDATA_KEYS = ["plan", "planQuantity", "stripeKey"];

        this.registrationForm = registrationForm;
        this.formData = registrationForm.getData();
        this.planData = goToPayment ? userPlanData.getData() : false;
        this.goToPayment = goToPayment;
        this.refreshPage = refreshPage;
        this.params = params;
        this.redirect = redirect;

        this.validateProperties(this.formData, ALLOWED_FORMDATA_KEYS, "Invalid key in formData: ");
        this.validateProperties(this.planData, ALLOWED_PLANDATA_KEYS, "Invalid key in planData: ");
    }

    /**
     * validate the properties of an object
     * @param properties
     * @param allowedKeys
     * @param errorMsg
     */
    validateProperties(properties, allowedKeys, errorMsg)
    {
        if(!properties) return;

        for(const key of Object.keys(properties)) {
            if(!allowedKeys.includes(key)) {
                throw new Error(errorMsg + key);
            }
        }
    }

    startRegistration()
    {
        new UserRegistration(this.planData, this.formData, this.registrationForm, this.params ? this.params : null).register(this.goToPayment ? "payment" : this.refreshPage ? "refresh" : "home", this.redirect);
    }
}