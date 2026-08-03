class LayoutResolver {

    resolve(config = {}) {

        return {

            columns:
                config.columns ?? [],

            widths: {

                description:
                    config.widths?.description ?? "39%",

                quantity:
                    config.widths?.quantity ?? "7%",

                unitPrice:
                    config.widths?.unitPrice ?? "15%",

                discount:
                    config.widths?.discount ?? "10%",

                tax:
                    config.widths?.tax ?? "10%",

                total:
                    config.widths?.total ?? "19%"

            },

            alignments: {

                description:
                    config.alignments?.description ?? "left",

                quantity:
                    config.alignments?.quantity ?? "right",

                unitPrice:
                    config.alignments?.unitPrice ?? "right",

                discount:
                    config.alignments?.discount ?? "right",

                tax:
                    config.alignments?.tax ?? "right",

                total:
                    config.alignments?.total ?? "right"

            }

        };

    }

}

export default new LayoutResolver();