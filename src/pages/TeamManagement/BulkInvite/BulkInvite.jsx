import { useRef, useState } from "react";
import { FiArrowLeft, FiCheckCircle, FiDownload, FiFile, FiUploadCloud, FiXCircle} from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import companyTeamService from "../../../services/companyTeamService";

import "./BulkInvite.css";

export default function BulkInvite() {

    const navigate = useNavigate();

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

        if (!selectedFile)
            return false;

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

        if (!validateFile(selectedFile))
            return;

        setFile(selectedFile);

        setPreview(null);
    }


    function handleInputChange(event) {

        const selectedFile =
            event.target.files?.[0];

        handleFileSelect(selectedFile);
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

        handleFileSelect(droppedFile);
    }


    // =========================================================
    // REMOVE FILE
    // =========================================================

    function handleRemoveFile() {

        setFile(null);

        setPreview(null);

        if (fileInputRef.current) {

            fileInputRef.current.value = "";
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

            const result =
                await companyTeamService
                    .previewBulkInvitations(file);

            setPreview(result);

            toast.success(
                "File preview generated successfully."
            );

        }
        catch (err) {

            console.error(
                "Bulk invitation preview error:",
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


    // =========================================================
    // IMPORT VALID ROWS
    // =========================================================

    async function handleImport() {

        if (!preview)
            return;

        const validRows =
            (preview.rows ?? [])
                .filter(row => row.isValid)
                .map(row => ({
                    email: row.email,
                    roleId: row.roleId
                }));

        if (validRows.length === 0) {

            toast.error(
                "There are no valid rows to import."
            );

            return;
        }

        try {

            setLoading(true);

            const result =
                await companyTeamService
                    .importBulkInvitations(
                        validRows
                    );

            if (result.failedRows === 0) {

                toast.success(
                    `${result.importedRows} invitation${result.importedRows === 1
                        ? ""
                        : "s"
                    } imported successfully.`
                );

                // Return to Team Management
                // after successful import.
                window.location.href =
                    "/team";

                return;
            }

            if (result.importedRows > 0) {

                toast.success(
                    `${result.importedRows} invitation${result.importedRows === 1
                        ? ""
                        : "s"
                    } imported successfully.`
                );

                console.warn(
                    "Bulk import failures:",
                    result.errors
                );

                window.location.href =
                    "/team";

                return;
            }

            toast.error(
                "No invitations were imported."
            );

        }
        catch (err) {

            console.error(
                "Bulk invitation import error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to import invitations.";

            toast.error(message);

        }
        finally {

            setLoading(false);
        }
    }

    // =========================================================
    // DOWNLOAD TEMPLATE
    // =========================================================

    function handleDownloadTemplate() {

        /*
         * Replace this URL with the template endpoint
         * we created earlier if it is different.
         */

        const url =
            "/api/company/team/bulk-invitations/template";

        window.open(
            url,
            "_blank"
        );
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="bulk-invite-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bulk-invite-header">

                <div>

                    <button
                        type="button"
                        className="bulk-invite-back"
                        onClick={() => navigate("/team")}
                    >
                        <FiArrowLeft />

                        Back to Team
                    </button>

                    <h1>
                        Bulk Invite Team Members
                    </h1>

                    <p>
                        Upload the Excel template to invite
                        multiple team members at once.
                    </p>

                </div>

            </div>


            {/* =================================================
                TEMPLATE CARD
            ================================================= */}

            {!preview && (

                <div className="bulk-invite-card">

                    <div className="bulk-invite-card-header">

                        <div>

                            <h2>
                                Upload Invitation File
                            </h2>

                            <p>
                                Use the provided Excel template
                                with Email Address and Role columns.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="bulk-template-button"
                            onClick={
                                handleDownloadTemplate
                            }
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
                                ? "bulk-upload-zone dragging"
                                : "bulk-upload-zone"
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
                            onChange={
                                handleInputChange
                            }
                            hidden
                        />


                        <div className="bulk-upload-icon">

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
                            className="bulk-browse-button"
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

                        <div className="bulk-selected-file">

                            <div className="bulk-selected-file-icon">

                                <FiFile />

                            </div>


                            <div className="bulk-selected-file-info">

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
                                className="bulk-remove-file"
                                onClick={
                                    handleRemoveFile
                                }
                            >
                                <FiXCircle />
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="bulk-upload-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/team")}
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

                <PreviewSection
                    preview={preview}
                    file={file}
                    loading={loading}
                    onBack={() =>
                        setPreview(null)
                    }
                    onChooseAnother={
                        handleRemoveFile
                    }
                    onImport={handleImport}
                />

            )}

        </div>
    );
}


// =============================================================
// PREVIEW SECTION
// =============================================================

function PreviewSection({
    preview,
    file,
    onBack,
    loading,
    onChooseAnother,
    onImport
}) {

    const rows =
        preview.rows ?? [];

    const total =
        preview.totalRows ?? rows.length;

    const valid =
        preview.validRows ??
        rows.filter(x => x.isValid).length;

    const invalid =
        preview.invalidRows ??
        rows.filter(x => !x.isValid).length;


    return (

        <div className="bulk-preview-container">


            {/* =================================================
                PREVIEW HEADER
            ================================================= */}

            <div className="bulk-preview-header">

                <div>

                    <h2>
                        Import Preview
                    </h2>

                    <p>
                        Review the rows before importing
                        the invitations.
                    </p>

                    {file && (

                        <div className="bulk-preview-file">

                            <FiFile />

                            {file.name}

                        </div>

                    )}

                </div>


                <button
                    type="button"
                    className="bulk-change-file"
                    onClick={onChooseAnother}
                >
                    Choose Another File
                </button>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="bulk-preview-summary">


                <div className="bulk-summary-card">

                    <span>
                        Total Rows
                    </span>

                    <strong>
                        {total}
                    </strong>

                </div>


                <div className="bulk-summary-card valid">

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


                <div className="bulk-summary-card invalid">

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

            <div className="bulk-preview-card">

                <div className="bulk-preview-table-wrapper">

                    <table className="bulk-preview-table">

                        <thead>

                            <tr>

                                <th>
                                    Row
                                </th>

                                <th>
                                    Email Address
                                </th>

                                <th>
                                    Role
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
                                            {row.email ||
                                                "—"}
                                        </strong>
                                    </td>


                                    <td>

                                        {row.role ? (

                                            <span className="bulk-role-badge">
                                                {row.role}
                                            </span>

                                        ) : (
                                            "—"
                                        )}

                                    </td>


                                    <td>

                                        {row.isValid ? (

                                            <span className="bulk-status valid">

                                                <FiCheckCircle />

                                                Valid

                                            </span>

                                        ) : (

                                            <span className="bulk-status invalid">

                                                <FiXCircle />

                                                Invalid

                                            </span>

                                        )}

                                    </td>


                                    <td>

                                        {row.isValid ? (

                                            <span className="bulk-no-errors">
                                                Ready to import
                                            </span>

                                        ) : (

                                            <div className="bulk-errors">

                                                {(
                                                    row.errors ??
                                                    []
                                                ).map(
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

                <div className="bulk-preview-footer">

                    <div>

                        {invalid > 0 ? (

                            <p className="bulk-warning">

                                <FiXCircle />

                                {invalid} row
                                {invalid === 1
                                    ? ""
                                    : "s"} will not be imported.

                            </p>

                        ) : (

                            <p className="bulk-ready">

                                <FiCheckCircle />

                                All rows are valid and ready
                                for import.

                            </p>

                        )}

                    </div>


                    <div className="bulk-preview-actions">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                                navigate("/team")
                            }
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            className="btn-primary"
                            disabled={
                                valid === 0 ||
                                loading
                            }
                            onClick={onImport}
                        >
                            {loading
                                ? "Importing..."
                                : (
                                    <>
                                        Import {valid} Valid
                                        {valid === 1
                                            ? " Member"
                                            : " Members"}
                                    </>
                                )}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}