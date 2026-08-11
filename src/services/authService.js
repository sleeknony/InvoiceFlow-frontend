import http from "../api/http";

const authService = {

    verifyEmail(data) {

        return http.post(
            "/auth/verify-email",
            data
        );
    },

    resendVerificationCode(email) {

        return http.post(
            "/auth/resend-code",
            { email }
        );
    }

};

export default authService;