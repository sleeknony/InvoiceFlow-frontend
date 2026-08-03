class PaymentResolver {

    toNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    resolve(
        document = {},
        payments = [],
        company = {}
    ) {

        const history = (payments ?? []).map((payment, index) => ({

            id:
                payment.id ?? index,

            amount:
                this.toNumber(payment.amount),

            method:
                payment.method ?? "",

            reference:
                payment.reference ?? "",

            date:
                payment.paymentDate ?? "",

            notes:
                payment.notes ?? ""

        }));

        const total = this.toNumber(document.total);
        const amountPaid = this.toNumber(document.amountPaid);

        return {

            amountPaid,

            balanceDue:
                document.balanceDue ??
                Math.max(total - amountPaid, 0),

            history,

            bank:
                company.bank ?? {}

        };

    }

}

export default new PaymentResolver();