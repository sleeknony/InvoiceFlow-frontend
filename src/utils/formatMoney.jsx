//export function formatMoney(amount = 0, currency = "NGN") {
//    const safe = Number.isFinite(amount) ? amount : 0;
//    return new Intl.NumberFormat("en-NG", {
//        style: "currency",
//        currency,
//        maximumFractionDigits: 2,
//    }).format(safe);
//}

//export function uuid() {
//    // Simple client-side id for demo. Replace with backend GUID later.
//    return crypto.randomUUID();
//}
export default function formatMoney(value) {

    return Number(value ?? 0).toLocaleString(undefined, {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    });

}