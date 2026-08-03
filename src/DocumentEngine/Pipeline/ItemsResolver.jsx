class ItemResolver {

    toNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }

    resolve(document = {}) {

        const rows = (document.items ?? []).map((item, index) => ({

            id:
                item.id ?? index,

            description:
                item.description ?? "",

            quantity:
                this.toNumber(item.quantity),

            unitPrice:
                this.toNumber(item.unitPrice),

            discount:
                this.toNumber(item.discountPercent),

            tax:
                this.toNumber(item.taxRatePercent),

            total:
                this.toNumber(item.lineTotal)

        }));

        return {

            currency:
                document.currency ?? "",

            rows,

            hasDiscount:
                rows.some(row => row.discount > 0),

            hasTax:
                rows.some(row => row.tax > 0),

            count:
                rows.length

        };

    }

}

export default new ItemResolver();