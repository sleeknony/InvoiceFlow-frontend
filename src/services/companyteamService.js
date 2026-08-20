import http from "../api/http";

const companyTeamService = {

    async getMembers() {
        const { data } = await http.get("/company/team");
        return data;
    },

    async inviteMember(payload) {
        const { data } = await http.post(
            "/company/team/invite",
            payload
        );
        return data;
    },

    async updateMember(id, payload) {
        const { data } = await http.put(
            `/company/member/${id}`,
            payload
        );
        return data;
    },

    async changeRole(id, role) {
        const { data } = await http.put(
            `/company/member/${id}/role`,
            { role }
        );
        return data;
    },

    async changeStatus(id, isActive) {
        const { data } = await http.put(
            `/company/member/${id}/status`,
            { isActive }
        );
        return data;
    },

   
    async getAvailablePermissions() {

        const { data } =
            await http.get(
                "/company/team/permissions/available"
            );

        return data;

    },

    async getAvailableRoles() {

        const { data } =
            await http.get(
                "/company/team/roles/available"
            );

        return data;

    },


    async getInvitations() {

        const { data } =
            await http.get("/company/team/invitations");

        return data;

    },

   async resendInvitation(id) {

        await http.post(
            `/company/team/invitation/${id}/resend`
        );

    },

    async cancelInvitation(id) {

        await http.delete(
            `/company/team/invitation/${id}`
        );

    },

    async revokeInvitation(id) {
        const { data } = await http.delete(
            `/company/invitation/${id}`
        );
        return data;
    },

    async updateMember(id, request) {

        const { data } = await http.put(

            `/company/team/member/${id}`,

            request

        );

        return data;

    },


    async getInvitationByToken(token) {

        const { data } = await http.get(
            `/company/team/invitation/${token}`
        );

        return data;
    },

    async acceptInvitation(token) {

        const { data } = await http.post(
            `/company/team/accept/${token}`
        );

        return data;
    },


    async deactivateMember(id) {
        const { data } = await http.put(
            `/company/team/member/${id}/deactivate`
        );

        return data;
    },

    async reactivateMember(id) {
        const { data } = await http.put(
            `/company/team/member/${id}/reactivate`
        );

        return data;
    },

    async removeMember(id) {
        const { data } = await http.delete(
            `/company/team/member/${id}`
        );

        return data;
    },


    async downloadTeamInvitationTemplate() {

        const response =
            await http.get(
                "/company/team/import/template",
                {
                    responseType: "blob"
                }
            );

        const url =
            window.URL.createObjectURL(
                new Blob([response.data])
            );

        const link =
            document.createElement("a");

        link.href = url;

        link.setAttribute(
            "download",
            "InvoiceFlow-Team-Invitation-Template.xlsx"
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
    },

    // =========================================================
    // BULK INVITATIONS
    // =========================================================

    async previewBulkInvitations(file) {

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        const { data } =
            await http.post(
                "/company/team/bulk-invitations/preview",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

        return data;
    },



    async importBulkInvitations(rows) {

        const response =
        await http.post(
            "/company/team/bulk-invitations/import",
            {
                rows
            }
        );

return response.data;
}

};

export default companyTeamService;