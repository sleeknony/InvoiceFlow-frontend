import MetricsRegistry from "../metrics";
import PageBuilder from "../PageBuilder";
import RowHeightEstimator from "../RowHeightEstimator";
import LayoutEngine from "../Layout/LayoutEngine";

class PaginationEngine {

    paginateRows({

        rows,

        startingPageNumber = 1,

        firstReservedHeight,

        middleReservedHeight,

        metrics

    }) {

        const pages = [];

        let currentPage = PageBuilder.create({

            pageNumber: startingPageNumber,

            metrics,

            reservedHeight: firstReservedHeight

        });

        for (const row of rows) {

            if (!currentPage.canFit(row)) {

                pages.push(currentPage);

                currentPage = PageBuilder.create({

                    pageNumber: startingPageNumber + pages.length,

                    metrics,

                    reservedHeight: middleReservedHeight

                });

            }

            currentPage.addRow(row);

        }

        if (!currentPage.isEmpty()) {

            pages.push(currentPage);

        }

        return {

            pages,

            nextPageNumber:
                startingPageNumber + pages.length

        };

    }

    stabilizeLastPage({

        pages,

        metrics,

        pageHeight,

        middleReserved,

        lastReserved

    }) {

        if (!pages.length)
            return;

        while (true) {

            const last = pages[pages.length - 1];

            last.reservedHeight = lastReserved;
            last.availableHeight = pageHeight - lastReserved;

            if (last.usedHeight <= last.availableHeight)
                break;

            const overflow = PageBuilder.create({

                pageNumber: pages.length + 1,

                metrics,

                reservedHeight: lastReserved

            });

            while (

                last.usedHeight > last.availableHeight &&

                last.rows.length > 1

            ) {

                const row = last.rows.pop();

                if (!row)
                    break;

                last.usedHeight -= row.estimatedHeight;

                overflow.rows.unshift(row);

                overflow.usedHeight += row.estimatedHeight;

            }

            // This page is no longer the last page
            last.reservedHeight = middleReserved;
            last.availableHeight = pageHeight - middleReserved;

            pages.push(overflow);

        }

    }

    paginate({

        document,

        template = "Modern"

    }) {

        const metrics =

            MetricsRegistry[template] ??

            MetricsRegistry.Modern;

        const rows =

            RowHeightEstimator.estimateAll(

                document.items?.rows ?? [],

                metrics

            );

        const pageHeight =
            metrics.page.height;

        const firstReserved =

            metrics.header(document) +

            metrics.addresses(document) +

            metrics.table.headerHeight;

        const middleReserved =

            metrics.table.headerHeight;

        const lastReserved =

            metrics.table.headerHeight +

            metrics.totals(document) +

            metrics.payment(document) +

            metrics.signature(document) +

            metrics.footer(document);


        const {

            pages

        } = this.paginateRows({

            rows,

            startingPageNumber: 1,

            firstReservedHeight: firstReserved,

            middleReservedHeight: middleReserved,

            metrics

        });

        this.stabilizeLastPage({

            pages,

            metrics,

            pageHeight,

            middleReserved,

            lastReserved

        });

        pages.forEach((page, index) => {

            page.pageNumber = index + 1;

            page.clearMarks();

        });

        if (pages.length) {

            pages[0].markFirst();

            pages[pages.length - 1].markLast();

        }

        pages.forEach(page => {

            page.addSections(

                LayoutEngine.build(page)

            );

        });

        return {

            pageCount: pages.length,

            pages: pages.map(

                page => page.toJSON()

            )

        };

    }

}

export default new PaginationEngine();


//import MetricsRegistry from "../metrics";
//import PageBuilder from "../PageBuilder";
//import RowHeightEstimator from "../RowHeightEstimator";
//import LayoutEngine from "../Layout/LayoutEngine";

//// Safety ceiling to prevent runaway stabilization loops
//const MAX_STABILIZE_ITERATIONS = 500;

//class PaginationEngine {

