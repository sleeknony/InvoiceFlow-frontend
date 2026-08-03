import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
    new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString();

export default function PdfDocumentViewer({
    url,
    maxPages,
    subscriptionPlan
}) {

    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();

    // ============================================
    // PDF LOADED
    // ============================================

    function onLoadSuccess({ numPages }) {

        setNumPages(numPages);
        setPageNumber(1);
    }

    // ============================================
    // SUBSCRIPTION PAGE LIMIT
    // ============================================

    const isUnlimited =
        maxPages === 2147483647;

    const visiblePages =
        isUnlimited
            ? numPages
            : Math.min(
                numPages,
                maxPages ?? numPages
            );

    const hasHiddenPages =
        maxPages != null &&
        !isUnlimited &&
        numPages > maxPages;

    // ============================================
    // NAVIGATION
    // ============================================

    function previousPage() {

        setPageNumber(current =>
            Math.max(1, current - 1)
        );
    }

    function nextPage() {

        setPageNumber(current =>
            Math.min(
                visiblePages,
                current + 1
            )
        );
    }

    // ============================================
    // RENDER
    // ============================================

    return (

        <div className="text-center">

            {/* ====================================
                PDF
            ==================================== */}

            <div
                className="d-flex justify-content-center"
                style={{
                    width: "100%"
                }}
            >
                <Document
                    file={url}
                    onLoadSuccess={onLoadSuccess}

                    loading={
                        <div className="p-5">
                            Loading document...
                        </div>
                    }

                    error={
                        <div className="text-danger p-5">
                            Unable to load document.
                        </div>
                    }
                >

                    <Page
                        pageNumber={pageNumber}
                        width={900}
                    />

                </Document>
            </div>

            {/* ====================================
                PAGE NAVIGATION
            ==================================== */}

            {visiblePages > 1 && (

                <div
                    className="
                        d-flex
                        justify-content-center
                        align-items-center
                        gap-3
                        mt-3
                    "
                >

                    <button
                        type="button"
                        className="btn btn-outline-secondary"

                        disabled={
                            pageNumber <= 1
                        }

                        onClick={previousPage}
                    >
                        Previous
                    </button>

                    <span>
                        Page {pageNumber} of {visiblePages}
                    </span>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"

                        disabled={
                            pageNumber >= visiblePages
                        }

                        onClick={nextPage}
                    >
                        Next
                    </button>

                </div>

            )}

            {/* ====================================
                FREE / LIMITED PLAN NOTICE
            ==================================== */}

            {hasHiddenPages && (

                <div
                    className="
                        mx-auto
                        mt-4
                        mb-4
                        p-4
                        border
                        rounded
                        bg-light
                    "

                    style={{
                        maxWidth: "700px"
                    }}
                >

                    <div className="mb-2">

                        <i
                            className="bi bi-lock-fill"
                            style={{
                                fontSize: "24px"
                            }}
                        />

                    </div>

                    <h5>
                        Upgrade to view the complete document
                    </h5>

                    <p className="text-muted mb-3">

                        Your {subscriptionPlan ?? "current"} plan
                        allows you to view up to{" "}

                        <strong>
                            {maxPages} page
                            {maxPages === 1 ? "" : "s"}
                        </strong>

                        {" "}per document.

                        This document contains{" "}

                        <strong>
                            {numPages} pages
                        </strong>.

                    </p>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/pricing")
                        }
                    >
                        Upgrade
                    </button>

                </div>

            )}

        </div>

    );
}