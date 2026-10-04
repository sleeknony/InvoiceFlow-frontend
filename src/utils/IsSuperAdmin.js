export function isSuperAdmin(user) {
    if (!user?.role) {
        return false;
    }

    if (Array.isArray(user.role)) {
        return user.role.includes("SuperAdmin");
    }

    return user.role === "SuperAdmin";
}