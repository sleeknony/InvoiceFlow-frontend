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

    const [cc, setCc] =
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

        setCc("");

        setSubject(
            `${document.type} ${document.documentNumber}`
        );

        setMessage(
            `Please find attached ${document.type} ${document.documentNumber}.`
        );

    }, [document]);

    if (!show)
        return null;

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }

    function validateEmailList(value) {

        if (!value)
            return true;

        const emails =
            value
                .split(",")
                .map(x => x.trim())
                .filter(Boolean);

        return emails.every(
            isValidEmail
        );
    }


    const submit = async () => {
        if (!to.trim()) {

            toast.error(
                "Recipient email is required."
            );

            return;
        }

        if (!validateEmailList(to)) {

            toast.error(
                "Please enter a valid recipient email."
            );

            return;
        }

        if (!validateEmailList(cc)) {

            toast.error(
                "One or more CC emails are invalid."
            );

            return;
        }

        if (!subject.trim()) {

            toast.error(
                "Subject is required."
            );

            return;
        }

        if (!message.trim()) {

            toast.error(
                "Message is required."
            );

            return;
        }

        try {
            setSending(true);

            await emailDocument(
                document.id,
                {
                    to,
                    cc,
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
                                CC
                            </label>

                            <input
                                className="form-control"
                                placeholder="john@abc.com, jane@abc.com"
                                value={cc}
                                onChange={(e) =>
                                    setCc(
                                        e.target.value
                                    )
                                }
                            />

                            <small className="text-muted">
                                Separate multiple emails with commas.
                            </small>

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