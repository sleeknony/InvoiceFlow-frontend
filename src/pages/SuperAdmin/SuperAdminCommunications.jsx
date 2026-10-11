import { useCallback, useEffect, useMemo, useState } from "react";
import http from "../../api/http";
import "./SuperAdminCommunications.css";
import Swal from "sweetalert2";

const PAGE_SIZE = 20;

const RECIPIENT_MODES = [
    { value: "AllUsers", label: "All users" },
    { value: "SelectedUsers", label: "Specific users" },
    { value: "SelectedCompanies", label: "Selected companies" },
    { value: "CustomEmails", label: "Custom email addresses" },
];

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "An unexpected error occurred."
    );
}

export default function SuperAdminCommunications() {
    const [channel, setChannel] = useState("email");
    const [recipientMode, setRecipientMode] = useState("SelectedUsers");

    const [subject, setSubject] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [notificationUrl, setNotificationUrl] = useState("");

    const [userSearch, setUserSearch] = useState("");
    const [companySearch, setCompanySearch] = useState("");
    const [emailAddressesText, setEmailAddressesText] = useState("");

    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [userTotalCount, setUserTotalCount] = useState(0);

    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const isEmail = channel === "email";

    const loadUsers = useCallback(async () => {
        setLoadingUsers(true);
        setError("");

        try {
            const response = await http.get(
                "/superadmin/communications/users",
                {
                    params: {
                        search: userSearch.trim() || undefined,
                        page: userPage,
                        pageSize: PAGE_SIZE,
                    },
                }
            );

            const data = response.data;

            setUsers(data.items || []);
            setUserTotalCount(data.totalCount || 0);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoadingUsers(false);
        }
    }, [userSearch, userPage]);

    const loadCompanies = useCallback(async () => {
        setLoadingCompanies(true);
        setError("");

        try {
            const response = await http.get(
                "/superadmin/communications/companies",
                {
                    params: {
                        search: companySearch.trim() || undefined,
                        page: 1,
                        pageSize: 100,
                    },
                }
            );

            setCompanies(response.data.items || []);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoadingCompanies(false);
        }
    }, [companySearch]);

    useEffect(() => {
        if (recipientMode === "SelectedUsers") {
            loadUsers();
        }
    }, [recipientMode, loadUsers]);

    useEffect(() => {
        if (recipientMode === "SelectedCompanies") {
            loadCompanies();
        }
    }, [recipientMode, loadCompanies]);

    const selectedEmailCount = useMemo(() => {
        const addresses = emailAddressesText
            .split(/[\s,;]+/)
            .map((value) => value.trim())
            .filter(Boolean);

        return new Set(
            addresses.map((value) => value.toLowerCase())
        ).size;
    }, [emailAddressesText]);

    const toggleUser = (userId) => {
        setSelectedUserIds((current) =>
            current.includes(userId)
                ? current.filter((id) => id !== userId)
                : [...current, userId]
        );
    };

    const toggleCompany = (companyId) => {
        setSelectedCompanyIds((current) =>
            current.includes(companyId)
                ? current.filter((id) => id !== companyId)
                : [...current, companyId]
        );
    };

    const selectVisibleUsers = (checked) => {
        const visibleIds = users.map((user) => user.id);

        setSelectedUserIds((current) => {
            if (checked) {
                return [...new Set([...current, ...visibleIds])];
            }

            return current.filter((id) => !visibleIds.includes(id));
        });
    };

    const selectVisibleCompanies = (checked) => {
        const visibleIds = companies.map((company) => company.id);

        setSelectedCompanyIds((current) => {
            if (checked) {
                return [...new Set([...current, ...visibleIds])];
            }

            return current.filter((id) => !visibleIds.includes(id));
        });
    };

    const clearSelection = () => {
        setSelectedUserIds([]);
        setSelectedCompanyIds([]);
        setEmailAddressesText("");
    };

    const changeRecipientMode = (mode) => {
        setRecipientMode(mode);
        setError("");
        setResult(null);
    };

    const recipientDescription = useMemo(() => {
        switch (recipientMode) {
            case "AllUsers":
                return "All registered users";

            case "SelectedUsers":
                return `${selectedUserIds.length} user(s) selected`;

            case "SelectedCompanies":
                return `${selectedCompanyIds.length} company or companies selected`;

            case "CustomEmails":
                return `${selectedEmailCount} email address(es) entered`;

            default:
                return "Choose recipients";
        }
    }, [
        recipientMode,
        selectedUserIds.length,
        selectedCompanyIds.length,
        selectedEmailCount,
    ]);

    const validateForm = () => {
        if (isEmail && !subject.trim()) {
            return "Enter an email subject.";
        }

        if (!isEmail && !title.trim()) {
            return "Enter a notification title.";
        }

        if (!message.trim()) {
            return "Enter your message.";
        }

        if (recipientMode === "SelectedUsers" &&
            selectedUserIds.length === 0) {
            return "Select at least one user.";
        }

        if (recipientMode === "SelectedCompanies" &&
            selectedCompanyIds.length === 0) {
            return "Select at least one company.";
        }

        if (recipientMode === "CustomEmails") {
            if (!isEmail) {
                return "Custom email addresses are available for email broadcasts only.";
            }

            const addresses = emailAddressesText
                .split(/[\s,;]+/)
                .map((value) => value.trim())
                .filter(Boolean);

            if (addresses.length === 0) {
                return "Enter at least one email address.";
            }

            const invalid = addresses.filter(
                (email) =>
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );

            if (invalid.length > 0) {
                return `Check the email address: ${invalid[0]}`;
            }
        }

        if (!isEmail && notificationUrl.trim()) {
            const url = notificationUrl.trim();

            if (
                !url.startsWith("/") ||
                url.startsWith("//") ||
                url.includes("\\") ||
                /[\u0000-\u001f]/.test(url)
            ) {
                return "The notification link must be an internal application path beginning with /.";
            }
        }

        return "";
    };

    const handleSend = async (event) => {
        event.preventDefault();
        setError("");
        setResult(null);

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        //const confirmed = window.confirm(
        //    `You are about to send ${isEmail ? "an email" : "an in-app notification"} to ${recipientDescription}.\n\nDo you want to continue?`
        //);

        //if (!confirmed) {
        //    return;
        //}

        const confirmation = await Swal.fire({
            title: isEmail ? "Send broadcast email?" : "Send in-app notification?",
            text: `You are about to send ${isEmail ? "an email" : "an in-app notification"} to ${recipientDescription}. Do you want to continue?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isEmail ? "Yes, send email" : "Yes, send notification",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            focusCancel: true
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        const selectedAddresses = emailAddressesText
            .split(/[\s,;]+/)
            .map((value) => value.trim())
            .filter(Boolean);

        const payload = isEmail
            ? {
                subject: subject.trim(),
                message: message.trim(),
                recipientMode,
                userIds:
                    recipientMode === "SelectedUsers"
                        ? selectedUserIds
                        : [],
                companyIds:
                    recipientMode === "SelectedCompanies"
                        ? selectedCompanyIds
                        : [],
                emailAddresses:
                    recipientMode === "CustomEmails"
                        ? [...new Set(
                            selectedAddresses.map((email) =>
                                email.toLowerCase()
                            )
                        )]
                        : [],
            }
            : {
                title: title.trim(),
                message: message.trim(),
                url: notificationUrl.trim() || null,
                recipientMode,
                userIds:
                    recipientMode === "SelectedUsers"
                        ? selectedUserIds
                        : [],
                companyIds:
                    recipientMode === "SelectedCompanies"
                        ? selectedCompanyIds
                        : [],
            };

        setSending(true);

        try {
            const response = await http.post(
                isEmail
                    ? "/superadmin/communications/email/broadcast"
                    : "/superadmin/communications/notifications/broadcast",
                payload
            );

            setResult(response.data);

            if (response.data.failed === 0) {
                setMessage("");
                setSubject("");
                setTitle("");
                setNotificationUrl("");
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSending(false);
        }
    };

    const totalPages = Math.max(
        1,
        Math.ceil(userTotalCount / PAGE_SIZE)
    );

    return (
        <div className="sa-communications">
            <div className="sa-communications-header">
                <div>
                    <span className="sa-communications-eyebrow">
                        SUPER ADMIN
                    </span>
                    <h1>Communications Centre</h1>
                    <p>
                        Send platform announcements and important
                        updates to selected users or companies.
                    </p>
                </div>
            </div>

            <div className="sa-communications-tabs">
                <button
                    type="button"
                    className={isEmail ? "active" : ""}
                    onClick={() => {
                        setChannel("email");
                        setError("");
                        setResult(null);
                    }}
                >
                    <span aria-hidden="true">✉</span>
                    Email broadcast
                </button>

                <button
                    type="button"
                    className={!isEmail ? "active" : ""}
                    onClick={() => {
                        setChannel("notification");
                        if (recipientMode === "CustomEmails") {
                            setRecipientMode("SelectedUsers");
                        }
                        setError("");
                        setResult(null);
                    }}
                >
                    <span aria-hidden="true">♧</span>
                    In-app notification
                </button>
            </div>

            <form onSubmit={handleSend} className="sa-communications-grid">
                <div className="sa-communications-main">
                    <section className="sa-comm-card">
                        <div className="sa-comm-section-heading">
                            <span className="sa-comm-step">1</span>
                            <div>
                                <h2>Choose recipients</h2>
                                <p>Select who should receive this communication.</p>
                            </div>
                        </div>

                        <div className="sa-comm-audience-options">
                            {RECIPIENT_MODES
                                .filter((option) =>
                                    isEmail || option.value !== "CustomEmails"
                                )
                                .map((option) => (
                                    <label
                                        key={option.value}
                                        className={
                                            recipientMode === option.value
                                                ? "sa-comm-audience-option selected"
                                                : "sa-comm-audience-option"
                                        }
                                    >
                                        <input
                                            type="radio"
                                            name="recipientMode"
                                            value={option.value}
                                            checked={recipientMode === option.value}
                                            onChange={() =>
                                                changeRecipientMode(option.value)
                                            }
                                        />
                                        <span className="sa-comm-radio-mark" />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                        </div>

                        {recipientMode === "SelectedUsers" && (
                            <div className="sa-comm-picker">
                                <div className="sa-comm-picker-toolbar">
                                    <label
                                        className="sa-comm-select-visible"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                users.length > 0 &&
                                                users.every((user) =>
                                                    selectedUserIds.includes(user.id)
                                                )
                                            }
                                            onChange={(event) =>
                                                selectVisibleUsers(
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        Select all on this page
                                    </label>

                                    <span>
                                        {selectedUserIds.length} selected
                                    </span>
                                </div>

                                <input
                                    className="sa-comm-search"
                                    type="search"
                                    placeholder="Search by name or email..."
                                    value={userSearch}
                                    onChange={(event) => {
                                        setUserSearch(event.target.value);
                                        setUserPage(1);
                                    }}
                                />

                                {loadingUsers ? (
                                    <div className="sa-comm-empty">
                                        Loading users...
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="sa-comm-empty">
                                        No users found.
                                    </div>
                                ) : (
                                    <div className="sa-comm-recipient-list">
                                        {users.map((user) => (
                                            <label
                                                key={user.id}
                                                className="sa-comm-recipient"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUserIds.includes(
                                                        user.id
                                                    )}
                                                    onChange={() =>
                                                        toggleUser(user.id)
                                                    }
                                                />

                                                <span className="sa-comm-avatar">
                                                    {(
                                                        user.firstName?.[0] ||
                                                        user.email?.[0] ||
                                                        "U"
                                                    ).toUpperCase()}
                                                </span>

                                                <span className="sa-comm-recipient-details">
                                                    <strong>
                                                        {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                                                            "Unnamed user"}
                                                    </strong>
                                                    <small>{user.email}</small>
                                                    {user.companyNames?.length > 0 && (
                                                        <small className="sa-comm-company-label">
                                                            {user.companyNames.join(", ")}
                                                        </small>
                                                    )}
                                                </span>

                                                <span className="sa-comm-check">
                                                    {selectedUserIds.includes(user.id)
                                                        ? "Selected"
                                                        : ""}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div className="sa-comm-pagination">
                                    <button
                                        type="button"
                                        disabled={userPage <= 1 || loadingUsers}
                                        onClick={() =>
                                            setUserPage((page) =>
                                                Math.max(1, page - 1)
                                            )
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        Page {userPage} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            userPage >= totalPages ||
                                            loadingUsers
                                        }
                                        onClick={() =>
                                            setUserPage((page) =>
                                                Math.min(totalPages, page + 1)
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                </div>

                                {selectedUserIds.length > 0 && (
                                    <button
                                        type="button"
                                        className="sa-comm-text-button"
                                        onClick={() => setSelectedUserIds([])}
                                    >
                                        Clear selected users
                                    </button>
                                )}
                            </div>
                        )}

                        {recipientMode === "SelectedCompanies" && (
                            <div className="sa-comm-picker">
                                <div className="sa-comm-picker-toolbar">
                                    <label className="sa-comm-select-visible">
                                        <input
                                            type="checkbox"
                                            checked={
                                                companies.length > 0 &&
                                                companies.every((company) =>
                                                    selectedCompanyIds.includes(
                                                        company.id
                                                    )
                                                )
                                            }
                                            onChange={(event) =>
                                                selectVisibleCompanies(
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        Select all shown companies
                                    </label>

                                    <span>
                                        {selectedCompanyIds.length} selected
                                    </span>
                                </div>

                                <input
                                    className="sa-comm-search"
                                    type="search"
                                    placeholder="Search companies..."
                                    value={companySearch}
                                    onChange={(event) =>
                                        setCompanySearch(event.target.value)
                                    }
                                />

                                {loadingCompanies ? (
                                    <div className="sa-comm-empty">
                                        Loading companies...
                                    </div>
                                ) : companies.length === 0 ? (
                                    <div className="sa-comm-empty">
                                        No active companies found.
                                    </div>
                                ) : (
                                    <div className="sa-comm-recipient-list">
                                        {companies.map((company) => (
                                            <label
                                                key={company.id}
                                                className="sa-comm-recipient"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCompanyIds.includes(
                                                        company.id
                                                    )}
                                                    onChange={() =>
                                                        toggleCompany(company.id)
                                                    }
                                                />

                                                <span className="sa-comm-avatar company">
                                                    {company.name?.[0]?.toUpperCase() || "C"}
                                                </span>

                                                <span className="sa-comm-recipient-details">
                                                    <strong>{company.name}</strong>
                                                    <small>
                                                        Users who belong to this company
                                                    </small>
                                                </span>

                                                <span className="sa-comm-check">
                                                    {selectedCompanyIds.includes(
                                                        company.id
                                                    )
                                                        ? "Selected"
                                                        : ""}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <p className="sa-comm-help">
                                    Selecting multiple companies targets their
                                    associated users. A user belonging to more
                                    than one selected company is only counted
                                    once by the backend.
                                </p>
                            </div>
                        )}

                        {recipientMode === "CustomEmails" && isEmail && (
                            <div className="sa-comm-picker">
                                <label
                                    className="sa-comm-field-label"
                                    htmlFor="custom-email-addresses"
                                >
                                    Email addresses
                                </label>

                                <textarea
                                    id="custom-email-addresses"
                                    className="sa-comm-textarea"
                                    rows={4}
                                    placeholder={
                                        "client@example.com\nanother@example.com"
                                    }
                                    value={emailAddressesText}
                                    onChange={(event) =>
                                        setEmailAddressesText(event.target.value)
                                    }
                                />

                                <p className="sa-comm-help">
                                    Separate addresses with a comma, semicolon
                                    or new line.
                                </p>
                            </div>
                        )}

                        <div className="sa-comm-recipient-summary">
                            <div>
                                <small>Audience</small>
                                <strong>{recipientDescription}</strong>
                            </div>

                            <button
                                type="button"
                                className="sa-comm-text-button"
                                onClick={clearSelection}
                            >
                                Clear selection
                            </button>
                        </div>
                    </section>

                    <section className="sa-comm-card">
                        <div className="sa-comm-section-heading">
                            <span className="sa-comm-step">2</span>
                            <div>
                                <h2>Compose message</h2>
                                <p>
                                    Write the message you want recipients to receive.
                                </p>
                            </div>
                        </div>

                        {isEmail ? (
                            <div className="sa-comm-field">
                                <label htmlFor="email-subject">
                                    Email subject
                                </label>
                                <input
                                    id="email-subject"
                                    type="text"
                                    maxLength={200}
                                    placeholder="e.g. Important InvoiceNgine Update"
                                    value={subject}
                                    onChange={(event) =>
                                        setSubject(event.target.value)
                                    }
                                />
                            </div>
                        ) : (
                            <>
                                <div className="sa-comm-field">
                                    <label htmlFor="notification-title">
                                        Notification title
                                    </label>
                                    <input
                                        id="notification-title"
                                        type="text"
                                        maxLength={150}
                                        placeholder="e.g. Scheduled Maintenance"
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                    />
                                </div>

                                <div className="sa-comm-field">
                                    <label htmlFor="notification-url">
                                        Internal link (optional)
                                    </label>
                                    <input
                                        id="notification-url"
                                        type="text"
                                        maxLength={500}
                                        placeholder="/subscription/billing"
                                        value={notificationUrl}
                                        onChange={(event) =>
                                            setNotificationUrl(event.target.value)
                                        }
                                    />
                                    <small>
                                        Use an application path beginning with /,
                                        not a full external URL.
                                    </small>
                                </div>
                            </>
                        )}

                        <div className="sa-comm-field">
                            <div className="sa-comm-label-row">
                                <label htmlFor="communication-message">
                                    Message
                                </label>
                                <small>{message.length} / 5,000 characters</small>
                            </div>

                            <textarea
                                id="communication-message"
                                className="sa-comm-textarea"
                                rows={8}
                                maxLength={5000}
                                placeholder={
                                    "Write your announcement or update here..."
                                }
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                            />
                        </div>

                        {isEmail && (
                            <p className="sa-comm-help">
                                The current backend sends this message as plain
                                text. HTML email formatting can be added later
                                if needed.
                            </p>
                        )}
                    </section>
                </div>

                <aside className="sa-communications-sidebar">
                    <section className="sa-comm-card sa-comm-review">
                        <span className="sa-comm-step">3</span>
                        <h2>Review and send</h2>
                        <p>
                            Check your audience and message before confirming.
                        </p>

                        <div className="sa-comm-review-row">
                            <span>Channel</span>
                            <strong>
                                {isEmail ? "Email" : "In-app notification"}
                            </strong>
                        </div>

                        <div className="sa-comm-review-row">
                            <span>Audience</span>
                            <strong>{recipientDescription}</strong>
                        </div>

                        <div className="sa-comm-review-row">
                            <span>Subject / title</span>
                            <strong>
                                {(isEmail ? subject : title).trim() || "Not entered"}
                            </strong>
                        </div>

                        <div className="sa-comm-review-note">
                            <strong>Before sending</strong>
                            <p>
                                This action sends to the audience selected
                                above. Confirm the recipient count and message
                                carefully.
                            </p>
                        </div>

                        {error && (
                            <div className="sa-comm-alert error" role="alert">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div
                                className={
                                    result.failed > 0
                                        ? "sa-comm-alert warning"
                                        : "sa-comm-alert success"
                                }
                                role="status"
                            >
                                <strong>{result.message}</strong>
                                <div>
                                    Recipients: {result.totalRecipients}
                                </div>
                                <div>
                                    Successful: {result.successful}
                                </div>
                                <div>
                                    Failed: {result.failed}
                                </div>
                            </div>
                        )}

                        <button
                            className="sa-comm-send-button"
                            type="submit"
                            disabled={sending}
                        >
                            {sending
                                ? "Sending..."
                                : isEmail
                                    ? "Send email"
                                    : "Send notification"}
                        </button>

                        <small className="sa-comm-security-note">
                            Protected by Super Admin authorization.
                        </small>
                    </section>
                </aside>
            </form>
        </div>
    );
}