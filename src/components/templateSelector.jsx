import  TemplateRegistry from "../renderer/templates/templateRegistry";

export default function TemplateSelector({
    value,
    onChange
}) {
    const templates =
        Object.values(TemplateRegistry);

    return (
        <div className="row g-3">
            {templates.map(template => (
                <div
                    key={template.code}
                    className="col-md-6"
                >
                    <div
                        className={`card h - 100 cursor - pointer border ${
    value === template.code
        ? "border-primary shadow"
        : ""
} `}
                        onClick={() =>
                            onChange(template.code)
                        }
                    >
                        {template.preview && (
                            <img
                                src={template.preview}
                                alt={template.name}
                                className="card-img-top"
                                style={{
                                    height: "160px",
                                    objectFit: "cover"
                                }}
                            />
                        )}

                        <div className="card-body">
                            <h6>{template.name}</h6>

                            <small className="text-muted">
                                {template.description}
                            </small>

                            {template.premium && (
                                <span className="badge bg-warning ms-2">
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