//    // ─────────────────────────────────────────────────────────────
//    // PRIVATE HELPERS
//    // ─────────────────────────────────────────────────────────────

//    _createPage({ pageNumber, metrics, reservedHeight }) {
//        return PageBuilder.create({ pageNumber, metrics, reservedHeight });
//    }

//    // ─────────────────────────────────────────────────────────────
//    // PHASE 1 — Distribute rows across pages
//    // ─────────────────────────────────────────────────────────────

//    paginateRows({
//        rows,
//        startingPageNumber = 1,
//        firstReservedHeight,
//        middleReservedHeight,
//        metrics
//    }) {
//        const pages = [];

//        let currentPage = this._createPage({
//            pageNumber: startingPageNumber,
//            metrics,
//            reservedHeight: firstReservedHeight
//        });

//        for (const row of rows) {

//            // Validate estimatedHeight early so arithmetic never produces NaN
//            const rowHeight = row?.estimatedHeight;
//            if (typeof rowHeight !== "number" || !isFinite(rowHeight)) {
//                console.warn(
//                    "PaginationEngine: row missing a finite estimatedHeight — skipping.",
//                    row
//                );
//                continue;
//            }

//            if (!currentPage.canFit(row)) {
//                pages.push(currentPage);
//                currentPage = this._createPage({
//                    pageNumber: startingPageNumber + pages.length,
//                    metrics,
//                    reservedHeight: middleReservedHeight
//                });
//            }

//            currentPage.addRow(row);
//        }

//        // Always include the last working page, even when empty.
//        // An empty page here is the only page for a zero-row document —
//        // we need it so headers, totals, and footer still render.
//        pages.push(currentPage);

//        return {
//            pages,
//            nextPageNumber: startingPageNumber + pages.length
//        };
//    }

//    // ─────────────────────────────────────────────────────────────
//    // PHASE 2 — Ensure the last page has room for totals / footer
//    // ─────────────────────────────────────────────────────────────

//    stabilizeLastPage({
//        pages,
//        metrics,
//        pageHeight,
//        middleReserved,
//        lastReserved
//    }) {
//        if (!pages.length) return;

//        let iterations = 0;

//        while (iterations++ < MAX_STABILIZE_ITERATIONS) {

//            const last = pages[pages.length - 1];

//            // Apply last-page reserved space (totals, footer, etc.)
//            last.reservedHeight = lastReserved;
//            last.availableHeight = pageHeight - lastReserved;

//            // Last page fits — we are done
//            if (last.usedHeight <= last.availableHeight) break;

//            // Last page overflows: spill rows into a new overflow page.
//            // The overflow page starts as a candidate last page (lastReserved),
//            // and will be re-evaluated in the next iteration.
//            const overflow = this._createPage({
//                pageNumber: pages.length + 1,   // renumbered after the loop
//                metrics,
//                reservedHeight: lastReserved
//            });

//            // Move rows from the end of `last` into the front of `overflow`
//            // until `last` fits — but always keep at least one row on `last`
//            // so we never produce an infinite stream of empty pages.
//            while (
//                last.usedHeight > last.availableHeight &&
//                last.rows.length > 1
//            ) {
//                const row = last.rows.pop();
//                const h = row.estimatedHeight ?? 0;

//                last.usedHeight -= h;
//                overflow.rows.unshift(row);
//                overflow.usedHeight += h;
//            }

//            // Edge case: even a single row overflows the available space.
//            // Demote `last` to a middle page (it may be over-full but we
//            // cannot split a single row) and let overflow absorb it.
//            if (last.usedHeight > last.availableHeight) {
//                console.warn(
//                    "PaginationEngine: a single row exceeds the page height. " +
//                    "Consider increasing page size or reducing reserved sections."
//                );
//                // Force through: keep the oversized row on `last` as a middle page
//                // and move it entirely into overflow so the final page is clean.
//                const row = last.rows.pop();
//                if (row) {
//                    last.usedHeight -= row.estimatedHeight ?? 0;
//                    overflow.rows.unshift(row);
//                    overflow.usedHeight += row.estimatedHeight ?? 0;
//                }
//            }

