import {
    useEffect,
    useMemo,
    useRef
} from "react";

import "../Styles/PrintLayout.css";
import "../Styles/A4.css";
import "../Styles/Print.css";
import "../Styles/PageBreak.css";
import LayoutAnalyzer from "./LayoutAnalyzer";
import PaginationEngine
    from "./PaginationEngine";

//import RenderPlanBuilder from "./RenderPlanBuilder";

export default function PrintLayout({

    children,

    mode = "preview",

    pageSize = "A4",

    orientation = "portrait",

    zoom = 1,

    margins = "normal",

    showShadow = true,

    showBackground = true

}) {

    const pageRef =
        useRef(null);

    const classes =
        useMemo(() => [

            "print-layout",

            `page-${pageSize.toLowerCase()}`,

            `orientation-${orientation}`,

            `margin-${margins}`,

            mode,

            showShadow && "with-shadow",

            showBackground && "with-background"

        ]
            .filter(Boolean)
            .join(" "),

            [

                mode,

                pageSize,

                orientation,

                margins,

                showShadow,

                showBackground

            ]);

    useEffect(() => {

        document.documentElement.style.setProperty(

            "--print-zoom",

            zoom

        );

    }, [zoom]);

    useEffect(() => {

        const analyze = () => {

            if (!pageRef.current)
                return;

            const layout =
                LayoutAnalyzer.analyze(
                    pageRef.current
                );

            const pagination =
                PaginationEngine.paginate(
                    layout
                );

            //const renderPlan =
            //    RenderPlanBuilder.build(
            //        pagination
            //    );

            console.groupCollapsed("Pagination");

            pagination.pages.forEach((page, index) => {

                console.group(
                    `Page ${index + 1}`
                );

                console.table(

                    page.map(section => ({

                        Section:
                            section.type,

                        Height:
                            Math.round(section.totalHeight),

                        KeepTogether:
                            section.keepTogether,

                        AllowBreak:
                            section.allowBreak,

                        "Table Header":
                            Math.round(
                                section.table?.headerHeight ?? 0
                            ),

                        Rows:
                            section.rows?.length ??
                            section.rowCount ??
                            0,

                        Split:
                            section.split ?? false,

                        Continuation:
                            section.continuation ?? false,

                        Priority:
                            section.priority,

                    }))

                );

                console.groupEnd();

            });

            console.log(
                "Total Pages:",
                pagination.pageCount
            );

            console.log(
                "Reserved Height:",
                Math.round(
                    pagination.reservedHeight
                )
            );

            console.groupEnd();

        };

        const frame =
            requestAnimationFrame(analyze);

        window.addEventListener(
            "resize",
            analyze
        );

        return () => {

            cancelAnimationFrame(frame);

            window.removeEventListener(
                "resize",
                analyze
            );

        };

    }, [children]);

    return (

        <div className={classes}>

            <div

                ref={pageRef}

                className="print-page"

            >

                {children}

            </div>

        </div>

    );

}