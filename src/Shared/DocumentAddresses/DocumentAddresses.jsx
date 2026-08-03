import "./DocumentAddresses.css";

import PrintableSection
    from "../../renderer/PrintableSection";

import {
    useRenderDocument
} from "../../renderer/RenderContext";
import { useDocument } from "../../renderer/RenderContext";

export default function DocumentAddresses() {

    const {

        company,

        customer,

        flags

    } = useDocument();

    return (

        <PrintableSection type="addresses">

            <section className="address-grid">

                <article className="address-card">

                    <div className="address-title">

                        FROM

                    </div>

                    <div className="address-body">

                        <strong>

                            {company.name}

                        </strong>

                        {company.address &&
                            <div>{company.address}</div>}

                        {company.phone &&
                            <div>{company.phone}</div>}

                        {company.email &&
                            <div>{company.email}</div>}

                    </div>

                </article>

                <article className="address-card">

                    <div className="address-title">

                        BILL TO

                    </div>

                    <div className="address-body">

                        <strong>

                            {customer.name}

                        </strong>

                        {customer.billing.exists &&
                            <div>

                                {customer.billing.address}

                            </div>}

                        {customer.email &&
                            <div>

                                {customer.email}

                            </div>}

                    </div>

                </article>

                {flags.showShippingAddress && (

                    <article className="address-card">

                        <div className="address-title">

                            SHIP TO

                        </div>

                        <div className="address-body">

                            <strong>

                                {customer.name}

                            </strong>

                            <div>

                                {customer.shipping.address}

                            </div>

                        </div>

                    </article>

                )}

            </section>

        </PrintableSection>

    );

}