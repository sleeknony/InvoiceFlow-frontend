import http from "../api/http";

export const getSettings = async () => {
    const res = await http.get("/settings");
    return res.data;
};

export const updateSettings = async (data) => {
    const res = await http.post("/settings", data);
    return res.data;
};


export const saveSettings = updateSettings;

export const uploadLogo = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const res = await http.post(

        "/settings/logo",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return res.data;

};

export const uploadSignature = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const res = await http.post(

        "/settings/signature",

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return res.data;

};

export const toggleSignature = async (show) => {

    const res = await http.put(
        "/settings/signature-toggle",
        show,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    return res.data;
};


const BASE =
    "/settings/bankaccounts";

export async function getBankAccounts() {

    const { data } =
        await http.get(BASE);

    return data;
}

export async function createBankAccount(dto) {

    const { data } =
        await http.post(BASE, dto );

    return data;
}

export async function updateBankAccount(id, dto)
{

    const { data } =
        await http.put(
            `${BASE}/${id}`,
            dto
        );

    return data;
}

export async function archiveBankAccount(
    id
) {

    await http.delete(
        `${BASE}/${id}`
    );
}

export async function setDefaultBankAccount(
    id
) {

    await http.put(
        `${BASE}/${id}/default`
    );
}

export async function reorderBankAccounts(
    items
) {

    await http.put(
        `${BASE}/reorder`,
        items
    );
}