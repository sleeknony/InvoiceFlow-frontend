const DEFAULT_LOCALE = "en-NG";

export default function formatCurrency(
    value = 0,
    currencyCode = "NGN",
    options = {}
) {
    const {
        locale = DEFAULT_LOCALE,
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
        currencyDisplay = "symbol" // symbol | code | narrowSymbol | name
    } = options;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode || "NGN",
        currencyDisplay,
        minimumFractionDigits,
        maximumFractionDigits
    }).format(Number(value ?? 0));
}