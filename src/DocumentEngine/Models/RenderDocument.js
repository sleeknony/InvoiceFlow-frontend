export default class RenderDocument {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    get isDraft() {
        return this.meta?.status === "Draft";
    }

    get isApproved() {
        return this.meta?.status === "Approved";
    }

    get isSent() {
        return this.meta?.status === "Sent";
    }

    get isPaid() {
        return this.meta?.status === "Paid";
    }

    get isCancelled() {
        return this.meta?.status === "Cancelled";
    }

    get isOverdue() {
        return this.meta?.status === "Overdue";
    }

    get hasShippingAddress() {
        return this.customer?.shipping?.exists === true;
    }

    get hasPaymentInstructions() {
        return Boolean(this.payment?.bank?.instructions);
    }

    get hasApprovalWorkflow() {
        return this.approvals?.enabled === true;
    }

    get hasQrCode() {
        return this.features?.showQrCode === true;
    }

    get balanceDue() {
        return this.payment?.balanceDue ?? 0;
    }

    get amountPaid() {
        return this.payment?.amountPaid ?? 0;
    }

    get watermark() {

        switch (this.meta.status?.toLowerCase()) {

            case "draft":

                return "DRAFT";

            case "paid":

                return "PAID";

            case "void":

                return "VOID";

            case "cancelled":

                return "CANCELLED";

            case "overdue":

                return "OVERDUE";

            case "issued":

                return "ISSUED";

            case "sent":

                return "SENT"; 

            case "rejected":

                return "REJECTED"; 

            case "PartiallyPaid":

                return "PARTIALLYPAID"; 
                                        
            case "converted":

                return "CONVERTED"; 
                                               
            case "approved":

                return "APPROVED"; 

                                                        

            default:

                return null;

        }

    }
}