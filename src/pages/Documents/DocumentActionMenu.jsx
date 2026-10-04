//import { useRef, useState, useEffect, useLayoutEffect } from "react";
//import { useNavigate } from "react-router-dom";
//import { createPortal } from "react-dom";
//import {
//    FiMoreVertical,
//    FiEye,
//    FiEdit2,
//    FiCopy,
//    FiTrash2,
//    FiSend,
//    FiDownload,
//    FiRefreshCw,
//    FiCheck,
//    FiX,
//    FiDollarSign
//} from "react-icons/fi";

//import Swal from "sweetalert2";
//import { deleteDocument } from "../../services/documentService";

//import "./DocumentActionMenu.css";

//export default function DocumentActionMenu({
//    document: doc,
//    onDeleted,
//    onApprove,
//    onReject,
//    onSend,
//    onDuplicate,
//    onConvert,
//    onDownload,
//    onAddPayment
//}) {
//    const [open, setOpen] = useState(false);
//    const [deleting, setDeleting] = useState(false);
//    const [menuStyle, setMenuStyle] = useState({});

//    const triggerRef = useRef(null);
//    const menuRef = useRef(null);

//    const navigate = useNavigate();

//    const close = () => setOpen(false);

//    // =====================================================
//    // CLOSE ON OUTSIDE CLICK
//    // =====================================================

//    useEffect(() => {
//        if (!open) return;

//        const handleOutside = (e) => {
//            if (
//                menuRef.current &&
//                !menuRef.current.contains(e.target) &&
//                triggerRef.current &&
//                !triggerRef.current.contains(e.target)
//            ) {
//                setOpen(false);
//            }
//        };

//        const handleEscape = (e) => {
//            if (e.key === "Escape") {
//                setOpen(false);
//            }
//        };

//        window.addEventListener("mousedown", handleOutside);
//        window.addEventListener("keydown", handleEscape);

//        return () => {
//            window.removeEventListener("mousedown", handleOutside);
//            window.removeEventListener("keydown", handleEscape);
//        };
//    }, [open]);

//    // =====================================================
//    // REPOSITION
//    // =====================================================

//    useLayoutEffect(() => {
//        if (!open) return;
//        if (!triggerRef.current) return;
//        if (!menuRef.current) return;

//        const triggerRect =
//            triggerRef.current.getBoundingClientRect();

//        const menuRect =
//            menuRef.current.getBoundingClientRect();

//        const gap = 8;

//        let top;

//        if (
//            window.innerHeight -
//            triggerRect.bottom <
//            menuRect.height + gap
//        ) {
//            top =
//                triggerRect.top -
//                menuRect.height -
//                gap;
//        } else {
//            top =
//                triggerRect.bottom +
//                gap;
//        }

//        let left =
//            triggerRect.right -
//            menuRect.width;

//        if (left < 8) left = 8;

//        if (
//            left + menuRect.width >
//            window.innerWidth - 8
//        ) {
//            left =
//                window.innerWidth -
//                menuRect.width -
//                8;
//        }

//        setMenuStyle({
//            position: "fixed",
//            top,
//            left,
//            zIndex: 999999
//        });
//    }, [open]);

//    // =====================================================
//    // ACTIONS
//    // =====================================================

//    const handleView = () => {
//        close();
//        navigate(`/documents/${doc.id}`);
//    };

//    const handleEdit = () => {
//        close();
//        navigate(`/documents/edit/${doc.id}`);
//    };

//    const handleDelete = async () => {
//        close();

//        const result = await Swal.fire({
//            title: "Delete document?",
//            text: `${doc.documentNumber} will be permanently deleted.`,
//            icon: "warning",
//            showCancelButton: true,
//            confirmButtonColor: "#dc2626",
//            confirmButtonText: "Delete"
//        });

//        if (!result.isConfirmed) return;

//        try {
//            setDeleting(true);

//            await deleteDocument(doc.id);

//            await onDeleted?.();
//        }
//        catch (err) {
//            Swal.fire({
//                icon: "error",
//                title: "Delete Failed",
//                text:
//                    err?.response?.data?.message ??
//                    "Unable to delete document."
//            });
//        }
//        finally {
//            setDeleting(false);
//        }
//    };

