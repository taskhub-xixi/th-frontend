import { useState, useEffect } from "react";
import { profileApi } from "@/lib/api/profile";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export function useSettings() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    notifications_enabled: true,
    email_new_applications: true,
    email_job_updates: true,
    email_messages: true,
    email_reviews: true,
    sms_notifications: false,
    push_notifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "system", // Default to system theme
  });

  // Load settings from backend on page load
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await profileApi.getSettings();
        if (response.success && response.settings) {
          // Separate notification settings from appearance settings
          const { appearance: appearanceSettings, ...notificationSettings } = response.settings;
          setNotifications(notificationSettings);

          // Set appearance settings if they exist
          if (appearanceSettings) {
            setAppearance(appearanceSettings);
            // Apply theme if it's specified
            if (appearanceSettings.theme) {
              setTheme(appearanceSettings.theme);
            }
          } else {
            // Default to system theme if no appearance settings exist
            setAppearance({ theme: "system" });
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Check if it's a timeout error
        if (
          error.code === "ECONNABORTED" ||
          error.message?.includes("timeout")
        ) {
          toast.info({
            title: "Info",
            description: "Settings load timed out. Using default settings.",
          });
        } else if (error.response?.status === 401) {
          // Session expired
          toast.error({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive",
          });
        } else {
          // Graceful fallback for any other error
          toast.info({
            title: "Info",
            description: "Using default settings",
          });
        }
      } finally {
        setInitialLoading(false);
      }
    };

    if (user) {
      loadSettings();
    } else {
      setInitialLoading(false);
    }
  }, [user, toast, setTheme]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Combine notification and appearance settings
      const allSettings = {
        ...notifications,
        appearance: {
          ...appearance,
          theme: theme // Update theme to current theme
        }
      };

      // Save notification settings
      const response = await profileApi.updateSettings(notifications);

      // Save appearance settings separately
      const appearanceResponse = await profileApi.updateAppearance(appearance);

      if (response.success && appearanceResponse.success) {
        toast.success({
          title: "Success!",
          description: "Settings saved successfully",
        });
      } else {
        const errorMessage = response.message || appearanceResponse.message || "Failed to save settings";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await profileApi.deleteAccount();

      if (response.success) {
        toast.success({
          title: "Account Deleted",
          description: "Your account has been successfully deleted",
        });
        // Redirect to home page or login page after deletion
        router.push("/");
        // Optionally clear user session here
      } else {
        throw new Error(response.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    user,
    loading,
    initialLoading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    notifications,
    setNotifications,
    appearance,
    setAppearance,
    handleSaveSettings,
    handleDeleteAccount,
    handleCancel,
    theme
  };
}