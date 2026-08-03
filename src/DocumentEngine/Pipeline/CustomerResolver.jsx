class CustomerResolver {

    resolve(document = {}) {

        return {

            id:
                document.customerId,

            name:
                document.customerName,

            company:
                document.customerCompany,

            email:
                document.customerEmail,

            phone:
                document.customerPhone,

            billing: {

                exists:
                    !!document.billingAddress,

                address:
                    document.billingAddress

            },

            shipping: {

                exists:
                    !!document.shippingAddress,

                address:
                    document.shippingAddress

            }

        };

    }

}

export default new CustomerResolver();