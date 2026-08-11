import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import companyTeamService from "../../services/companyTeamService";
import "./AcceptInvitation.css"; 

export default function AcceptInvitation() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [invitation, setInvitation] = useState(null);

    const [error, setError] = useState("");

    useEffect(() => {

        loadInvitation();

    }, []);

    async function loadInvitation() {

        try {

            const result =
                await companyTeamService
                    .getInvitationByToken(token);

            setInvitation(result);

        }
        catch (err) {

            setError(
                err?.response?.data?.message ||
                "Unable to load invitation."
            );

        }
        finally {

            setLoading(false);

        }

    }
    function handleAcceptInvitation() {

        localStorage.setItem(
            "pendingInvitationToken",
            token
        );

        navigate(
            `/invitation-register/${token}`
        );
    }

    //function handleLogin() {

    //    localStorage.setItem(
    //        "pendingInvitationToken",
    //        token
    //    );

    //    navigate("/login");
    //}

    //function handleRegister() {

    //    localStorage.setItem(
    //        "pendingInvitationToken",
    //        token
    //    );

    //    navigate("/register");
    //}

    if (loading) {

        return (
            <div className="container py-5">
                Loading invitation...
            </div>
        );

    }

    if (error) {

        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );

    }

    return (
        <div className="auth-wrapper">

            <div className="auth-container">

                <div className="auth-card invitation-card">

                    <div className="invitation-icon">
                        
                    </div>

                    <h2 className="auth-card-title">
                        You're Invited
                    </h2>

                    <p className="auth-card-subtitle">
                        You have been invited to join
                    </p>

                    <div className="invitation-company">
                        {invitation.companyName}
                    </div>

                    <div className="invitation-details">

                        <div className="invitation-row">

                            <span>Email</span>

                            <strong>
                                {invitation.email}
                            </strong>

                        </div>

                        <div className="invitation-row">

                            <span>Role</span>

                            <strong>
                                {invitation.role}
                            </strong>

                        </div>

                        <div className="invitation-row">

                            <span>Expires</span>

                            <strong>
                                {new Date(
                                    invitation.expiresAt
                                ).toLocaleDateString()}
                            </strong>

                        </div>

                    </div>

                    <button
                        className="auth-btn"
                        onClick={handleAcceptInvitation}
                    >
                        Accept Invitation
                    </button>

                </div>

            </div>

        </div>
    );
}