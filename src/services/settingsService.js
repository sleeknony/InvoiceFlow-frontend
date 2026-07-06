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
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return res.data;
};
