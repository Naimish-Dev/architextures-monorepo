class UserPlanData
{
    constructor({plan = "", planQuantity = 1, stripeKey}) {
        this.plan = plan;
        this.planQuantity = planQuantity;
        this.stripeKey = stripeKey;
    }

    getData()
    {
        return {
            plan: this.plan,
            planQuantity: this.planQuantity,
            stripeKey: this.stripeKey
        }
    }
}