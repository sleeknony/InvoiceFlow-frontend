class TotalsResolver {

    toNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    resolve(document = {}) {

        const total =
            this.toNumber(document.total);

        const amountPaid =
            this.toNumber(document.amountPaid);

        const calculatedBalance =
            Math.max(total - amountPaid, 0);

        const balanceDue =
            document.balanceDue != null
                ? this.toNumber(document.balanceDue)
                : calculatedBalance;

        const status =
            String(document.status ?? "").toLowerCase();

        let balanceStatus = "Outstanding";

        if (balanceDue <= 0) {
            balanceStatus = "Paid";
        }
        else if (status === "overdue") {
            balanceStatus = "Overdue";
        }

        return {

            currency:
                document.currency ?? "NGN",

            subtotal:
                this.toNumber(document.subTotal),

            discount:
                this.toNumber(document.discountAmount),

            tax:
                this.toNumber(document.taxAmount),

            shipping:
                this.toNumber(document.shippingCost),

            total,

            amountPaid,

            balanceDue,

            balanceStatus

        };

    }

}

export default new TotalsResolver();