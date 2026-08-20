import { useRef, useState } from "react";
import {FiArrowLeft,FiCheckCircle, FiDownload, FiFile, FiUploadCloud, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { downloadBulkImportTemplate, previewBulkImport, importBulkCustomers } from "../../services/customerService"; import "./BulkCustomerImport.css";

export default function BulkCustomerImport() {

    const navigate = useNavigate();

    const [importing, setImporting] =
        useState(false);

    const fileInputRef =
        useRef(null);

    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [dragging, setDragging] =
        useState(false);


    // =========================================================
    // FILE VALIDATION
    // =========================================================

    function validateFile(selectedFile) {

        if (!selectedFile) {
            return false;
        }

        const extension =
            selectedFile.name
                .split(".")
                .pop()
                ?.toLowerCase();

        if (extension !== "xlsx") {

            toast.error(
                "Only Excel (.xlsx) files are supported."
            );

            return false;
        }

        return true;
    }


    // =========================================================
    // SELECT FILE
    // =========================================================

    function handleFileSelect(selectedFile) {

        if (!validateFile(selectedFile)) {
            return;
        }

        setFile(selectedFile);

        setPreview(null);
    }


    function handleInputChange(event) {

        const selectedFile =
            event.target.files?.[0];

        handleFileSelect(
            selectedFile
        );
    }


    // =========================================================
    // DRAG & DROP
    // =========================================================

    function handleDragOver(event) {

        event.preventDefault();

        setDragging(true);
    }


    function handleDragLeave(event) {

        event.preventDefault();

        setDragging(false);
    }


    function handleDrop(event) {

        event.preventDefault();

        setDragging(false);

        const droppedFile =
            event.dataTransfer.files?.[0];

        handleFileSelect(
            droppedFile
        );
    }


    // =========================================================
    // REMOVE FILE
    // =========================================================

    function handleRemoveFile() {

        setFile(null);

        setPreview(null);

        if (fileInputRef.current) {

            fileInputRef.current.value =
                "";
        }
    }


    // =========================================================
    // DOWNLOAD TEMPLATE
    // =========================================================

    async function handleDownloadTemplate() {

        try {

            await downloadBulkImportTemplate();

            toast.success(
                "Customer import template downloaded."
            );

        }
        catch (err) {

            console.error(
                "Template download error:",
                err
            );

            toast.error(
                "Unable to download the customer import template."
            );
        }
    }


    // =========================================================
    // PREVIEW
    // =========================================================

    async function handlePreview() {

        if (!file) {

            toast.error(
                "Please select an Excel file first."
            );

            return;
        }

        try {

            setLoading(true);

            const result = await previewBulkImport(file);

            setPreview(result);

            toast.success(
                "Customer import preview generated successfully."
            );

        }
        catch (err) {

            console.error(
                "Customer bulk import preview error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to preview the file.";

            toast.error(message);

            setPreview(null);
        }
        finally {

            setLoading(false);
        }
    }

    async function handleImport() {

        if (!file) {

            toast.error(
                "Please select an Excel file."
            );

            return;
        }

        if (!preview) {

            toast.error(
                "Please preview the file first."
            );

            return;
        }

        const valid =
            preview.validRows ??
            (preview.rows ?? [])
                .filter(
                    row => row.isValid
                ).length;

        if (valid === 0) {

            toast.error(
                "There are no valid customers to import."
            );

            return;
        }

        try {

            setImporting(true);

            const result =
                await importBulkCustomers(
                    file
                );

            // -----------------------------------------------------
            // Nothing imported
            // -----------------------------------------------------

            if (result.importedRows === 0) {

                toast.error(
                    "No customers were imported."
                );

                return;
            }

            // -----------------------------------------------------
            // Everything imported
            // -----------------------------------------------------

            if (
                result.importedRows ===
                result.totalRows
            ) {

                toast.success(
                    `${result.importedRows} customer${result.importedRows === 1
                        ? ""
                        : "s"
                    } imported successfully.`
                );

            }

            // -----------------------------------------------------
            // Partial import
            // -----------------------------------------------------

            else {

                toast.success(
                    `${result.importedRows} customer${result.importedRows === 1
                        ? ""
                        : "s"
                    } imported. ${result.skippedRows
                    } row${result.skippedRows === 1
                        ? ""
                        : "s"
                    } skipped.`
                );
            }

            // -----------------------------------------------------
            // Return to customer list
            // -----------------------------------------------------

            navigate("/customers");

        }
        catch (err) {

            console.error(
                "Customer bulk import error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to import customers.";

            toast.error(
                message
            );
        }
        finally {

            setImporting(false);
        }
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="bulk-customer-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bulk-customer-header">

                <div>

                    <button
                        type="button"
                        className="bulk-customer-back"
                        onClick={() =>
                            navigate("/customers")
                        }
                    >

                        <FiArrowLeft />

                        Back to Customers

                    </button>


                    <h1>
                        Bulk Import Customers
                    </h1>


                    <p>
                        Upload an Excel file to import
                        multiple customers at once.
                    </p>

                </div>

            </div>


            {/* =================================================
                UPLOAD CARD
            ================================================= */}

            {!preview && (

                <div className="bulk-customer-card">

                    <div className="bulk-customer-card-header">

                        <div>

                            <h2>
                                Upload Customer File
                            </h2>

                            <p>
                                Use the InvoiceFlow customer
                                import template.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="bulk-customer-template-button"
                            onClick={
                                handleDownloadTemplate
                            }
                            disabled={loading}
                        >

                            <FiDownload />

                            Download Template

                        </button>

                    </div>


                    {/* =================================================
                        DROP ZONE
                    ================================================= */}

                    <div
                        className={
                            dragging
                                ? "bulk-customer-upload-zone dragging"
                                : "bulk-customer-upload-zone"
                        }
                        onDragOver={
                            handleDragOver
                        }
                        onDragLeave={
                            handleDragLeave
                        }
                        onDrop={
                            handleDrop
                        }
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx"
                            hidden
                            onChange={
                                handleInputChange
                            }
                        />


                        <div className="bulk-customer-upload-icon">

                            <FiUploadCloud />

                        </div>


                        <h3>

                            {dragging
                                ? "Drop your file here"
                                : "Drag & drop your Excel file here"}

                        </h3>


                        <p>
                            or
                        </p>


                        <button
                            type="button"
                            className="bulk-customer-browse-button"
                            onClick={(event) => {

                                event.stopPropagation();

                                fileInputRef.current?.click();

                            }}
                        >

                            Browse Files

                        </button>


                        <span>
                            XLSX files only
                        </span>

                    </div>


                    {/* =================================================
                        SELECTED FILE
                    ================================================= */}

                    {file && (

                        <div className="bulk-customer-selected-file">

                            <div className="bulk-customer-file-icon">

                                <FiFile />

                            </div>


                            <div className="bulk-customer-file-info">

                                <strong>
                                    {file.name}
                                </strong>

                                <span>

                                    {(
                                        file.size /
                                        1024
                                    ).toFixed(1)}

                                    {" "}
                                    KB

                                </span>

                            </div>


                            <button
                                type="button"
                                className="bulk-customer-remove-file"
                                onClick={
                                    handleRemoveFile
                                }
                                disabled={loading}
                            >

                                <FiXCircle />

                            </button>

                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="bulk-customer-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                                navigate("/customers")
                            }
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handlePreview}
                            disabled={
                                !file ||
                                loading
                            }
                        >

                            {loading
                                ? "Checking File..."
                                : "Preview Import"}

                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
                PREVIEW
            ================================================= */}

            {preview && (

                <CustomerPreview
                    preview={preview}
                    file={file}
                    onBack={() =>
                        setPreview(null)
                    }
                    onChooseAnother={
                        handleRemoveFile
                    }
                    onImport={
                        handleImport
                    }
                    importing={
                        importing
                    }
                />

            )}

        </div>
    );
}


// =============================================================
// CUSTOMER PREVIEW
// =============================================================

function CustomerPreview({
    preview,
    file,
    onBack,
    onChooseAnother,
    onImport,
    importing
}) {

    const rows =
        preview.rows ?? [];


    const total =
        preview.totalRows ??
        rows.length;


    const valid =
        preview.validRows ??
        rows.filter(
            x => x.isValid
        ).length;


    const invalid =
        preview.invalidRows ??
        rows.filter(
            x => !x.isValid
        ).length;


    return (

        <div className="bulk-customer-preview-container">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bulk-customer-preview-header">

                <div>

                    <h2>
                        Import Preview
                    </h2>

                    <p>
                        Review the customer records
                        before importing them.
                    </p>


                    {file && (

                        <div className="bulk-customer-preview-file">

                            <FiFile />

                            {file.name}

                        </div>

                    )}

                </div>


                <button
                    type="button"
                    className="bulk-customer-change-file"
                    onClick={
                        onChooseAnother
                    }
                    disabled={importing}
                >
                    Choose Another File
                </button>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="bulk-customer-summary">

                <div className="bulk-customer-summary-card">

                    <span>
                        Total Rows
                    </span>

                    <strong>
                        {total}
                    </strong>

                </div>


                <div className="bulk-customer-summary-card valid">

                    <div>

                        <FiCheckCircle />

                        <span>
                            Valid
                        </span>

                    </div>

                    <strong>
                        {valid}
                    </strong>

                </div>


                <div className="bulk-customer-summary-card invalid">

                    <div>

                        <FiXCircle />

                        <span>
                            Invalid
                        </span>

                    </div>

                    <strong>
                        {invalid}
                    </strong>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="bulk-customer-preview-card">

                <div className="bulk-customer-table-wrapper">

                    <table className="bulk-customer-preview-table">

                        <thead>

                            <tr>

                                <th>
                                    Row
                                </th>

                                <th>
                                    Company Name
                                </th>

                                <th>
                                    Contact Person
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Validation
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {rows.map(row => (

                                <tr
                                    key={
                                        row.rowNumber
                                    }
                                    className={
                                        row.isValid
                                            ? "row-valid"
                                            : "row-invalid"
                                    }
                                >

                                    <td>
                                        {row.rowNumber}
                                    </td>


                                    <td>

                                        <strong>
                                            {
                                                row.companyName ||
                                                "—"
                                            }
                                        </strong>

                                    </td>


                                    <td>
                                        {
                                            row.contactPerson ||
                                            "—"
                                        }
                                    </td>


                                    <td>
                                        {
                                            row.email ||
                                            "—"
                                        }
                                    </td>


                                    <td>
                                        {
                                            row.phone ||
                                            "—"
                                        }
                                    </td>


                                    <td>

                                        {row.isValid ? (

                                            <span className="bulk-customer-status valid">

                                                <FiCheckCircle />

                                                Valid

                                            </span>

                                        ) : (

                                            <span className="bulk-customer-status invalid">

                                                <FiXCircle />

                                                Invalid

                                            </span>

                                        )}

                                    </td>


                                    <td>

                                        {row.isValid ? (

                                            <span className="bulk-customer-no-errors">

                                                Ready to import

                                            </span>

                                        ) : (

                                            <div className="bulk-customer-errors">

                                                {(row.errors ?? [])
                                                    .map(
                                                        (
                                                            error,
                                                            index
                                                        ) => (

                                                            <span
                                                                key={
                                                                    index
                                                                }
                                                            >

                                                                {error}

                                                            </span>

                                                        )
                                                    )}

                                            </div>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="bulk-customer-preview-footer">

                    {invalid > 0 ? (

                        <p className="bulk-customer-warning">

                            <FiXCircle />

                            {invalid} row
                            {invalid === 1
                                ? ""
                                : "s"} will not be imported.

                        </p>

                    ) : (

                        <p className="bulk-customer-ready">

                            <FiCheckCircle />

                            All rows are valid and ready
                            for import.

                        </p>

                    )}


                    <div className="bulk-customer-preview-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onBack}
                            disabled={importing}
                        >
                            Back
                        </button>


                        <button
                            type="button"
                            className="btn-primary"
                            onClick={onImport}
                            disabled={
                                valid === 0 ||
                                importing
                            }
                        >
                            {importing
                                ? "Importing..."
                                : (
                                    <>
                                        Import {valid} Customer
                                        {valid === 1
                                            ? ""
                                            : "s"}
                                    </>
                                )}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}