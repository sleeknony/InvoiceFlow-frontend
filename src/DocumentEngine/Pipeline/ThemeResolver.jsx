class ThemeResolver {

    resolve(settings = {}) {

        return {

            primary:
                settings.primaryColor ?? "#1F2937",

            secondary:
                settings.secondaryColor ?? "#6B7280",

            accent:
                settings.accentColor ?? "#2563EB",

            font:
                settings.fontFamily ?? "Arial, Helvetica, sans-serif",

            logoHeight:
                Number.isFinite(Number(settings.logoHeight))
                    ? Number(settings.logoHeight)
                    : 90,

            borderRadius:
                Number.isFinite(Number(settings.borderRadius))
                    ? Number(settings.borderRadius)
                    : 4,

            template:
                settings.documentTemplate ?? "default"

        };

    }

}

export default new ThemeResolver();