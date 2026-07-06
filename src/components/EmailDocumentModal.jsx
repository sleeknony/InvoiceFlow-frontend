import {
    useEffect,
    useState
} from "react";

import { toast }
    from "react-hot-toast";

import {
    emailDocument
}
from "../services/documentService";

export default function EmailDocumentModal({
    show,
    onClose,
    document
}) {
    const [to, setTo] =
        useState("");

    const [subject, setSubject] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [sending, setSending] =
        useState(false);

    useEffect(() => {
        if (!document)
            return;

        setTo(
            document.customerEmail || ""
        );

        setSubject(
            `${document.type} ${document.documentNumber}`
        );

        setMessage(
            `Please find attached ${document.type} ${document.documentNumber}.`
        );

    }, [document]);

    if (!show)
        return null;

    const submit = async () => {
        if (!to) {
            toast.error(
                "Recipient email is required."
            );
            return;
        }

        try {
            setSending(true);

            await emailDocument(
                document.id,
                {
                    to,
                    subject,
                    message
                }
            );

            toast.success(
                "Document emailed successfully."
            );

            onClose();
        }
        catch (err) {
            toast.error(
                err.response?.data?.message ??
                "Failed to send email."
            );
        }
        finally {
            setSending(false);
        }
    };

    return (
        <div className="modal d-block">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Email Document
                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    <div className="modal-body">

                        <div className="mb-3">
                            <label>
                                To
                            </label>

                            <input
                                className="form-control"
                                value={to}
                                onChange={(e) =>
                                    setTo(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label>
                                Subject
                            </label>

                            <input
                                className="form-control"
                                value={subject}
                                onChange={(e) =>
                                    setSubject(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label>
                                Message
                            </label>

                            <textarea
                                rows="5"
                                className="form-control"
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn btn-primary"
                            disabled={sending}
                            onClick={submit}
                        >
                            {
                                sending
                                    ? "Sending..."
                                    : "Send Email"
                            }
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}