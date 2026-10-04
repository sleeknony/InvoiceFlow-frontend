class CompanyResolver {
    resolve(settings = {}) {
        return {
            name: settings.companyName ?? "",

            address: settings.address ?? "",

            phone: settings.phone ?? "",

            email: settings.email ?? "",

            website: settings.website ?? "",

            /* logo: settings.logoUrl ?? "",*/

            logo: {

                url:
                    settings.logoUrl,

                base64:
                    settings.logoBase64,

                exists:
                    !!(settings.logoBase64 || settings.logoUrl)

            },

            taxNumber: settings.taxNumber ?? "",

            registrationNumber: settings.registrationNumber ?? "",

            bank: {
                name: settings.bankName ?? "",

                accountName: settings.accountName ?? "",

                accountNumber: settings.accountNumber ?? "",

                sortCode: settings.sortCode ?? "",

                swiftCode: settings.swiftCode ?? "",

                iban: settings.iban ?? "",

                instructions: settings.paymentInstructions ?? ""
            },

            footer: {

                message:
                    settings.footerText ??
                    "Thank you for your business.",

                website:
                    settings.website ?? "",

                phone:
                    settings.phone ?? "",

                showinvoiceNgineBranding:
                    settings.removeinvoiceNgineBranding !== true

            }
        };
    }
}

export default new CompanyResolver();