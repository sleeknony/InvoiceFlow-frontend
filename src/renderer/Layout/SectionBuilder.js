import SectionModel from "./SectionModel";
import SectionTypes from "./SectionType";

class SectionBuilder {

    header() {

        return new SectionModel({

            type: SectionTypes.Header,
            props:{}

        });

    }

    addresses() {

        return new SectionModel({

            type: SectionTypes.Addresses,
            props: {}

        });

    }

    items(rows) {

        return new SectionModel({

            type: SectionTypes.Items,

            props: {

                rows

            }

        });
    }

    bottom() {

        return new SectionModel({

            type: SectionTypes.Bottom,

            props: {}

        });

    }
    //payment() {

    //    return new SectionModel({

    //        type: SectionTypes.Payment,
    //        props: {}

    //    });

    //}

    //totals() {

    //    return new SectionModel({

    //        type: SectionTypes.Totals,
    //        props: {}

    //    });

    //}

    signature() {

        return new SectionModel({

            type: SectionTypes.Signature,
            props: {}

        });

    }

    footer() {

        return new SectionModel({

            type: SectionTypes.Footer,
            props: {}

        });

    }

}

export default new SectionBuilder();