import CustomerCard from "./CustomerCard";

export default function CustomerGrid({

    customers,

    onOpen,

    onDelete,

    onInvoice

}) {

    if (!customers.length) {

        return (

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body text-center py-5">

                    <h4>

                        No Customers Found

                    </h4>

                    <p className="text-muted">

                        Create your first customer to begin invoicing.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="row g-4">

            {customers.map(customer => (

                <div
                    className="col-lg-4 col-md-6"
                    key={customer.id}>
                    <CustomerCard

                        customer={customer}

                        onOpen={onOpen}

                        onDelete={onDelete}

                        onInvoice={onInvoice}

                    />

                </div>

            ))}

        </div>

    );

}