//    // =====================================================
//    // RENDER
//    // =====================================================

//    return (
//        <div className="dam-wrap">

//            <button
//                ref={triggerRef}
//                className={`dam-trigger ${open ? "dam-trigger--open" : ""}`}
//                onClick={() => setOpen(x => !x)}
//                disabled={deleting}
//            >
//                {
//                    deleting
//                        ? <span className="dam-spinner" />
//                        : <FiMoreVertical />
//                }
//            </button>

//            {
//                open &&
//                createPortal(

//                    <div
//                        ref={menuRef}
//                        className="dam-menu"
//                        style={menuStyle}
//                    >

//                        {/* Header */}

//                        <div className="dam-menu-header">
//                            <div className="fw-semibold">
//                                {doc.documentNumber}
//                            </div>

//                            <div className="dam-menu-subtitle">
//                                {doc.type}
//                            </div>
//                        </div>

//                        <div className="dam-divider" />

//                        {/* Always */}

//                        <MenuItem
//                            icon={<FiEye />}
//                            label="View"
//                            description="Open document"
//                            onClick={handleView}
//                        />

//                        {doc.canEdit && (
//                            <MenuItem
//                                icon={<FiEdit2 />}
//                                label="Edit"
//                                description="Modify document"
//                                onClick={handleEdit}
//                            />
//                        )}

//                        {doc.canDuplicate && (
//                            <MenuItem
//                                icon={<FiCopy />}
//                                label="Duplicate"
//                                description="Create a copy"
//                                onClick={() => {
//                                    close();
//                                    onDuplicate?.();
//                                }}
//                            />
//                        )}

//                        {doc.canConvert && (
//                            <MenuItem
//                                icon={<FiRefreshCw />}
//                                label="Convert"
//                                description="Convert document"
//                                onClick={() => {
//                                    close();
//                                    onConvert?.();
//                                }}
//                            />
//                        )}

//                        <div className="dam-divider" />

//                        {doc.canApprove && (
//                            <MenuItem
//                                icon={<FiCheck />}
//                                label="Approve"
//                                description="Approve document"
//                                onClick={() => {
//                                    close();
//                                    onApprove?.();
//                                }}
//                            />
//                        )}

//                        {doc.canReject && (
//                            <MenuItem
//                                icon={<FiX />}
//                                label="Reject"
//                                description="Reject document"
//                                onClick={() => {
//                                    close();
//                                    onReject?.();
//                                }}
//                            />
//                        )}

//                        {doc.canSend && (
//                            <MenuItem
//                                icon={<FiSend />}
//                                label="Send"
//                                description="Mark as sent"
//                                onClick={() => {
//                                    close();
//                                    onSend?.();
//                                }}
//                            />
//                        )}

//                        {doc.canReceivePayment && (
//                            <MenuItem
//                                icon={<FiDollarSign />}
//                                label="Record Payment"
//                                description="Add payment"
//                                onClick={() => {
//                                    close();
//                                    onAddPayment?.();
//                                }}
//                            />
//                        )}

//                        <MenuItem
//                            icon={<FiDownload />}
//                            label="Download PDF"
//                            description="Download document"
//                            onClick={() => {
//                                close();
//                                onDownload?.();
//                            }}
//                        />

//                        {doc.canDelete && (
//                            <>
//                                <div className="dam-divider" />

//                                <MenuItem
//                                    danger
//                                    icon={<FiTrash2 />}
//                                    label="Delete"
//                                    description="Permanently remove"
//                                    onClick={handleDelete}
//                                />
//                            </>
//                        )}

//                    </div>,

//                    document.body
//                )
//            }

//        </div>
//    );
//}

//function MenuItem({
//    icon,
//    label,
//    description,
//    onClick,
//    danger = false
//}) {
//    return (
//        <button
//            className={`dam-item ${danger ? "dam-item--danger" : ""
//                }`}
//            onClick={onClick}
//        >
//            <span className="dam-item-icon">
//                {icon}
//            </span>

