import {

    FiUser,

    FiMail,

    FiPhone,

    FiMapPin,

    FiCreditCard,

    FiFileText

} from "react-icons/fi";

export default function CustomerDetailsOverview({

    customer

}) {

    return (

        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                <h4 className="fw-bold mb-4">

                    Customer Information

                </h4>

                <div className="row gy-4">

                    <div className="col-md-6">

                        <small className="text-muted">

                            Contact Person

                        </small>

                        <div>

                            <FiUser className="me-2" />

                            {customer.contactPerson || "-"}

                        </div>

                    </div>

                    <div className="col-md-6">

                        <small className="text-muted">

                            Email

                        </small>

                        <div>

                            <FiMail className="me-2" />

                            {customer.email || "-"}

                        </div>

                    </div>

                    <div className="col-md-6">

                        <small className="text-muted">

                            Phone

                        </small>

                        <div>

                            <FiPhone className="me-2" />

                            {customer.phone || "-"}

                        </div>

                    </div>

                    <div className="col-md-6">

                        <small className="text-muted">

                            Tax Number

                        </small>

                        <div>

                            <FiCreditCard className="me-2" />

                            {customer.taxNumber || "-"}

                        </div>

                    </div>

                    <div className="col-12">

                        <small className="text-muted">

                            Address

                        </small>

                        <div>

                            <FiMapPin className="me-2" />

                            {

                                [

                                    customer.address,

                                    customer.city,

                                    customer.state,

                                    customer.country

                                ]

                                    .filter(Boolean)

                                    .join(", ")

                                || "-"

                            }

                        </div>

                    </div>

                    <div className="col-12">

                        <small className="text-muted">

                            Notes

                        </small>

                        <div>

                            <FiFileText className="me-2" />

                            {customer.notes || "-"}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}