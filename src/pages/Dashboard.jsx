import PageHeader from "../components/PageHeader.jsx";

//export default function Dashboard() {
//    return (
//        <div>
//            <PageHeader
//                title="Dashboard"
//                subtitle="Overview of your documents and customers (API will power this later)."
//            />

//            <div className="grid">
//                <div className="card">
//                    <div className="card-title">Documents</div>
//                    <div className="big-number">0</div>
//                    <div className="muted">Created (demo)</div>
//                </div>
//                <div className="card">
//                    <div className="card-title">Customers</div>
//                    <div className="big-number">0</div>
//                    <div className="muted">Saved (demo)</div>
//                </div>
//                <div className="card">
//                    <div className="card-title">Outstanding</div>
//                    <div className="big-number">₦0.00</div>
//                    <div className="muted">Balance due (demo)</div>
//                </div>
//            </div>
//        </div>
//    );
//}


export default function Dashboard() {
    return (
        <div>

            <h3 className="mb-4 fw-bold">Dashboard</h3>

            <div className="row g-3">

                <div className="col-md-4">
                    <div className="card shadow-sm p-3">
                        <h6>Total Invoices</h6>
                        <h2 className="fw-bold">120</h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3">
                        <h6>Paid</h6>
                        <h2 className="fw-bold text-success">85</h2>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm p-3">
                        <h6>Pending</h6>
                        <h2 className="fw-bold text-warning">35</h2>
                    </div>
                </div>

            </div>

        </div>
    );
}