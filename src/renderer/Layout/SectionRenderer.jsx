import SectionRegistry  from "./SectionRegistry";

class SectionRenderer {

    render(section) {

        const Component =

            SectionRegistry[section.type];

        if (!Component)

            return null;

        return (

            <Component

                {...section.props}

            />

        );

    }

}

export default new SectionRenderer();