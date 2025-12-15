"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "../hooks/useProfile";
import { profileSchema } from "../schemas/profileSchema";
import { useAuth } from "@/context/AuthContext";

export default function ProfileEdit() {
  const { user, isLoading } = useAuth();
  const { isSaving, isUploadingAvatar, saveProfile, handleAvatarUpload } = useProfile();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          bio: user.bio || "",
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
        }
      : undefined,
  });

  const onSubmit = async (data) => {
    try {
      await saveProfile(data);
    } catch (_error) {
      // Error handled in useProfile hook
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    try {
      await handleAvatarUpload(file);
    } catch (_error) {
      setAvatarPreview(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="relative w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
          onClick={triggerFileInput}
        >
          {avatarPreview || user?.avatar ? (
            <img
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              src={avatarPreview || user?.avatar}
            />
          ) : (
            <User className="w-8 h-8 text-gray-500" />
          )}
          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user?.firstName || user?.name || "Name"}</h3>
          <p className="text-sm text-gray-500">{user?.email || "Email Address"}</p>
        </div>
        <input
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          ref={fileInputRef}
          type="file"
        />
      </div>

      {/* Account Info Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-xl font-semibold mb-4">Account info</h2>

          {/* Email (Read-only) */}
          <div className="mb-4">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder={user?.email || "Email"}
              type="email"
              {...register("email")}
              className="bg-gray-50 cursor-not-allowed"
              disabled
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* First Name */}
          <div className="mb-4">
            <Label className="sr-only" htmlFor="firstName">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder={user?.firstName || "First Name"}
              type="text"
              {...register("firstName")}
              disabled={isSaving}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <Label className="sr-only" htmlFor="lastName">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              type="text"
              {...register("lastName")}
              disabled={isSaving}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="mb-4">
            <Label className="sr-only" htmlFor="phone">
              Phone
            </Label>
            <Input
              id="phone"
              placeholder="Phone Number (Optional)"
              type="tel"
              {...register("phone")}
              disabled={isSaving}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          {/* Bio (Optional) */}
          <div className="mb-4">
            <Label className="sr-only" htmlFor="bio">
              Bio
            </Label>
            <textarea
              id="bio"
              placeholder="Bio (Optional)"
              {...register("bio")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaving}
              rows={4}
            />
            {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
          </div>

          {/* Save Button */}
          <Button
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={isSaving || isUploadingAvatar}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
