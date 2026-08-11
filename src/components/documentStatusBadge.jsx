export default function DocumentStatusBadge({ status }) {

    const map = {
        Draft: "draft",
        Issued: "issued",
        Approved: "approved",
        Sent: "sent",
        PartiallyPaid: "partial",
        Paid: "paid",
        Overdue: "overdue",
        Cancelled: "cancelled",
        Void: "void",
        Rejected: "rejected",
        Converted: "converted",
        PendingApproval: "Pending Approval"
   
    };

    return (
        <span
            className={`document-status-badge ${map[status] ?? "default"}`}
        >
            {status}
        </span>
    );
}