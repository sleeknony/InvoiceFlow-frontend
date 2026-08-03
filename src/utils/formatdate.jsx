export default function formatDate(
    value,
    options = {}
) {
    if (!value)
        return "";

    const {
        locale = "en-NG",
        includeTime = false
    } = options;

    const date = new Date(value);

    return new Intl.DateTimeFormat(
        locale,
        includeTime
            ? {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
            : {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
    ).format(date);
}