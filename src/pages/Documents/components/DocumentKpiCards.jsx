import {
    FiDollarSign,
    FiCreditCard,
    FiAlertCircle,
    FiCalendar
} from "react-icons/fi";

import currencySymbol from "../../../utils/currency";
import "./DocumentViewer.css";

export default function DocumentKPICards({

    document,
    totalPaid,
    remainingBalance
}) {

   
    if (!document)
        return null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dateCard = (() => {

        let title = "Issue Date";
        let date = document.issueDate;

        switch (document.type) {

            case "Invoice":
            case "TaxInvoice":
                title = "Due Date";
                date = document.dueDate;
                break;

            case "Quote":
            case "ProformaInvoice":
                title = "Valid Until";
                date = document.validityDate;
                break;

            case "DeliveryNote":
                title = "Delivery Date";
                date = document.deliveryDate;
                break;
        }

        const displayDate =
            date
                ? new Date(date)
                : null;

        if (displayDate)
            displayDate.setHours(0, 0, 0, 0);

        const daysLate =
            displayDate
                ? Math.floor(
                    (today - displayDate) /
                    (1000 * 60 * 60 * 24)
                )
                : 0;

        // Only invoices become overdue.
        if (
            (document.type === "Invoice" ||
                document.type === "TaxInvoice") &&
            (
                document.status === "Overdue" ||
                (
                    daysLate > 0 &&
                    remainingBalance > 0
                )
            )
        ) {

            return {

                title: "Overdue",

                value:
                    `${daysLate} day${daysLate === 1 ? "" : "s"}`,

                icon: <FiAlertCircle />,

                color: "danger"

            };

        }

        if (document.status === "Paid") {

            return {

                title: "Status",

                value: "Fully Paid",

                icon: <FiCreditCard />,

                color: "success"

            };

        }

        return {

            title,

            value:
                displayDate
                    ? displayDate.toLocaleDateString()
                    : "--",

            icon: <FiCalendar />,

            color: "info"

        };

    })();

    const cards = [
        {
            title: "Document Total",
            value: currencySymbol(
                document.total,
                document.currency
            ),
            icon: <FiDollarSign />,
            color: "primary"
        },
        {
            title: "Amount Paid",
            value: currencySymbol(
                totalPaid,
                document.currency
            ),
            icon: <FiCreditCard />,
            color: "success"
        },
        {
            title: "Outstanding",
            value: currencySymbol(
                remainingBalance,
                document.currency
            ),
            icon: <FiAlertCircle />,
            color:
                remainingBalance > 0
                    ? "warning"
                    : "success"
        },

        dateCard
    ];

    return (

        <div className="dv-kpi-grid">

            {cards.map(card => (

                <div
                    key={card.title}
                    className="dv-kpi-card"
                >

                    <div
                        className={`dv-kpi-icon dv-${card.color}`}
                    >
                        {card.icon}
                    </div>

                    <div className="dv-kpi-content">

                        <span className="dv-kpi-title">
                            {card.title}
                        </span>

                        <h3>
                            {card.value}
                        </h3>

                    </div>

                </div>

            ))}

        </div>

    );

}