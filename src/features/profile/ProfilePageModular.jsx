"use client";

import { useProfile } from "@/features/profile/hooks/useProfile";
import AccountInfo from "@/features/profile/components/AccountInfo";
import AvatarUpload from "@/features/profile/components/AvatarUpload";
import BasicInfoForm from "@/features/profile/components/BasicInfoForm";
import RoleSelection from "@/features/profile/components/RoleSelection";
import AuthenticationGate from "@/features/profile/components/AuthenticationGate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfilePageModular() {
  const {
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
  } = useProfile();

  // Jika user belum login, tampilkan halaman "Who are you?"
  if (!user) {
    return <AuthenticationGate router={router} />;
  }

  // Jika user sudah login, tampilkan halaman profile settings
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Logged in as:</span>
          <span className="font-medium text-gray-900">{user.email}</span>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Avatar and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar */}
          <AvatarUpload
            user={user}
            loading={loading}
            handleAvatarChange={handleAvatarChange}
            avatarPreview={avatarPreview}
          />

          {/* Basic Info */}
          <div>
            <AlertDialog open={showProfileUpdateDialog} onOpenChange={setShowProfileUpdateDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update your profile information? This action will save all the changes you've made.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmProfileUpdate}>Update Profile</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <BasicInfoForm
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Right: Role Selection and Account Info */}
        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <AlertDialog open={showRoleUpdateDialog} onOpenChange={setShowRoleUpdateDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Role Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update your account role to {role}? This action will change your account permissions and functionality.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmRoleUpdate}>Update Role</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <RoleSelection
              user={user}
              handleRoleUpdate={handleRoleUpdate}
              role={role}
              setRole={setRole}
              isRoleUpdating={isRoleUpdating}
            />
          </div>
          {/* Account Information */}
          <AccountInfo
            user={{ ...user, role: role }} // Pastikan role terbaru digunakan
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}