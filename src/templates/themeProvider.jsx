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
            "12px"
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