import "./DocumentAddresses.css";

export default function DocumentAddresses({
    document,
    customer
}) {
    return (
        <div className="document-addresses">

            {/* BILL TO */}

            <div className="address-card">

                <div className="address-title">
                    BILL TO
                </div>

                <h3 className="address-name">
                    {customer?.companyName ||
                        document.customerName}
                </h3>

                {customer?.contactPerson && (
                    <p>{customer.contactPerson}</p>
                )}

                {document.billingAddress ? (
                    <p>{document.billingAddress}</p>
                ) : (
                    <>
                        {customer?.address && (
                            <p>{customer.address}</p>
                        )}

                        {customer?.city && (
                            <p>
                                {customer.city}
                                {customer.state
                                    ? `, ${customer.state}`
                                    : ""}
                            </p>
                        )}

                        {customer?.country && (
                            <p>{customer.country}</p>
                        )}
                    </>
                )}

                {customer?.phone && (
                    <p>
                        <strong>Phone:</strong>{" "}
                        {customer.phone}
                    </p>
                )}

                {customer?.email && (
                    <p>
                        <strong>Email:</strong>{" "}
                        {customer.email}
                    </p>
                )}

                {customer?.taxNumber && (
                    <p>
                        <strong>Tax No:</strong>{" "}
                        {customer.taxNumber}
                    </p>
                )}
            </div>

            {/* SHIP TO */}

            <div className="address-card">

                <div className="address-title">
                    SHIP TO
                </div>

                <h3 className="address-name">
                    {customer?.companyName ||
                        document.customerName}
                </h3>

                <p>
                    {document.shippingAddress ||
                        document.billingAddress}
                </p>

                {document.deliveryMethod && (
                    <p>
                        <strong>Method:</strong>{" "}
                        {document.deliveryMethod}
                    </p>
                )}

                {document.deliveryDate && (
                    <p>
                        <strong>Delivery:</strong>{" "}
                        {new Date(
                            document.deliveryDate
                        ).toLocaleDateString()}
                    </p>
                )}

                {document.trackingNumber && (
                    <p>
                        <strong>Tracking:</strong>{" "}
                        {document.trackingNumber}
                    </p>
                )}
            </div>

        </div>
    );
}