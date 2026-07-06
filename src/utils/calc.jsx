export function calcLineTotal({
    quantity,
    unitPrice,
    discountPercent,
    taxRatePercent
}) {
    const q = Number(quantity) || 0;
    const p = Number(unitPrice) || 0;

    const discPct = Number(discountPercent) || 0;
    const taxPct = Number(taxRatePercent) || 0;

    const base = q * p;

    const discount = (discPct / 100) * base;

    const afterDiscount = base - discount;

    const tax = (taxPct / 100) * afterDiscount;

    return {
        base,
        discount,
        tax,
        total: afterDiscount + tax
    };
}

//export function calcTotals(items) {
//    let subTotal = 0;
//    let discountTotal = 0;
//    let taxTotal = 0;
//    let total = 0;


//    for (const item of items) {

//        const r = calcLineTotal(item);

//        subTotal += r.base;
//        discountTotal += r.discount;
//        taxTotal += r.tax;
//        total += r.total;
//    }

//    return {
//        subTotal,
//        discountTotal,
//        taxTotal,
//        total
//    };
//}


export function calcTotals(items, shippingCost = 0)
{
    let subTotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let total = 0;

    for (const item of items) {
        const r = calcLineTotal(item);

        subTotal += r.base;
        discountTotal += r.discount;
        taxTotal += r.tax;
        total += r.total;
    }

    total += Number(shippingCost) || 0;

    return {
        subTotal,
        discountTotal,
        taxTotal,
        shippingCost: Number(shippingCost) || 0,
        total
    };
}