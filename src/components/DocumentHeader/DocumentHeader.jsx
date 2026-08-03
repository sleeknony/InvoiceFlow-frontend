import {
    FiArrowLeft,
    FiEye,
    FiMail,
    FiSave,
    FiFileText
} from "react-icons/fi";

export default function DocumentHeader({

    mode,

    documentType,

    documentNumber,

    logo,

    loading,

    onBack,

    onSave,

    onPreview,

    onSend

}) {

    const title =
        mode === "create"
            ? `Create ${documentType}`
            : `Edit ${documentType}`;

    return (

        <div
            className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

                <div className="row align-items-center">

                    <div className="col-lg-7">

                        <div className="d-flex align-items-center">

                            <div
                                className="me-4 d-flex align-items-center justify-content-center rounded-3 bg-light"
                                style={{
                                    width: 90,
                                    height: 90
                                }}>

                                {logo ? (

                                    <img
                                        src={logo}
                                        alt="Company Logo"
                                        style={{
                                            maxWidth: "80%",
                                            maxHeight: "80%",
                                            objectFit: "contain"
                                        }}
                                    />

                                ) : (

                                    <FiFileText
                                        size={36}
                                        className="text-secondary"
                                    />

                                )}

                            </div>

                            <div>

                                <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-2">

                                    Draft

                                </span>

                                <h2 className="fw-bold mb-1">

                                    {title}

                                </h2>

                                <div className="text-muted">

                                    {documentNumber ||
                                        "Document number will be generated automatically"}

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="col-lg-5">

                        <div className="d-flex justify-content-lg-end mt-4 mt-lg-0 gap-2 flex-wrap">

                            <button
                                className="btn btn-light"
                                onClick={onBack}>

                                <FiArrowLeft className="me-2" />

                                Back

                            </button>

                            <button
                                className="btn btn-outline-primary"
                                onClick={onPreview}>

                                <FiEye className="me-2" />

                                Preview

                            </button>

                            <button
                                className="btn btn-success"
                                disabled={loading}
                                onClick={onSave}>

                                <FiSave className="me-2" />

                                {loading
                                    ? "Saving..."
                                    : "Save"}

                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={onSend}>

                                <FiMail className="me-2" />

                                Send

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}