//            <span className="dam-item-text">
//                <strong>{label}</strong>
//                <small>{description}</small>
//            </span>
//        </button>
//    );
//}

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import {
    FiMoreVertical,
    FiEye,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import Swal from "sweetalert2";
import { deleteDocument } from "../../services/documentService";

import "./DocumentActionMenu.css";

export default function DocumentActionMenu({
    document: doc,
    onDeleted
}) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});

    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    const navigate = useNavigate();

    const close = () => setOpen(false);

    // =====================================================
    // CLOSE ON OUTSIDE CLICK
    // =====================================================

    useEffect(() => {
        if (!open) return;

        const handleOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("mousedown", handleOutside);
        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("mousedown", handleOutside);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    // =====================================================
    // REPOSITION
    // =====================================================

    useLayoutEffect(() => {
        if (!open) return;
        if (!triggerRef.current) return;
        if (!menuRef.current) return;

        const triggerRect =
            triggerRef.current.getBoundingClientRect();

        const menuRect =
            menuRef.current.getBoundingClientRect();

        const gap = 8;

        let top;

        if (
            window.innerHeight -
            triggerRect.bottom <
            menuRect.height + gap
        ) {
            top =
                triggerRect.top -
                menuRect.height -
                gap;
        } else {
            top =
                triggerRect.bottom +
                gap;
        }

        let left =
            triggerRect.right -
            menuRect.width;

        if (left < 8) left = 8;

        if (
            left + menuRect.width >
            window.innerWidth - 8
        ) {
            left =
                window.innerWidth -
                menuRect.width -
                8;
        }

        setMenuStyle({
            position: "fixed",
            top,
            left,
            zIndex: 999999
        });
    }, [open]);

    // =====================================================
    // ACTIONS
    // =====================================================

    const handleView = () => {
        close();
        navigate(`/documents/${doc.id}`);
    };

    const handleEdit = () => {
        close();
        navigate(`/documents/edit/${doc.id}`);
    };

    const handleDelete = async () => {
        close();

        const result = await Swal.fire({
            title: "Delete document?",
            text: `${doc.documentNumber} will be permanently deleted.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Delete"
        });

        if (!result.isConfirmed) return;

        try {
            setDeleting(true);

            await deleteDocument(doc.id);

            await onDeleted?.();
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    err?.response?.data?.message ??
                    "Unable to delete document."
            });
        }
        finally {
            setDeleting(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="dam-wrap">

            <button
                ref={triggerRef}
                className={`dam-trigger ${open ? "dam-trigger--open" : ""}`}
                onClick={() => setOpen(x => !x)}
                disabled={deleting}
            >
                {
                    deleting
                        ? <span className="dam-spinner" />
                        : <FiMoreVertical />
                }
            </button>

            {
                open &&
                createPortal(

                    <div
                        ref={menuRef}
                        className="dam-menu"
                        style={menuStyle}
                    >

                        {/* Header */}

                        <div className="dam-menu-header">
                            <div className="fw-semibold">
                                {doc.documentNumber}
                            </div>

                            <div className="dam-menu-subtitle">
                                {doc.type}
                            </div>
                        </div>

                        <div className="dam-divider" />

                        {/* Always */}

                        <MenuItem
                            icon={<FiEye />}
                            label="View"
                            description="Open document"
                            onClick={handleView}
                        />

                        {doc.canEdit && (
                            <MenuItem
                                icon={<FiEdit2 />}
                                label="Edit"
                                description="Modify document"
                                onClick={handleEdit}
                            />
                        )}

                        {doc.canDelete && (
                            <>
                                <div className="dam-divider" />

                                <MenuItem
                                    danger
                                    icon={<FiTrash2 />}
                                    label="Delete"
                                    description="Permanently remove"
                                    onClick={handleDelete}
                                />
                            </>
                        )}

                    </div>,

                    document.body
                )
            }

        </div>
    );
}

function MenuItem({
    icon,
    label,
    description,
    onClick,
    danger = false
}) {
    return (
        <button
            className={`dam-item ${danger ? "dam-item--danger" : ""
                }`}
            onClick={onClick}
        >
            <span className="dam-item-icon">
                {icon}
            </span>

            <span className="dam-item-text">
                <strong>{label}</strong>
                <small>{description}</small>
            </span>
        </button>
    );
}