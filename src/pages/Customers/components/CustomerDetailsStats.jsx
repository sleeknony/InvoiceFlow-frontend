export default function CustomerDetailsStats({

    details

}) {

    const cards = [

        {

            title: "Outstanding",

            value: details.outstandingBalance,

            color: "danger"

        },

        {

            title: "Invoiced",

            value: details.totalInvoiced,

            color: "primary"

        },

        {

            title: "Paid",

            value: details.totalPaid,

            color: "success"

        },

        {

            title: "Invoices",

            value: details.invoiceCount,

            color: "warning"

        }

    ];

    return (

        <div className="row g-3 mb-4">

            {

                cards.map(card => (

                    <div
                        key={card.title}
                        className="col-md-3"
                    >

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body">

                                <div
                                    className={`text-${card.color} small fw-semibold`}
                                >

                                    {card.title}

                                </div>

                                <h3 className="fw-bold mt-2">

                                    {card.value}

                                </h3>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}