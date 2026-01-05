import { useAuth } from "@/context/AuthContext";

/**
 * Hook untuk mengecek dan mendapatkan informasi role pengguna
 */
export const useUserRole = () => {
  const { user, isLoading } = useAuth();

  const getUserRole = () => {
    if (!user) return null;
    return user.role ? user.role.toLowerCase() : null;
  };

  const isRole = (expectedRole) => {
    if (!(user && user.role)) return false;
    return user.role.toLowerCase() === expectedRole.toLowerCase();
  };

  const hasRole = () => {
    return !!user?.role;
  };

  const getRoleDisplay = () => {
    if (!user?.role) return "Belum Dipilih";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return {
    getRoleDisplay: getRoleDisplay,
    hasRole: hasRole(),
    isLoading,
    isPoster: isRole("poster"),
    isTasker: isRole("tasker"),
    userRole: getUserRole(),
  };
};
