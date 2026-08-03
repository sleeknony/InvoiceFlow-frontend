import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCustomerDetails } from "../../services/customerService";

import CustomerDetailsHeader from "./components/CustomerDetailsHeader";
import CustomerDetailsStats from "./components/CustomerDetailsStats";
import CustomerDetailsOverview from "./components/CustomerDetailsOverview";
import CustomerDetailsQuickActions from "./components/CustomerDetailsQuickActions";
import CustomerRecentDocuments from "./components/CustomerRecentDocuments";
import CustomerTabs from "./components/CustomerTabs";
import "./components/CustomerDetails.css";

import toast from "react-hot-toast";

export default function CustomerDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [details, setDetails] = useState(null);
    const [activeTab, setActiveTab] =  useState("overview");

    useEffect(() => {

        loadCustomer();

    }, [id]);

    async function loadCustomer() {

        try {

            setLoading(true);

            const data =
                await getCustomerDetails(id);

            setDetails(data);

        }

        catch {

            toast.error(
                "Unable to load customer."
            );

            navigate("/customers");

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="text-center py-5">

                Loading...

            </div>

        );

    }

    return (

        <div className="container-fluid">

            {/* Header */}

            <CustomerDetailsHeader

                customer={details.customer}

                onBack={() =>

                    navigate("/customers")

                }

                onEdit={() => {

                    // We'll wire the edit modal next.

                }}

            />

            {/* Statistics */}

            <CustomerDetailsStats
                details={details}
            />

            {/* Tabs */}

            <CustomerTabs

                activeTab={activeTab}

                onChange={setActiveTab}

            />

            <div className="row mt-4">

                <div className="col-lg-8">

                    {
                        activeTab === "overview" && (

                            <CustomerDetailsOverview
                                customer={details.customer}
                            />

                        )
                    }

                    {
                        activeTab === "documents" && (

                            <CustomerRecentDocuments
                                documents={details.recentDocuments}
                            />

                        )
                    }

                    {
                        activeTab === "statement" && (

                            <div className="card border-0 shadow-sm rounded-4">

                                <div className="card-body text-center py-5">

                                    Customer Statement
                                    <br />
                                    Coming Soon

                                </div>

                            </div>

                        )
                    }

                    {
                        activeTab === "activity" && (

                            <div className="card border-0 shadow-sm rounded-4">

                                <div className="card-body text-center py-5">

                                    Customer Activity
                                    <br />
                                    Coming Soon

                                </div>

                            </div>

                        )
                    }

                </div>

                <div className="col-lg-4">

                    <div className="customer-sidebar">

                        <CustomerDetailsQuickActions
                            customerId={details.customer.id}
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}