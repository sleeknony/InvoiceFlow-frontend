import { useEffect, useState } from "react";
import companyTeamService from "../../services/companyTeamService";
import TeamStats from "./components/TeamStats";
import TeamFilters from "./components/TeamFilters";
import TeamTable from "./components/TeamTable";
import PendingInvitations from "./components/PendingInvitations";
import InviteMemberModal from "./components/InviteMemberModal";
import "./TeamManagement.css"
import { FiUserPlus, FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";
import EditMemberModal from "./components/EditMemberModal";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
/*import BulkInviteModal from "./BulkInvite/BulkInviteModal";*/

export default function TeamManagement() {

    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("");

    const [status, setStatus] = useState("");

    const [invitations, setInvitations] = useState([]);

    const [showInviteModal, setShowInviteModal] = useState(false);

    /*const [showBulkInviteModal, setShowBulkInviteModal] =   useState(false);*/

    const [roles, setRoles] = useState([]);

   /* const [permissions, setPermissions] = useState([]);*/

    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);

   

    const navigate = useNavigate();
  
    useEffect(() => {

        loadMembers();

        loadInvitations();

       /* loadAvailablePermissions();*/

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

    //async function loadAvailablePermissions() {

    //    try {

    //        const data =
    //            await companyTeamService
    //                .getAvailablePermissions();

    //        setPermissions(data);

    //    }
    //    catch (err) {

    //        toast.error("Unable to load permissions.");

    //    }

    //}

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

    async function handleToggleStatus(member) {

        const action =
            member.isActive
                ? "deactivate"
                : "activate";

        const result = await Swal.fire({
            title: `${action === "deactivate" ? "Deactivate" : "Activate"} member?`,
            text:
                action === "deactivate"
                    ? `${member.firstName} ${member.lastName} will no longer be able to access the company.`
                    : `${member.firstName} ${member.lastName} will regain access to the company.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText:
                action === "deactivate"
                    ? "Yes, deactivate"
                    : "Yes, activate",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed)
            return;

        try {

            if (member.isActive) {

                await companyTeamService
                    .deactivateMember(member.id);

            }
            else {

                await companyTeamService
                    .reactivateMember(member.id);

            }

            await loadMembers();

            toast.success(
                member.isActive
                    ? "Member deactivated successfully."
                    : "Member activated successfully."
            );

        }
        catch (err) {

            toast.error(
                err?.response?.data?.message ||
                err?.response?.data ||
                `Unable to ${action} member.`
            );

        }
    }


    async function handleRemoveMember(member) {

        const result = await Swal.fire({

            title: "Remove team member?",

            text:
                `${member.firstName} ${member.lastName} will be removed from this company.`,

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, remove member",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#dc2626"

        });

        if (!result.isConfirmed)
            return;

        try {

            await companyTeamService
                .removeMember(member.id);

            await loadMembers();

            toast.success(
                "Team member removed successfully."
            );

        }
        catch (err) {

            toast.error(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to remove team member."
            );

        }
    }

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

                <div className="team-header-actions">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                            navigate("/team/bulk-invite")
                        }
                    >
                        <FiUpload />
                        Bulk Invite
                    </button>

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                            setShowInviteModal(true)
                        }
                    >
                        <FiUserPlus />
                        Invite Member
                    </button>

                </div>

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
                    onToggleStatus={handleToggleStatus}
                    onRemove={handleRemoveMember}

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
               
            />

            {/*<BulkInviteModal*/}

            {/*    open={showBulkInviteModal}*/}

            {/*    onClose={() =>*/}
            {/*        setShowBulkInviteModal(false)*/}
            {/*    }*/}

            {/*    onSuccess={async () => {*/}

            {/*        await loadInvitations();*/}

            {/*        await loadMembers();*/}

            {/*    }}*/}

            {/*/>*/}

            <EditMemberModal

                open={showEditModal}

                member={selectedMember}

                roles={roles}

               

                onClose={() => {

                    setShowEditModal(false);

                    setSelectedMember(null);

                }}

                onSuccess={handleMemberUpdated}

            />

        </div>     

    );

}