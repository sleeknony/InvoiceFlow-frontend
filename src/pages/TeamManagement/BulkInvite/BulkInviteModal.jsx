import { useEffect, useRef, useState } from "react";
import {
    FiCheck,
    FiChevronLeft,
    FiUploadCloud,
    FiX,
    FiAlertCircle,
    FiFileText
} from "react-icons/fi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import companyTeamService from "../../../services/companyTeamService";

import "./BulkInviteModal.css";

export default function BulkInviteModal({
    open,
    onClose,
    onSuccess
}) {

    const fileInputRef = useRef(null);

    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState(null);

    const [loadingPreview, setLoadingPreview] =
        useState(false);

    const [importing, setImporting] =
        useState(false);

    const [importProgress, setImportProgress] =
        useState({
            current: 0,
            total: 0
        });

    const [error, setError] =
        useState("");

    const [dragging, setDragging] =
        useState(false);


    // =========================================================
    // RESET
    // =========================================================

    useEffect(() => {

        if (!open) {

            setFile(null);

            setPreview(null);

            setError("");

            setLoadingPreview(false);

            setImporting(false);

            setImportProgress({
                current: 0,
                total: 0
            });

            setDragging(false);

        }

    }, [open]);


    // =========================================================
    // FILE VALIDATION
    // =========================================================

    function validateFile(selectedFile) {

        if (!selectedFile) {

            setError(
                "Please select an Excel file."
            );

            return false;
        }


        const extension =
            selectedFile.name
                .split(".")
                .pop()
                ?.toLowerCase();


        if (extension !== "xlsx") {

            setError(
                "Only Excel (.xlsx) files are supported."
            );

            return false;
        }


        if (selectedFile.size === 0) {

            setError(
                "The selected file is empty."
            );

            return false;
        }


        setError("");

        return true;
    }


    // =========================================================
    // SELECT FILE
    // =========================================================

    function handleFileSelected(selectedFile) {

        if (!validateFile(selectedFile))
            return;


        setFile(selectedFile);

        setPreview(null);

        setError("");

    }


    // =========================================================
    // FILE INPUT
    // =========================================================

    function handleFileInputChange(event) {

        const selectedFile =
            event.target.files?.[0];

        if (selectedFile) {

            handleFileSelected(
                selectedFile
            );

        }

    }


    // =========================================================
    // DRAG EVENTS
    // =========================================================

    function handleDragOver(event) {

        event.preventDefault();

        if (importing || loadingPreview)
            return;

        setDragging(true);

    }


    function handleDragLeave(event) {

        event.preventDefault();

        setDragging(false);

    }


    function handleDrop(event) {

        event.preventDefault();

        setDragging(false);

        if (importing || loadingPreview)
            return;


        const droppedFile =
            event.dataTransfer.files?.[0];

        if (droppedFile) {

            handleFileSelected(
                droppedFile
            );

        }

    }


    // =========================================================
    // BROWSE
    // =========================================================

    function handleBrowse() {

        if (
            importing ||
            loadingPreview
        ) {
            return;
        }

        fileInputRef.current?.click();

    }


    // =========================================================
    // PREVIEW
    // =========================================================

    async function handlePreview() {

        if (!file) {

            setError(
                "Please select an Excel file first."
            );

            return;
        }


        try {

            setLoadingPreview(true);

            setError("");

            const result =
                await companyTeamService
                    .previewBulkInvitations(
                        file
                    );


            setPreview(result);

        }
        catch (err) {

            console.error(
                "Bulk invitation preview error:",
                err
            );


            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to preview the uploaded file.";


            setError(message);

            setPreview(null);

        }
        finally {

            setLoadingPreview(false);

        }

    }


    // =========================================================
    // BACK TO UPLOAD
    // =========================================================

    function handleBack() {

        if (importing)
            return;

        setPreview(null);

        setError("");

    }


    // =========================================================
    // IMPORT
    // =========================================================

    async function handleImport() {

        if (!preview)
            return;


        const validRows =
            (preview.rows ?? [])
                .filter(
                    row => row.isValid
                );


        if (validRows.length === 0) {

            toast.error(
                "There are no valid rows to import."
            );

            return;
        }


        const result =
            await Swal.fire({

                title:
                    "Send invitations?",

                text:
                    `${validRows.length} team member invitation${validRows.length === 1
                        ? ""
                        : "s"
                    } will be sent.`,

                icon:
                    "question",

                showCancelButton:
                    true,

                confirmButtonText:
                    "Yes, send invitations",

                cancelButtonText:
                    "Cancel",

                reverseButtons:
                    true

            });


        if (!result.isConfirmed)
            return;


        try {

            setImporting(true);

            setError("");

            setImportProgress({

                current: 0,

                total:
                    validRows.length

            });


            let successful = 0;

            let failed = 0;


            for (
                let i = 0;
                i < validRows.length;
                i++
            ) {

                const row =
                    validRows[i];


                try {

                    await companyTeamService
                        .inviteMember({

                            email:
                                row.email.trim(),

                            roleId:
                                Number(
                                    row.roleId
                                )

                        });


                    successful++;

                }
                catch (err) {

                    console.error(
                        `Failed to invite ${row.email}`,
                        err
                    );

                    failed++;

                }


                setImportProgress({

                    current:
                        i + 1,

                    total:
                        validRows.length

                });

            }


            // =================================================
            // RESULT
            // =================================================

            if (failed === 0) {

                await Swal.fire({

                    title:
                        "Import completed",

                    text:
                        `${successful} invitation${successful === 1
                            ? ""
                            : "s"
                        } sent successfully.`,

                    icon:
                        "success",

                    confirmButtonText:
                        "Done"

                });

            }
            else {

                await Swal.fire({

                    title:
                        "Import completed with errors",

                    html:
                        `<strong>${successful}</strong> invitation${successful === 1
                            ? ""
                            : "s"
                        } sent successfully.<br/><strong>${failed}</strong> invitation${failed === 1
                            ? ""
                            : "s"
                        } failed.`,

                    icon:
                        "warning",

                    confirmButtonText:
                        "Done"

                });

            }


            await onSuccess?.();

            onClose();

        }
        catch (err) {

            console.error(
                "Bulk invitation error:",
                err
            );


            toast.error(
                err?.response?.data?.message ||
                "Unable to complete bulk invitation."
            );

        }
        finally {

            setImporting(false);

        }

    }


    // =========================================================
    // DON'T RENDER
    // =========================================================

    if (!open)
        return null;


    // =========================================================
    // SUMMARY VALUES
    // =========================================================

    const totalRows =
        preview?.totalRows ?? 0;

    const validRows =
        preview?.validRows ?? 0;

    const invalidRows =
        preview?.invalidRows ?? 0;


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="bulk-invite-overlay">

            <div className="bulk-invite-modal">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="bulk-invite-header">

                    <div>

                        <h2>
                            Bulk Invite Team Members
                        </h2>

                        <p>
                            Upload the completed Excel template
                            to invite multiple team members.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="bulk-invite-close"
                        onClick={onClose}
                        disabled={
                            importing ||
                            loadingPreview
                        }
                    >
                        <FiX />
                    </button>

                </div>


                {/* =================================================
                    BODY
                ================================================= */}

                <div className="bulk-invite-body">


                    {error && (

                        <div className="bulk-invite-error">

                            <FiAlertCircle />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        UPLOAD VIEW
                    ================================================= */}

                    {!preview && (

                        <>

                            <div
                                className={
                                    dragging
                                        ? "bulk-invite-dropzone dragging"
                                        : "bulk-invite-dropzone"
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
                                onClick={
                                    handleBrowse
                                }
                            >

                                <div className="bulk-invite-upload-icon">

                                    <FiUploadCloud />

                                </div>


                                <h3>
                                    Drop your Excel file here
                                </h3>


                                <p>
                                    or click to browse
                                </p>


                                <span>
                                    Only .xlsx files are supported
                                </span>


                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx"
                                    onChange={
                                        handleFileInputChange
                                    }
                                    hidden
                                />

                            </div>


                            {/* =================================================
                                SELECTED FILE
                            ================================================= */}

                            {file && (

                                <div className="bulk-invite-selected-file">

                                    <div className="bulk-invite-file-icon">

                                        <FiFileText />

                                    </div>


                                    <div className="bulk-invite-file-info">

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
                                        onClick={() => {

                                            setFile(null);

                                            setError("");

                                            if (
                                                fileInputRef.current
                                            ) {
                                                fileInputRef.current.value =
                                                    "";
                                            }

                                        }}
                                        disabled={
                                            loadingPreview
                                        }
                                    >

                                        <FiX />

                                    </button>

                                </div>

                            )}

                        </>

                    )}


                    {/* =================================================
                        PREVIEW
                    ================================================= */}

                    {preview && (

                        <div className="bulk-invite-preview">


                            {/* SUMMARY */}

                            <div className="bulk-invite-summary">

                                <div className="bulk-summary-card">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        {totalRows}
                                    </strong>

                                </div>


                                <div className="bulk-summary-card valid">

                                    <span>
                                        Valid
                                    </span>

                                    <strong>
                                        {validRows}
                                    </strong>

                                </div>


                                <div className="bulk-summary-card invalid">

                                    <span>
                                        Invalid
                                    </span>

                                    <strong>
                                        {invalidRows}
                                    </strong>

                                </div>

                            </div>


                            {/* FILE */}

                            <div className="bulk-invite-preview-file">

                                <FiFileText />

                                <span>
                                    {file?.name}
                                </span>

                            </div>


                            {/* TABLE */}

                            <div className="bulk-invite-table-wrapper">

                                <table className="bulk-invite-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Row
                                            </th>

                                            <th>
                                                Email
                                            </th>

                                            <th>
                                                Role
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {(preview.rows ?? [])
                                            .map(
                                                row => (

                                                    <tr
                                                        key={
                                                            row.rowNumber
                                                        }
                                                        className={
                                                            row.isValid
                                                                ? "valid-row"
                                                                : "invalid-row"
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                row.rowNumber
                                                            }
                                                        </td>

                                                        <td>
                                                            <div className="bulk-email-cell">

                                                                {row.email || "—"}

                                                            </div>

                                                            {!row.isValid &&
                                                                row.errors?.length > 0 && (

                                                                    <div className="bulk-row-errors">

                                                                        {row.errors.map(
                                                                            (
                                                                                errorMessage,
                                                                                index
                                                                            ) => (

                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        errorMessage
                                                                                    }
                                                                                </div>

                                                                            )
                                                                        )}

                                                                    </div>

                                                                )}

                                                        </td>

                                                        <td>

                                                            {row.role || "—"}

                                                        </td>

                                                        <td>

                                                            {row.isValid ? (

                                                                <span className="bulk-status valid">

                                                                    <FiCheck />

                                                                    Valid

                                                                </span>

                                                            ) : (

                                                                <span className="bulk-status invalid">

                                                                    <FiX />

                                                                    Invalid

                                                                </span>

                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                    </tbody>

                                </table>

                            </div>


                            {/* IMPORT PROGRESS */}

                            {importing && (

                                <div className="bulk-import-progress">

                                    <div className="bulk-import-progress-header">

                                        <span>
                                            Sending invitations...
                                        </span>

                                        <strong>

                                            {importProgress.current}
                                            {" "}
                                            /
                                            {" "}
                                            {importProgress.total}

                                        </strong>

                                    </div>


                                    <div className="bulk-import-progress-track">

                                        <div
                                            className="bulk-import-progress-bar"
                                            style={{
                                                width:
                                                    importProgress.total > 0
                                                        ? `${(
                                                            importProgress.current /
                                                            importProgress.total
                                                        ) *
                                                        100
                                                        }%`
                                                        : "0%"
                                            }}
                                        />

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="bulk-invite-footer">


                    {!preview ? (

                        <>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={onClose}
                                disabled={
                                    loadingPreview
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="btn-primary"
                                disabled={
                                    !file ||
                                    loadingPreview
                                }
                                onClick={
                                    handlePreview
                                }
                            >

                                {loadingPreview
                                    ? "Preparing Preview..."
                                    : "Preview Import"}

                            </button>

                        </>

                    ) : (

                        <>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={
                                    handleBack
                                }
                                disabled={
                                    importing
                                }
                            >

                                <FiChevronLeft />

                                Back

                            </button>


                            <button
                                type="button"
                                className="btn-primary"
                                disabled={
                                    importing ||
                                    validRows === 0
                                }
                                onClick={
                                    handleImport
                                }
                            >

                                {importing

                                    ? `Sending ${importProgress.current} of ${importProgress.total}...`

                                    : `Send ${validRows} Invitation${validRows === 1
                                        ? ""
                                        : "s"
                                    }`

                                }

                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>

    );
}