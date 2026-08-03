import "./theme.css";

export default function ThemeProvider({
    settings = {},
    config = {},
    children
}) {
    const themeConfig =
        config?.theme ?? {};

    const typography =
        config?.typography ?? {};

    const theme = {
        "--if-primary":
            settings.primaryColor ??
            themeConfig.primary ??
            "#0d6efd",

        "--if-secondary":
            settings.secondaryColor ??
            themeConfig.secondary ??
            "#f8f9fa",

        "--if-accent":
            settings.accentColor ??
            themeConfig.accent ??
            "#e7f1ff",

        "--if-background":
            themeConfig.background ??
            "#ffffff",

        "--if-text":
            themeConfig.text ??
            "#212529",

        "--if-muted":
            themeConfig.mutedText ??
            "#6c757d",

        "--if-border":
            themeConfig.border ??
            "#d6d8db",

        "--if-heading":
            themeConfig.heading ??
            "#0d6efd",

        "--if-table-header":
            themeConfig.tableHeader ??
            "#f8f9fa",

        "--if-badge-bg":
            themeConfig.badgeBackground ??
            "#e7f1ff",

        "--if-badge-text":
            themeConfig.badgeText ??
            "#0d6efd",

        "--if-font":
            settings.fontFamily ??
            typography.fontFamily ??
            "Inter",

        "--if-heading-size":
            typography.headingSize ??
            "28px",

        "--if-body-size":
            typography.bodySize ??
            "14px",

        "--if-small-size":
            typography.smallSize ??
            "12px",

        /* Layout */

        "--if-page-padding": "40px",
      
        "--if-card-padding": "20px",

        "--if-card-radius": "10px",

        "--if-card-shadow": "0 2px 8px rgba(0,0,0,.08)",

        "--if-section-spacing": "32px",

        "--if-section-spacing-sm": "20px",

        "--if-section-spacing-lg": "48px",

        "--if-document-size": "38px",

        "--if-document-weight": "800",

        "--if-document-color": "#0d6efd",

        "--if-company-size": "30px",

        "--if-company-weight": "700",

        "--if-company-color": "#212529",
        /* Header */

        "--if-header-border":
            "2px solid #dee2e6",

        "--if-header-spacing":
            "30px",

        /* Address */

        "--if-address-border":
            "1px solid #dee2e6",

        "--if-address-radius":
            "8px",

        "--if-address-padding":
            "16px",

        "--if-address-bg": "#ffffff",

        "--if-address-border": "1px solid #dee2e6",

        "--if-address-radius": "8px",

        "--if-address-padding": "18px",

        "--if-address-title-color": "#666",

        "--if-address-title-size": "12px",

        "--if-address-gap": "20px",

        /* Table */

        "--if-table-header-bg":
            "#f8f9fa",

        "--if-table-header-text":
            "#212529",

        "--if-table-border":
            "#dee2e6",

        "--if-row-hover":
            "#f8fbff",

        "--if-row-alt":
            "#fafafa",

        /* Totals */

        "--if-total-border":
            "2px solid #dee2e6",

        "--if-total-bg":
            "#ffffff",

        /* Signature */

        "--if-signature-border":
            "1px solid #dee2e6",
        "--if-signature-width":
            "280px",

        /* Footer */

        "--if-footer-border":
            "1px solid #dee2e6",

        "--if-footer-text-align":
            "center",


        /* Payment */

        "--if-payment-border":
            "1px solid #dee2e6",

        "--if-payment-radius":
            "8px",

        "--if-payment-padding":
            "20px",

        "--if-payment-title-color":
            "var(--if-heading)",

        "--if-payment-label-color":
            "var(--if-muted)",

        "--if-payment-value-color":
            "var(--if-text)"
     

       
    };

    return (
        <div
            className="invoice-theme"
            style={theme}
        >
            {children}
        </div>
    );
}