//            // `last` is no longer the final page — switch it to middle metrics
//            last.reservedHeight = middleReserved;
//            last.availableHeight = pageHeight - middleReserved;

//            // Only push the overflow page if it has content, avoiding
//            // an empty trailing page when the oversized-row edge case fires
//            if (!overflow.isEmpty()) {
//                pages.push(overflow);
//            } else {
//                // Nothing was moved — break to avoid an infinite loop
//                console.warn(
//                    "PaginationEngine: stabilization could not move any rows. " +
//                    "Breaking to avoid infinite loop."
//                );
//                break;
//            }
//        }

//        if (iterations >= MAX_STABILIZE_ITERATIONS) {
//            console.error(
//                "PaginationEngine: stabilization hit the iteration ceiling " +
//                `(${MAX_STABILIZE_ITERATIONS}). Check metrics or row heights.`
//            );
//        }
//    }

//    // ─────────────────────────────────────────────────────────────
//    // PHASE 3 — Main entry point
//    // ─────────────────────────────────────────────────────────────

//    paginate({ document, template = "Modern" }) {

//        const metrics = MetricsRegistry[template] ?? MetricsRegistry.Modern;

//        const rows = RowHeightEstimator.estimateAll(
//            document.items?.rows ?? [],
//            metrics
//        );

//        const pageHeight = metrics.page.height;

//        // Space consumed at the TOP of each page type
//        const headerHeight = metrics.header(document);
//        const tableHeaderH = metrics.table.headerHeight;
//        const addressesHeight = metrics.addresses(document);

//        // Space consumed at the BOTTOM of the last page only
//        const bottomReserved =
//            metrics.totals(document) +
//            metrics.payment(document) +
//            metrics.signature(document) +
//            metrics.footer(document);

//        const firstReserved = headerHeight + addressesHeight + tableHeaderH;
//        const middleReserved = headerHeight + tableHeaderH;
//        const lastReserved = middleReserved + bottomReserved;

//        // FIX: single-page documents must reserve space for BOTH the
//        // addresses block (first-page) AND the totals/footer (last-page).
//        // We detect this after initial pagination and re-run if needed.
//        const singlePageReserved = firstReserved + bottomReserved;

//        const { pages } = this.paginateRows({
//            rows,
//            startingPageNumber: 1,
//            firstReservedHeight: firstReserved,
//            middleReservedHeight: middleReserved,
//            metrics
//        });

//        // Re-check: if everything landed on a single page, revalidate with
//        // the combined reserved height before stabilizing.
//        if (pages.length === 1) {
//            const onlyPage = pages[0];
//            onlyPage.reservedHeight = singlePageReserved;
//            onlyPage.availableHeight = pageHeight - singlePageReserved;

//            // If it still overflows with the combined reservation, re-paginate
//            // treating it as a two-page document from the start.
//            if (onlyPage.usedHeight > onlyPage.availableHeight) {
//                // Restore normal first-page metrics before stabilization
//                onlyPage.reservedHeight = firstReserved;
//                onlyPage.availableHeight = pageHeight - firstReserved;
//            }
//        }

//        this.stabilizeLastPage({
//            pages,
//            metrics,
//            pageHeight,
//            middleReserved,
//            lastReserved
//        });

//        // Assign final sequential page numbers and clear any stale marks
//        pages.forEach((page, index) => {
//            page.pageNumber = index + 1;
//            page.clearMarks();
//        });

//        // Mark boundary pages (a single page receives both marks)
//        if (pages.length) {
//            pages[0].markFirst();
//            pages[pages.length - 1].markLast();
//        }

//        // Build layout sections for each page
//        pages.forEach(page => {
//            page.addSections(LayoutEngine.build(page));
//        });

//        return {
//            pageCount: pages.length,
//            pages: pages.map(page => page.toJSON())
//        };
//    }
//}

//export default new PaginationEngine();