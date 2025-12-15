"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, uploadAvatar } from "../api/profileApi";
import { toast } from "sonner";
import { handleApiError } from "@/lib/errorHandler";

export function useProfile() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const saveProfile = async (profileData) => {
    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile(profileData);

      // Update AuthContext - single source of truth
      updateUser({
        ...user,
        ...updatedProfile,
      });

      toast.success("Profile updated successfully!");
      return updatedProfile;
    } catch (error) {
      const errorInfo = handleApiError(error, "Failed to update profile");
      toast.error(errorInfo.toastMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    // Validate file
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const result = await uploadAvatar(file);

      const avatarURL =
        result.avatarURL || result.url || result.avatar || result.useProfile.avatarURL || null;

      // Update AuthContext with new avatar
      updateUser({
        ...user,
        avatar: avatarURL,
      });

      toast.success("Avatar uploaded successfully!");
      return result;
    } catch (error) {
      const errorInfo = handleApiError(error, "Failed to upload avatar");
      toast.error(errorInfo.toastMessage);
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return {
    handleAvatarUpload,
    isSaving,
    isUploadingAvatar,
    saveProfile,
  };
}
