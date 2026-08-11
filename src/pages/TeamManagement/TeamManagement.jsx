import { useEffect, useState } from "react";
import companyTeamService from "../../services/companyTeamService";
import TeamStats from "./components/TeamStats";
import TeamFilters from "./components/TeamFilters";
import TeamTable from "./components/TeamTable";
import PendingInvitations from "./components/PendingInvitations";
import InviteMemberModal from "./components/InviteMemberModal";
import "./TeamManagement.css"
import { FiUserPlus } from "react-icons/fi";
import Swal from "sweetalert2";
import EditMemberModal from "./components/EditMemberModal";
import toast from "react-hot-toast";

export default function TeamManagement() {

    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("");

    const [status, setStatus] = useState("");

    const [invitations, setInvitations] = useState([]);

    const [showInviteModal, setShowInviteModal] = useState(false);

    const [roles, setRoles] = useState([]);

    const [permissions, setPermissions] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);

  
    useEffect(() => {

        loadMembers();

        loadInvitations();

        loadAvailablePermissions();

        loadRoles();

    }, []);

    async function loadMembers() {

        try {

            setLoading(true);

            const data =
                await companyTeamService.getMembers();

            setMembers(data);

            setError("");

        }
        catch (err) {

            toast.error("Unable to load team members.");

            setError(
                err.response?.data ??
                "Unable to load team members."
            );
        }
        finally {

            setLoading(false);

        }

    }

    async function loadInvitations() {

        try {

            const data =
                await companyTeamService.getInvitations();

            setInvitations(data);

        }
        catch (err) {

            toast.error("Error getting invitations.");

        }

    }

    async function loadAvailablePermissions() {

        try {

            const data =
                await companyTeamService
                    .getAvailablePermissions();

            setPermissions(data);

        }
        catch (err) {

            toast.error("Unable to load permissions.");

        }

    }

    async function loadRoles() {

        try {

            const data =
                await companyTeamService
                    .getAvailableRoles();

            setRoles(data);

        }
        catch (err) {

            toast.error("Unable to load roles.");

        }

    }

    function handleEditMember(member) {

        setSelectedMember(member);

        setShowEditModal(true);

    }

    async function handleMemberUpdated() {

        await loadMembers();

        setShowEditModal(false);

        setSelectedMember(null);

    }

    const handleResendInvitation = async (id) => {

        await companyTeamService.resendInvitation(id);

        loadInvitations();

    };

    const handleCancelInvitation = async (id) => {

        const result = await Swal.fire({

            title: "Cancel invitation?",

            text: "The invitation will no longer be valid.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, cancel it",

            cancelButtonText: "No"

        });

        if (!result.isConfirmed)
            return;

        await companyTeamService.cancelInvitation(id);

        loadInvitations();

        Swal.fire(
            "Cancelled",
            "Invitation cancelled successfully.",
            "success"
        );

    };




    const filteredMembers = members.filter(member => {

        const fullName =
            `${member.firstName} ${member.lastName}`.toLowerCase();

        const matchesSearch =
            fullName.includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole =
            !role || member.roleName === role;

        const matchesStatus =
            !status ||
            (status === "Active" && member.isActive) ||
            (status === "Inactive" && !member.isActive);

        return matchesSearch && matchesRole && matchesStatus;

    });

   

    return (

        <div className="team-page">

            <div className="team-header">

                <div>

                    <h1>Team Management</h1>

                    <p>
                        Manage users, invitations and permissions.
                    </p>

                </div>

              

                <button
                    className="btn-primary"
                    onClick={() => setShowInviteModal(true)}
                >
                    <FiUserPlus />
                    Invite Member
                </button>

            </div>

            <TeamStats

                members={members}

                invitations={invitations}

            />

            <TeamFilters

                search={search}
                onSearchChange={setSearch}

                role={role}
                onRoleChange={setRole}

                status={status}
                onStatusChange={setStatus}

                onRefresh={loadMembers}

            />
           

            {!loading && !error && (

                <TeamTable

                    members={filteredMembers}

                    onEdit={handleEditMember}

                />

            )}

            <PendingInvitations

                invitations={invitations}

                onResend={handleResendInvitation}

                onCancel={handleCancelInvitation}

            />

            <InviteMemberModal
                open={showInviteModal}
                onClose={() =>
                    setShowInviteModal(false)
                }
                onSuccess={async () => {

                    await Promise.all([
                        loadMembers(),
                        loadInvitations()
                    ]);

                }}
                roles={roles}
                permissions={permissions}
            />

            <EditMemberModal

                open={showEditModal}

                member={selectedMember}

                roles={roles}

                permissions={permissions}

                onClose={() => {

                    setShowEditModal(false);

                    setSelectedMember(null);

                }}

                onSuccess={handleMemberUpdated}

            />

        </div>     

    );

}