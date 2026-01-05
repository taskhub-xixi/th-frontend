import apiClient from "@/lib/axios";

export const updateUserRole = async (role) => {
  console.log("🔍 updateUserRole called with role:", role);

  const response = await apiClient.put("/api/user/role", { role });
  console.log("✅ updateUserRole response:", response.data);

  return response.data;
};
