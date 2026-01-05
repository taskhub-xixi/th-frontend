"use client";

import AccountSettings from "@/features/settings/components/AccountSettings";
import NotificationSettings from "@/features/settings/components/NotificationSettings";
import AppearanceSettings from "@/features/settings/components/AppearanceSettings";
import DangerZone from "@/features/settings/components/DangerZone";
import SettingsActions from "@/features/settings/components/SettingsActions";
import { useSettings } from "@/features/settings/hooks/useSettings";

export default function SettingsPageModular() {
  const {
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
    handleCancel
  } = useSettings();

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <AccountSettings user={user} />
      <NotificationSettings 
        notifications={notifications} 
        setNotifications={setNotifications} 
      />
      <AppearanceSettings 
        appearance={appearance} 
        setAppearance={setAppearance} 
      />
      <DangerZone 
        onDeleteAccount={handleDeleteAccount}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
      <SettingsActions 
        loading={loading}
        onSave={handleSaveSettings}
        onCancel={handleCancel}
      />
    </div>
  );
}