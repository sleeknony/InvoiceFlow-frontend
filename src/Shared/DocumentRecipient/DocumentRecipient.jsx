import "./DocumentRecipient.css";

export default function DocumentRecipient({
    document,
    customer
}) {

    return (

        <div className="document-recipient">

            <div className="recipient-card">

                <div className="recipient-title">
                    BILL TO
                </div>

                <h3 className="recipient-name">
                    {customer?.companyName || document.customerName}
                </h3>

                {customer?.contactPerson && (
                    <p>{customer.contactPerson}</p>
                )}

                {customer?.address && (
                    <p>{customer.address}</p>
                )}

                {customer?.city && (
                    <p>
                        {customer.city}
                        {customer.state ? `, ${customer.state}` : ""}
                    </p>
                )}

                {customer?.country && (
                    <p>{customer.country}</p>
                )}

                {customer?.phone && (
                    <p>
                        <strong>Phone:</strong> {customer.phone}
                    </p>
                )}

                {customer?.email && (
                    <p>
                        <strong>Email:</strong> {customer.email}
                    </p>
                )}

                {customer?.taxNumber && (
                    <p>
                        <strong>Tax No:</strong> {customer.taxNumber}
                    </p>
                )}

                {customer?.registrationNumber && (
                    <p>
                        <strong>RC No:</strong> {customer.registrationNumber}
                    </p>
                )}

            </div>

        </div>

    );

}