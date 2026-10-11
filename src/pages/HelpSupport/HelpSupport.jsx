import { useCallback, useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiBookOpen,
    FiCheckCircle,
    FiChevronDown,
    FiHelpCircle,
    FiMail,
    FiMessageCircle,
    FiSearch,
    FiSend
} from "react-icons/fi";
import http from "../../api/http";
import "./HelpSupport.css";

const TAWK_PROPERTY_ID = import.meta.env.VITE_TAWK_PROPERTY_ID;
const TAWK_WIDGET_ID = import.meta.env.VITE_TAWK_WIDGET_ID;

const helpTopics = [
    {
        title: "Getting started",
        description:
            "Learn how to set up your company and get started with InvoiceNgine.",
        icon: <FiBookOpen />
    },
    {
        title: "Documents and invoicing",
        description:
            "Find guidance on creating and managing your business documents.",
        icon: <FiHelpCircle />
    },
    {
        title: "Account and subscriptions",
        description:
            "Get help with your account, company settings and subscription.",
        icon: <FiMessageCircle />
    }
];

const faqs = [
    {
        question: "How do I get started with InvoiceNgine?",
        answer:
            "Start by completing your company setup, reviewing your company settings and adding your customers. You can then begin creating your business documents."
    },
    {
        question: "How can I manage my subscription?",
        answer:
            "Open your profile menu and select Subscription & Billing, if your account has the required permission."
    },
    {
        question: "How do I get help with a problem?",
        answer:
            "Start a live chat with our support team using the Chat with support button below. You can also submit a support request on this page or contact us by email."
    }
];

