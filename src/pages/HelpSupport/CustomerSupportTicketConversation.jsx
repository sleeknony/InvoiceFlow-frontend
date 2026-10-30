
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiMessageCircle } from "react-icons/fi";

import http from "../../api/http";
import { useAuth } from "../../context/useAuth";
import SupportConversation from "../../components/Support/SupportConversation";

import "./CustomerSupportTicketConversation.css";

export default function CustomerSupportTicketConversation() {
    const { ticketId } = useParams();
    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadTicket() {
            setLoading(true);
            setError("");

            try {
                const response = await http.get(
                    `/support/tickets/${ticketId}`
                );

                if (!cancelled) {
                    setTicket(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.response?.status === 404
                            ? "This support ticket could not be found."
                            : err?.response?.data?.message ||
                            "Unable to load this support ticket."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadTicket();

        return () => {
            cancelled = true;
        };
    }, [ticketId]);

    if (loading) {
        return (
            <div className="customer-support-conversation-page">
                <p>Loading support conversation...</p>
            </div>
        );
    }

    return (
        <div className="customer-support-conversation-page">
            <Link
                to="/help"
                className="customer-support-back-link"
            >
                <FiArrowLeft />
                Back to Help & Support
            </Link>

            {error ? (
                <div className="customer-support-error" role="alert">
                    {error}
                </div>
            ) : ticket ? (
                <>
                    <header className="customer-support-conversation-header">
                        <FiMessageCircle size={25} />

                        <div>
                            <h1>{ticket.subject}</h1>
                            <p>
                                Ticket #{ticket.id} - {ticket.status}
                            </p>
                        </div>
                    </header>

                    <section className="customer-support-original-request">
                        <h2>Your original request</h2>
                        <p>{ticket.description}</p>
                    </section>

                    <SupportConversation
                        ticketId={Number(ticketId)}
                        canReply={ticket.status !== "Closed"}
                        canUseInternalNotes={false}
                        currentUserId={user?.id}
                    />
                </>
            ) : null}
        </div>
    );
}
