"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserRole } from "@/features/role/api/RoleApi";
import { handleApiError } from "@/lib/errorHandler";
import { toast } from "sonner";

export function useRole() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, updateUser } = useAuth();

  const handleRoleSelect = async (role) => {
    console.log("🔍 handleRoleSelect called with role:", role);
    setIsUpdating(true);
    try {
      const response = await updateUserRole(role);

      console.log("✅ Role update successful, response:", response);

      // Update user context dengan role baru
      updateUser({
        ...user,
        role: response.role, // response.role will be lowercase from backend
      });

      toast.success(`Role berhasil diubah menjadi ${role}`);
    } catch (error) {
      const errorInfo = handleApiError(error, "Gagal mengubah role");
      toast.error(errorInfo.toastMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleRoleSelect,
    isUpdating,
    setIsUpdating,
  };
}
