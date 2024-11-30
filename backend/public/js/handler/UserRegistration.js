/**
 * self-contained class for registering a user
 * any changes to the HTML form will require changes to this class too
 */

class UserRegistration
{
    constructor(planData, formData, form, params) {

        this.stripeKey = planData.stripeKey;
        delete planData.stripeKey;

        this.data = Object.assign({}, formData, planData);
        this.url = "/auth/register";
        this.form = form;
        this.params = params;
    }

    /**
     * try to register a user, show errors if any or proceed to next step
     * @method register
     * @return void
     * @param next
     * @param redirectUrl
     */
    register(next = "home", redirectUrl)
    {
        // process form submission
        postJson(this.url, this.data).then(response => {
            this.userId = response.user_id;
            const proButton = document.querySelector("#register-pay");
            const regBtnText = document.querySelector("[data-form-btn='text']");
            const regBtnSpinner = document.querySelector("[data-form-btn='spinner']");

            switch(response.rawResponse.status) {
                case 500:
                    // remove old errors
                    this.form.removeErrors();

                    // registration error/db error
                    this.form.form.querySelector("[data-error='general-error']").style.display = "block";

                    // handle spinner in button
                    if(proButton) proButton.innerHTML = "Register &amp; Subscribe";
                    if(regBtnText) regBtnText.style.display = "block";
                    if(regBtnSpinner) regBtnSpinner.style.display = "none";
                    break;

                case 422:
                    // remove old errors
                    this.form.removeErrors();

                    // validation error
                    Object.keys(response.errors).forEach((error) => {
                      if (response.errors.hasOwnProperty(error)) {
                        this.form.showError(error, response.errors[error]);
                      }
                    });

                    // handle spinner in button
                    if(proButton) proButton.innerHTML = "Register &amp; Subscribe";
                    if(regBtnText) regBtnText.style.display = "block";
                    if(regBtnSpinner) regBtnSpinner.style.display = "none";
                    break;

                case 400:
                    // remove old errors
                    this.form.removeErrors();

                    // registration error/db error
                    this.form.form.querySelector("[data-error='general-error']").style.display = "block";

                    // handle spinner in button
                    if(proButton) proButton.innerHTML = "Register &amp; Subscribe";
                    if(regBtnText) regBtnText.style.display = "block";
                    if(regBtnSpinner) regBtnSpinner.style.display = "none";
                    break;

                case 201:
                    this.form.removeErrors();

                    // successful registration
                    switch(next) {
                        case "payment":
                            const stripe = new StripeHandler(
                                this.userId,
                                this.data.plan,
                                this.data.planQuantity,
                                null
                            );
                            stripe.setupNewStripe(this.stripeKey)
                                .catch(error => {
                                    this.form.form.querySelector("[data-error='general-error']").style.display = "block";
                                });
                            break;
                        case "refresh":
                            let redirect = redirectUrl || window.location.href;
                            const redirectTo = (url) => window.location.href = url;

                            postJson("/auth/login", {
                                email: this.data.email,
                                password: this.data.password,
                                redirect: redirect
                            }).then(() => {
                                if(window.location.href.includes("create") && this.params) {
                                    $.ajax({
                                        method: "POST",
                                        url: "/api/library",
                                        data: this.params,
                                    }).done(function(data) {
                                        document.cookie = "sess_ntf='Texture saved successfully'; path=/; expires=" + new Date(new Date().setSeconds(new Date().getSeconds() + 30)).toUTCString() + ";";
                                        redirect = "/create?save=" + data;
                                        redirectTo(redirect);
                                    });
                                } else if(window.location.href.includes("textures?app=")) {
                                    document.cookie = "sess_ntf='Logged in successfully'; path=/; expires=" + new Date(new Date().setSeconds(new Date().getSeconds() + 30)).toUTCString() + ";";
                                    redirectTo(redirect);
                                } else if(window.location.href.includes("textures") && this.params) {
                                    postJson("/api/query", {
                                        table: "saves",
                                        action: "insert",
                                        auth: true,
                                        values: {
                                            user: this.userId,
                                            name: this.params.name,
                                            category: this.params.category,
                                            width_mm: this.params.width_mm,
                                            imgurl: this.params.imgurl,
                                            texture: this.params.id,
                                            params: JSON.stringify(this.params.params),
                                            color: this.params.color
                                        }
                                    }).then(() => {
                                        document.cookie = "sess_ntf='Texture saved successfully'; path=/; expires=" + new Date(new Date().setSeconds(new Date().getSeconds() + 30)).toUTCString() + ";";
                                        redirectTo(redirect);
                                    });
                                } else {
                                    redirectTo(redirect);
                                }
                            });
                            break;
                        case "home": default:
                            postJson("/auth/login", {
                                email: this.data.email,
                                password: this.data.password,
                                redirect: redirectUrl || "/"
                            }).then(response => {
                                document.cookie = "sess_ntf='Logged in successfully'; path=/; expires=" + new Date(new Date().setSeconds(new Date().getSeconds() + 30)).toUTCString() + ";";
                                window.location.href = response.redirect;
                            });
                    }
                    break;

                default:
                    // unknown error
                    this.form.form.querySelector("[data-error='general-error']").style.display = "block";
                    break;
            }
        });
    }
}
