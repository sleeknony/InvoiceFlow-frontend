import RowAnalyzer from "./RowAnalyzer";
import TableLayoutAnalyzer
    from "./TableLayoutAnalyzer";
import SectionPriority
    from "./SectionPriority";

const A4_HEIGHT_PX = 1122;

class LayoutAnalyzer {

    analyze(root) {

        if (!root) {

            return {

                pageHeight: A4_HEIGHT_PX,

                totalHeight: 0,

                remainingHeight: A4_HEIGHT_PX,

                fitsOnPage: true,

                pageCount: 1,

                sections: []

            };

        }

        const printableSections =

            Array.from(

                root.querySelectorAll(

                    "[data-section]"

                )

            );

        const sections =

            printableSections.map(section => {

                const rect =
                    section.getBoundingClientRect();

                const styles =
                    window.getComputedStyle(section);

                const marginTop =
                    parseFloat(styles.marginTop) || 0;

                const marginBottom =
                    parseFloat(styles.marginBottom) || 0;

                const table =

                    section.dataset.section === "items"

                        ? TableLayoutAnalyzer.analyze(section)

                        : null;

                const rows =

                    section.dataset.section === "items"

                        ? RowAnalyzer.analyze(section)

                        : [];

                return {

                    table,

                    rows,

                    rowCount:
                        rows.length,

                    type:
                        section.dataset.section,

                    element:
                        section,

                    height:
                        rect.height,

                    totalHeight:
                        rect.height +
                        marginTop +
                        marginBottom,

                    splittable:
                        section.dataset.splittable === "true",

                    keepTogether:
                        section.classList.contains("keep-together"),

                    avoidBreak:
                        section.classList.contains("avoid-break"),

                    allowBreak:
                        section.classList.contains("allow-break"),

                    priority:
                        SectionPriority.get(
                            section.dataset.section
                        ),

                };

            });

        const totalHeight =

            sections.reduce(

                (sum, s) =>

                    sum + s.totalHeight,

                0

            );

        const pageHeight =
            root.clientHeight || A4_HEIGHT_PX;

        const remainingHeight =
            Math.max(0, pageHeight - totalHeight);

        const fitsOnPage =
            totalHeight <= pageHeight;

        const pageCount =
            Math.max(
                1,
                Math.ceil(totalHeight / pageHeight)
            );

        return {

            pageHeight,

            totalHeight,

            remainingHeight,

            fitsOnPage,

            pageCount,

            sections

        };

    }

}

export default new LayoutAnalyzer();