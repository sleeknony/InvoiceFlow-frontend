import "./ModernAddresses.css";

import { useDocument } from "../../../../RenderContext";

export default function ModernAddresses() {

    const {

        company,
        customer

    } = useDocument();

    const hasShipping =
        customer.shipping?.exists;

    return (

        <section
            className={
                `modern-addresses ${hasShipping
                    ? "three-columns"
                    : "two-columns"
                }`
            }
        >

            {/* ===========================
                    FROM
            ============================ */}

            <div className="modern-address-card">

                <div className="modern-address-title">

                    FROM

                </div>

                <div className="modern-address-name">

                    {company.name}

                </div>

                {

                    company.address && (

                        <div className="modern-address-line">

                            {company.address}

                        </div>

                    )

                }

                {

                    company.phone && (

                        <div className="modern-address-line">

                            {company.phone}

                        </div>

                    )

                }

                {

                    company.email && (

                        <div className="modern-address-line">

                            {company.email}

                        </div>

                    )

                }

                {

                    company.website && (

                        <div className="modern-address-line">

                            {company.website}

                        </div>

                    )

                }

            </div>

            {/* ===========================
                    BILL TO
            ============================ */}

            <div className="modern-address-card">

                <div className="modern-address-title">

                    BILL TO

                </div>

                <div className="modern-address-name">

                    {

                        customer.company ||

                        customer.name

                    }

                </div>

                {

                    customer.company &&

                    customer.name && (

                        <div className="modern-address-line">

                            {customer.name}

                        </div>

                    )

                }

                {

                    customer.billing?.exists && (

                        <div className="modern-address-line">

                            {customer.billing.address}

                        </div>

                    )

                }

                {

                    customer.phone && (

                        <div className="modern-address-line">

                            {customer.phone}

                        </div>

                    )

                }

                {

                    customer.email && (

                        <div className="modern-address-line">

                            {customer.email}

                        </div>

                    )

                }

            </div>

            {/* ===========================
                    SHIP TO
            ============================ */}

            {

                hasShipping && (

                    <div className="modern-address-card">

                        <div className="modern-address-title">

                            SHIP TO

                        </div>

                        <div className="modern-address-name">

                            {

                                customer.company ||

                                customer.name

                            }

                        </div>

                        {

                            customer.shipping.address && (

                                <div className="modern-address-line">

                                    {customer.shipping.address}

                                </div>

                            )

                        }

                    </div>

                )

            }

        </section>

    );

}