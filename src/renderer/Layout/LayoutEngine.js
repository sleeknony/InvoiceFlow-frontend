import SectionBuilder from "./SectionBuilder";

class LayoutEngine {

    build(page) {

        const sections = [];

        sections.push(

            SectionBuilder.header()

        );

        if (page.firstPage) {

            sections.push(

                SectionBuilder.addresses()

            );

        }

        sections.push(

            SectionBuilder.items(

                page.rows

            )

        );

        if (page.lastPage) {

            sections.push(

                SectionBuilder.bottom()

            );

            sections.push(

                SectionBuilder.signature()

            );

            sections.push(

                SectionBuilder.footer()

            );

        }

        return sections;

    }

}

export default new LayoutEngine();