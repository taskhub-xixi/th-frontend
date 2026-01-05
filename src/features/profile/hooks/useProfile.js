import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api/auth";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { profileApi } from "@/lib/api/profile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Helper function to ensure avatar URL points to backend
const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://taskhub-be.vercel.app${url.startsWith("/") ? "" : "/"}${url}`;
};

export function useProfile() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName: user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [avatar, setAvatar] = useState(getAvatarUrl(user?.avatar) || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [role, setRole] = useState(user?.role || "tasker");
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);
  const [showProfileUpdateDialog, setShowProfileUpdateDialog] = useState(false);
  const [showRoleUpdateDialog, setShowRoleUpdateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName:
          user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      setAvatar(getAvatarUrl(user.avatar) || "");
      setRole(user.role || "tasker");
    }
  }, [user]); // Gunakan hanya user sebagai dependency untuk mencegah infinite loop

  // Update role state when user.role changes
  useEffect(() => {
    if (user && user.role) {
      setRole(user.role);
    }
  }, [user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowProfileUpdateDialog(true);
  };

  const confirmProfileUpdate = async () => {
    setLoading(true);
    setShowProfileUpdateDialog(false);

    try {
      const response = await profileApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
      });

      if (response.success) {
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          bio: formData.bio,
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      showErrorToast(error, "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) {
      return;
    }

    // Validate file type before upload
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showErrorToast(new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.'), "Invalid file type");
      return;
    }

    // Validate file size (max 5MB as per backend)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showErrorToast(new Error('File size too large. Please upload an image smaller than 5MB.'), "File size too large");
      return;
    }

    setLoading(true);

    try {
      const response = await profileApi.updateAvatar(file);

      if (response.success) {
        // Extract avatar URL from response using multiple possible properties
        let avatarUrl = response.avatarUrl || response.avatar;

        // If avatar URL is still not found, check nested properties
        if (!avatarUrl && response.profile) {
          avatarUrl = response.profile.avatar;
        }
        if (!avatarUrl && response.user) {
          avatarUrl = response.user.avatar;
        }

        if (avatarUrl) {
          // Ensure the avatar URL is properly formatted
          if (!avatarUrl.startsWith("http")) {
            avatarUrl = `https://taskhub-be.vercel.app${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
          }

          updateUser({ avatar: avatarUrl });
          toast.success("Avatar updated successfully!");
        } else {
          console.warn('Avatar URL not found in response:', response);
          showErrorToast(new Error('Avatar uploaded but URL not returned from server'), "Upload issue");
        }
      } else {
        // Handle case where response.success is false
        const errorMessage = response.message || 'Failed to upload avatar';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      showErrorToast(error, "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    setShowRoleUpdateDialog(true);
  };

  const confirmRoleUpdate = async () => {
    setIsRoleUpdating(true);
    setShowRoleUpdateDialog(false);

    try {
      const response = await profileApi.updateRole(role);

      if (response.success) {
        // Update user context dengan data yang dikembalikan dari API
        updateUser({
          role: role,
          ...(response.user || {}), // Tambahkan data user lain jika ada
        });
        toast.success("Role updated successfully!");
        // toast({
        //   title: "Success",
        //   description: `Role updated to ${role} successfully!`,
        // });

        // Set role state agar sesuai dengan role yang baru sebelum refresh
        setRole(role);

        // Refresh data user dari server untuk memastikan konsistensi
        try {
          const userResponse = await profileApi.getProfile();
          if (userResponse && userResponse.profile) {
            updateUser(userResponse.profile);
          }
        } catch (refreshError) {
          showErrorToast(refreshError, "There was an issue refreshing your profile data.");
        }
      }
    } catch (error) {
      showErrorToast(error, "Failed to update role");
    } finally {
      setIsRoleUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      showErrorToast(error, "There was an issue logging out. Please try again.");
    } finally {
      // Always clear auth state
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("csrf_token");
      }
      // Redirect to login
      router.push("/login");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file before processing
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showErrorToast(new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.'), "Invalid file type");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.onerror = () => {
      showErrorToast(new Error('Failed to read the selected file'), "File read error");
    };
    reader.readAsDataURL(file);

    // Only upload after preview is set
    handleAvatarUpload(file);
  };

  return {
    user,
    loading,
    formData,
    setFormData,
    avatarPreview,
    role,
    setRole,
    isRoleUpdating,
    showProfileUpdateDialog,
    setShowProfileUpdateDialog,
    showRoleUpdateDialog,
    setShowRoleUpdateDialog,
    handleSubmit,
    confirmProfileUpdate,
    handleRoleUpdate,
    confirmRoleUpdate,
    handleLogout,
    handleAvatarChange,
    router
  };
}
