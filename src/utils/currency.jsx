export default function currencySymbol(
    value = 0,
    currency = "NGN"
) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "NGN"
    }).format(value ?? 0);
}
