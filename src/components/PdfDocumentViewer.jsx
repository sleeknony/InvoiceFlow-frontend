
import { useEffect, useRef, useState } from "react";
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
    const [pageWidth, setPageWidth] = useState(900);

    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const container = containerRef.current;

        if (!container)
            return;

        const updateWidth = () => {
            const availableWidth = container.clientWidth;

            if (availableWidth > 0) {
                setPageWidth(
                    Math.min(900, Math.max(280, availableWidth - 16))
                );
            }
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setNumPages(0);
        setPageNumber(1);
    }, [url]);

    function onLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const isUnlimited = maxPages === 2147483647;

    const visiblePages = isUnlimited
        ? numPages
        : Math.min(
            numPages,
            maxPages ?? numPages
        );

    const hasHiddenPages =
        maxPages != null &&
        !isUnlimited &&
        numPages > maxPages;

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

    return (
        <div className="text-center pdf-viewer-container">

            <div
                ref={containerRef}
                className="pdf-viewer-page"
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
                        width={pageWidth}
                    />
                </Document>
            </div>

            {visiblePages > 1 && (
                <div className="pdf-viewer-navigation">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={pageNumber <= 1}
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
                        disabled={pageNumber >= visiblePages}
                        onClick={nextPage}
                    >
                        Next
                    </button>

                </div>
            )}

            {hasHiddenPages && (
                <div className="pdf-viewer-notice border rounded bg-light">

                    <div className="mb-2">
                        <i
                            className="bi bi-lock-fill"
                            style={{ fontSize: "24px" }}
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
                        <strong>{numPages} pages</strong>.
                    </p>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate("/pricing")}
                    >
                        Upgrade
                    </button>

                </div>
            )}

        </div>
    );
}
