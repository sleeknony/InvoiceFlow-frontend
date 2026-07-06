export default function DocumentStatusBadge({
    status
}) {
    const colors = {
        Draft: "secondary",
        Issued: "primary",
        Approved:"success",
        Sent: "info",
        PartiallyPaid: "warning",
        Paid: "success",
        Overdue: "danger",
        Cancelled: "dark",
        Void: "secondary",
        Rejected:"danger"

    };

    return (
        <span
            className={`badge bg-${colors[status]}`}
        >
            {status}
        </span>
    );
}