export default function HelpSupport() {
    const [search, setSearch] = useState("");
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [chatReady, setChatReady] = useState(false);
    const [supportIdentity, setSupportIdentity] = useState(null);

    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [submittingTicket, setSubmittingTicket] = useState(false);
    const [ticketError, setTicketError] = useState("");
    const [ticketSuccess, setTicketSuccess] = useState(null);

    const chatConfigured = Boolean(
        TAWK_PROPERTY_ID && TAWK_WIDGET_ID
    );

    useEffect(() => {
        let cancelled = false;

        const loadSupportIdentity = async () => {
            try {
                const response = await http.get("/support/identity");

                if (cancelled) {
                    return;
                }

                const data = response.data;

                setSupportIdentity({
                    name: data?.name || "",
                    email: data?.email || "",
                    companyName: data?.companyName || ""
                });
            } catch {
                if (!cancelled) {
                    setSupportIdentity(null);
                }
            }
        };

        loadSupportIdentity();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!chatConfigured) {
            return undefined;
        }

        let cancelled = false;

        window.Tawk_API = window.Tawk_API || {};

        const api = window.Tawk_API;

        if (typeof api.maximize === "function") {
            if (typeof api.showWidget === "function") {
                api.showWidget();
            }

            setChatReady(true);

            return () => {
                if (typeof api.hideWidget === "function") {
                    api.hideWidget();
                }
            };
        }

        api.onLoad = () => {
            if (cancelled) {
                return;
            }

            setChatReady(true);

            if (typeof api.showWidget === "function") {
                api.showWidget();
            }
        };

        const scriptId = "invoicengine-tawk-widget";
        let script = document.getElementById(scriptId);

        if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.async = true;
            script.src =
                `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
            script.charset = "UTF-8";
            script.setAttribute("crossorigin", "*");

            document.body.appendChild(script);
        }

        return () => {
            cancelled = true;

            if (typeof api.hideWidget === "function") {
                api.hideWidget();
            }
        };
    }, [chatConfigured]);

    useEffect(() => {
        if (!chatReady || !supportIdentity) {
            return;
        }

        const api = window.Tawk_API;

        if (typeof api?.setAttributes !== "function") {
            return;
        }

        const attributes = {};

        if (supportIdentity.name) {
            attributes.name = supportIdentity.name;
        }

        if (supportIdentity.email) {
            attributes.email = supportIdentity.email;
        }

        if (supportIdentity.companyName) {
            attributes.organization = supportIdentity.companyName;
        }

        if (Object.keys(attributes).length === 0) {
            return;
        }

        api.setAttributes(attributes, (error) => {
            if (error) {
                console.warn(
                    "InvoiceNgine could not update the Tawk.to visitor attributes."
                );
            }
        });
    }, [chatReady, supportIdentity]);

    const openLiveChat = useCallback(() => {
        const api = window.Tawk_API;

        if (
            !chatConfigured ||
            typeof api?.maximize !== "function"
        ) {
            return;
        }

        if (typeof api.showWidget === "function") {
            api.showWidget();
        }

        api.maximize();
    }, [chatConfigured]);

    const handleTicketSubmit = async (event) => {
        event.preventDefault();

        setTicketError("");
        setTicketSuccess(null);

        const trimmedSubject = subject.trim();
        const trimmedDescription = description.trim();

        if (
            trimmedSubject.length < 5 ||
            trimmedSubject.length > 200
        ) {
            setTicketError(
                "The subject must contain between 5 and 200 characters."
            );
            return;
        }

        if (
            trimmedDescription.length < 10 ||
            trimmedDescription.length > 10000
        ) {
            setTicketError(
                "Please describe your issue using between 10 and 10,000 characters."
            );
            return;
        }

        setSubmittingTicket(true);

        try {
            const response = await http.post("/support/tickets", {
                subject: trimmedSubject,
                description: trimmedDescription
            });

            setTicketSuccess({
                id: response.data?.id,
                message:
                    response.data?.message ||
                    "Your support request has been submitted successfully."
            });

            setSubject("");
            setDescription("");
        } catch (error) {
            const responseData = error?.response?.data;

            let message =
                "We could not submit your support request. Please try again.";

            if (typeof responseData?.message === "string") {
                message = responseData.message;
            } else if (typeof responseData === "string") {
                message = responseData;
            } else if (responseData?.errors) {
                const validationMessages = Object.values(
                    responseData.errors
                )
                    .flat()
                    .filter(Boolean);

                if (validationMessages.length > 0) {
                    message = validationMessages.join(" ");
                }
            }

            setTicketError(message);
        } finally {
            setSubmittingTicket(false);
        }
    };

    const normalizedSearch = search.trim().toLowerCase();

    const filteredTopics = helpTopics.filter((topic) =>
        `${topic.title} ${topic.description}`
            .toLowerCase()
            .includes(normalizedSearch)
    );

    const filteredFaqs = faqs.filter((faq) =>
        `${faq.question} ${faq.answer}`
            .toLowerCase()
            .includes(normalizedSearch)
    );

    return (
        <div className="help-support-page">
            <section className="help-support-hero">
                <div className="help-support-hero-icon">
                    <FiHelpCircle />
                </div>

                <p className="help-support-eyebrow">
                    INVOICENGINE SUPPORT
                </p>

                <h1>How can we help you?</h1>

                <p className="help-support-hero-description">
                    Find answers, explore help topics or contact
                    our support team for assistance.
                </p>

                <div className="help-support-search">
                    <FiSearch />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search help topics and questions..."
                        aria-label="Search help topics and questions"
                    />
                </div>
            </section>

            <section className="help-support-section">
                <div className="help-support-section-heading">
                    <div>
                        <h2>Browse help topics</h2>
                        <p>Find guidance for common tasks.</p>
                    </div>
                </div>

                <div className="help-support-topic-grid">
                    {filteredTopics.map((topic) => (
                        <article
                            className="help-support-topic-card"
                            key={topic.title}
                        >
                            <div className="help-support-topic-icon">
                                {topic.icon}
                            </div>

                            <h3>{topic.title}</h3>
                            <p>{topic.description}</p>
                        </article>
                    ))}

                    {filteredTopics.length === 0 && (
                        <p className="help-support-empty">
                            No matching help topics found.
                        </p>
                    )}
                </div>
            </section>

            <section className="help-support-section">
                <div className="help-support-section-heading">
                    <div>
                        <h2>Frequently asked questions</h2>
                        <p>Answers to some common questions.</p>
                    </div>
                </div>

                <div className="help-support-faq-list">
                    {filteredFaqs.map((faq) => {
                        const isExpanded =
                            expandedFaq === faq.question;

                        return (
                            <article
                                className="help-support-faq"
                                key={faq.question}
                            >
                                <button
                                    type="button"
                                    className="help-support-faq-question"
                                    onClick={() =>
                                        setExpandedFaq(
                                            isExpanded
                                                ? null
                                                : faq.question
                                        )
                                    }
                                    aria-expanded={isExpanded}
                                >
                                    <span>{faq.question}</span>

                                    <FiChevronDown
                                        className={
                                            isExpanded
                                                ? "help-support-faq-chevron is-open"
                                                : "help-support-faq-chevron"
                                        }
                                    />
                                </button>

                                {isExpanded && (
                                    <p className="help-support-faq-answer">
                                        {faq.answer}
                                    </p>
                                )}
                            </article>
                        );
                    })}

                    {filteredFaqs.length === 0 && (
                        <p className="help-support-empty">
                            No matching questions found.
                        </p>
                    )}
                </div>
            </section>

            {/* Customer support ticket submission */}
            <section className="help-support-ticket">
                <div className="help-support-ticket-heading">
                    <div className="help-support-ticket-icon">
                        <FiMail />
                    </div>

                    <div>
                        <h2>Submit a support request</h2>
                        <p>
                            Describe the issue you are experiencing.
                            Our support team will review your request.
                        </p>
                    </div>
                </div>

                {ticketSuccess && (
                    <div
                        className="help-support-ticket-message is-success"
                        role="status"
                    >
                        <FiCheckCircle />

                        <div>
                            <strong>{ticketSuccess.message}</strong>

                            {ticketSuccess.id && (
                                <p>
                                    Your reference number is{" "}
                                    <strong>#{ticketSuccess.id}</strong>.
                                    Please keep it for your records.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {ticketError && (
                    <div
                        className="help-support-ticket-message is-error"
                        role="alert"
                    >
                        <FiAlertCircle />
                        <span>{ticketError}</span>
                    </div>
                )}

                <form
                    className="help-support-ticket-form"
                    onSubmit={handleTicketSubmit}
                >
                    <div className="help-support-ticket-field">
                        <label htmlFor="support-ticket-subject">
                            Subject
                        </label>

                        <input
                            id="support-ticket-subject"
                            type="text"
                            value={subject}
                            onChange={(event) =>
                                setSubject(event.target.value)
                            }
                            placeholder="Briefly describe the issue"
                            minLength={5}
                            maxLength={200}
                            required
                            disabled={submittingTicket}
                        />

                        <small>
                            {subject.length}/200 characters
                        </small>
                    </div>

                    <div className="help-support-ticket-field">
                        <label htmlFor="support-ticket-description">
                            How can we help?
                        </label>

                        <textarea
                            id="support-ticket-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Explain what happened, what you were trying to do, and any error message you received."
                            minLength={10}
                            maxLength={10000}
                            rows={6}
                            required
                            disabled={submittingTicket}
                        />

                        <small>
                            {description.length}/10,000 characters
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="help-support-ticket-submit"
                        disabled={submittingTicket}
                    >
                        <FiSend />

                        {submittingTicket
                            ? "Submitting request..."
                            : "Submit support request"}
                    </button>
                </form>
            </section>

            <section className="help-support-live-chat">
                <div className="help-support-chat-icon">
                    <FiMessageCircle />
                </div>

                <div className="help-support-chat-content">
                    <h2>Chat with our support team</h2>

                    <p>
                        Need assistance now? Start a live conversation
                        with the InvoiceNgine support team.
                    </p>

                    {!chatConfigured && (
                        <p className="help-support-chat-note">
                            Live chat will be available once the
                            chat widget has been configured.
                        </p>
                    )}

                    {chatConfigured && !chatReady && (
                        <p className="help-support-chat-note">
                            Connecting to live chat...
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    className="help-support-chat-button"
                    onClick={openLiveChat}
                    disabled={!chatConfigured || !chatReady}
                >
                    <FiMessageCircle />

                    {chatReady
                        ? "Start live chat"
                        : "Live chat unavailable"}
                </button>
            </section>

            <section className="help-support-contact">
                <div className="help-support-contact-icon">
                    <FiMail />
                </div>

                <div className="help-support-contact-content">
                    <h2>Prefer email?</h2>

                    <p>
                        Contact our support team if you need
                        assistance with InvoiceNgine.
                    </p>
                </div>

                <a
                    className="help-support-contact-button"
                    href="mailto:info@dubiquitytechnology.com?subject=InvoiceNgine%20Support"
                >
                    Contact support
                    <FiMail />
                </a>
            </section>
        </div>
    );
}