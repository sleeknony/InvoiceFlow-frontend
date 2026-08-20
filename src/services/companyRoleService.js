import http from "../api/http";

const companyRoleService = {

    async getRoles() {

        const { data } =
            await http.get("/company/roles");

        return data;
    },

    async getRole(id) {

        const { data } =
            await http.get(`/company/roles/${id}`);

        return data;
    },

    async createRole(payload) {

        const { data } =
            await http.post(
                "/company/roles",
                payload
            );

        return data;
    },

    async updateRole(id, payload) {

        const { data } =
            await http.put(
                `/company/roles/${id}`,
                payload
            );

        return data;
    },

    async deactivateRole(id) {

        const { data } =
            await http.delete(
                `/company/roles/${id}`
            );

        return data;
    },


    async reactivateRole(id) {

        const { data } =
            await http.put(
                `/company/roles/${id}/reactivate`
            );

        return data;
    },

};

export default companyRoleService;