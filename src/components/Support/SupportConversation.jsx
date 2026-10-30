
import { useCallback, useEffect, useState } from "react";
import {
    FiDownload,
    FiFile,
    FiMessageCircle,
    FiRefreshCw,
    FiSend
} from "react-icons/fi";
import http from "../../api/http";
import "./SupportConversation.css";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
];

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleString();
}

function formatFileSize(bytes) {
    if (!Number.isFinite(bytes)) return "";

    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error, fallback) {
    const data = error?.response?.data;

    if (typeof data?.message === "string") {
        return data.message;
    }

    if (typeof data === "string") {
        return data;
    }

    return fallback;
}

export default function SupportConversation({
    ticketId,
    canReply = false,
    canUseInternalNotes = false,
    currentUserId
}) {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadMessages = useCallback(async (showLoading = true) => {
        if (!ticketId) return;

        if (showLoading) {
            setLoading(true);
        }

        try {
            const response = await http.get(
                `/support/tickets/${ticketId}/messages`
            );

            setMessages(
                Array.isArray(response.data) ? response.data : []
            );

            setError("");
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to load the support conversation."
                )
            );
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, [ticketId]);

    useEffect(() => {
        loadMessages();

        // Refresh periodically so new replies can appear without
        // requiring the user to reload the entire page.
        const intervalId = window.setInterval(() => {
            loadMessages(false);
        }, 20000);

        return () => window.clearInterval(intervalId);
    }, [loadMessages]);

    const handleFileSelection = event => {
        const files = Array.from(event.target.files || []);

        setError("");
        setNotice("");

        if (files.length > MAX_FILES) {
            setSelectedFiles([]);
            setError(`You can attach a maximum of ${MAX_FILES} files.`);
            event.target.value = "";
            return;
        }

        for (const file of files) {
            const extension = file.name
                .slice(file.name.lastIndexOf("."))
                .toLowerCase();

            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                setSelectedFiles([]);
                setError(
                    `${file.name} has an unsupported file type.`
                );
                event.target.value = "";
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setSelectedFiles([]);
                setError(
                    `${file.name} exceeds the 5 MB file-size limit.`
                );
                event.target.value = "";
                return;
            }
        }

        setSelectedFiles(files);
    };

    const handleSendMessage = async event => {
        event.preventDefault();

        setError("");
        setNotice("");

        const trimmedMessage = messageText.trim();

        if (!trimmedMessage && selectedFiles.length === 0) {
            setError("Enter a message or attach at least one file.");
            return;
        }

        if (!canReply) {
            setError("You cannot reply to this ticket right now.");
            return;
        }

        const formData = new FormData();

        formData.append("Message", trimmedMessage);
        formData.append(
            "IsInternalNote",
            canUseInternalNotes && isInternalNote ? "true" : "false"
        );

        selectedFiles.forEach(file => {
            formData.append("Attachments", file);
        });

        setSending(true);

        try {
            await http.post(
                `/support/tickets/${ticketId}/messages`,
                formData
            );

            setMessageText("");
            setSelectedFiles([]);
            setIsInternalNote(false);

            const fileInput = document.getElementById(
                `support-message-files-${ticketId}`
            );

            if (fileInput) {
                fileInput.value = "";
            }

            setNotice(
                isInternalNote && canUseInternalNotes
                    ? "Internal note added."
                    : "Your reply has been sent."
            );

            await loadMessages(false);
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "The message could not be sent. Please try again."
                )
            );
        } finally {
            setSending(false);
        }
    };

    const handleAttachmentOpen = async (message, attachment) => {
        const key = `${message.id}-${attachment.id}`;

        setDownloadingId(key);
        setError("");

        try {
            const response = await http.get(
                `/support/tickets/${ticketId}/messages/${message.id}/attachments/${attachment.id}`,
                {
                    responseType: "blob"
                }
            );

            const blobUrl = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    {
                        type:
                            attachment.contentType ||
                            "application/octet-stream"
                    }
                )
            );

            const isPreviewable = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/webp"
            ].includes(attachment.contentType);

            if (isPreviewable) {
                const newWindow = window.open(
                    blobUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

                if (!newWindow) {
                    // If the browser blocks the preview window,
                    // fall back to a download.
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = attachment.originalFileName;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                }
            } else {
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = attachment.originalFileName;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            window.setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
            }, 60000);
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to open this attachment."
                )
            );
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <section className="support-conversation-card">
            <div className="support-conversation-heading">
                <div>
                    <h2>
                        <FiMessageCircle />
                        Conversation
                    </h2>
                    <p>
                        Messages and attachments associated with this ticket.
                    </p>
                </div>

                <button
                    type="button"
                    className="support-conversation-refresh"
                    onClick={() => loadMessages()}
                    disabled={loading}
                    aria-label="Refresh conversation"
                    title="Refresh conversation"
                >
                    <FiRefreshCw />
                </button>
            </div>

            {error && (
                <div
                    className="support-conversation-alert is-error"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {notice && (
                <div
                    className="support-conversation-alert is-success"
                    role="status"
                >
                    {notice}
                </div>
            )}

            <div className="support-conversation-messages">
                {loading ? (
                    <p className="support-conversation-empty">
                        Loading conversation...
                    </p>
                ) : messages.length === 0 ? (
                    <p className="support-conversation-empty">
                        No conversation messages yet. Send a reply to start
                        the discussion.
                    </p>
                ) : (
                    messages.map(message => {
                        const isOwnMessage =
                            currentUserId &&
                            message.senderUserId === currentUserId;

                        return (
                            <article
                                key={message.id}
                                className={[
                                    "support-conversation-message",
                                    isOwnMessage ? "is-own-message" : "",
                                    message.isInternalNote
                                        ? "is-internal-note"
                                        : ""
                                ].filter(Boolean).join(" ")}
                            >
                                <div className="support-conversation-message-meta">
                                    <strong>
                                        {message.senderName || "User"}
                                    </strong>

                                    {message.isInternalNote && (
                                        <span className="support-internal-badge">
                                            Internal note
                                        </span>
                                    )}

                                    <time dateTime={message.createdAt}>
                                        {formatDate(message.createdAt)}
                                    </time>
                                </div>

                                {message.message && (
                                    <p className="support-conversation-message-text">
                                        {message.message}
                                    </p>
                                )}

                                {Array.isArray(message.attachments) &&
                                    message.attachments.length > 0 && (
                                        <ul className="support-conversation-attachments">
                                            {message.attachments.map(attachment => {
                                                const key =
                                                    `${message.id}-${attachment.id}`;

                                                return (
                                                    <li key={attachment.id}>
                                                        <FiFile />

                                                        <span className="support-attachment-name">
                                                            {attachment.originalFileName}
                                                            <small>
                                                                {formatFileSize(
                                                                    attachment.fileSizeBytes
                                                                )}
                                                            </small>
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAttachmentOpen(
                                                                    message,
                                                                    attachment
                                                                )
                                                            }
                                                            disabled={
                                                                downloadingId === key
                                                            }
                                                            title="Preview or download attachment"
                                                        >
                                                            <FiDownload />
                                                            {downloadingId === key
                                                                ? "Opening..."
                                                                : "Open"}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                            </article>
                        );
                    })
                )}
            </div>

            {canReply ? (
                <form
                    className="support-conversation-form"
                    onSubmit={handleSendMessage}
                >
                    <label htmlFor={`support-message-text-${ticketId}`}>
                        {isInternalNote && canUseInternalNotes
                            ? "Internal note"
                            : "Your message"}
                    </label>

                    <textarea
                        id={`support-message-text-${ticketId}`}
                        value={messageText}
                        onChange={event =>
                            setMessageText(event.target.value)
                        }
                        maxLength={10000}
                        rows={4}
                        placeholder={
                            isInternalNote && canUseInternalNotes
                                ? "Write a note visible only to support staff..."
                                : "Write your reply..."
                        }
                        disabled={sending}
                    />

                    {canUseInternalNotes && (
                        <label className="support-internal-toggle">
                            <input
                                type="checkbox"
                                checked={isInternalNote}
                                onChange={event =>
                                    setIsInternalNote(event.target.checked)
                                }
                                disabled={sending}
                            />
                            Add as an internal note (not visible to the customer)
                        </label>
                    )}

                    <div className="support-conversation-compose-footer">
                        <div className="support-conversation-file-picker">
                            <label htmlFor={`support-message-files-${ticketId}`}>
                                Attach files
                            </label>

                            <input
                                id={`support-message-files-${ticketId}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                multiple
                                onChange={handleFileSelection}
                                disabled={sending}
                            />

                            <small>
                                Up to 5 files, 5 MB each. PDF, JPG, PNG or WEBP.
                            </small>

                            {selectedFiles.length > 0 && (
                                <ul>
                                    {selectedFiles.map((file, index) => (
                                        <li key={`${file.name}-${index}`}>
                                            {file.name} ({formatFileSize(file.size)})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="support-conversation-send"
                            disabled={sending}
                        >
                            <FiSend />
                            {sending ? "Sending..." : "Send reply"}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="support-conversation-readonly">
                    Replying is unavailable. A Support Agent must claim this
                    ticket before replying, or the ticket may be closed.
                </p>
            )}
        </section>
    );
}
