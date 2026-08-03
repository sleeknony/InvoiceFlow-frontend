class ReservedSpaceCalculator {

    calculate(sections = []) {

        return sections.reduce(

            (total, section) => {

                if (!section.keepTogether)
                    return total;

                return total + section.totalHeight;

            },

            0

        );

    }

}

export default new ReservedSpaceCalculator();