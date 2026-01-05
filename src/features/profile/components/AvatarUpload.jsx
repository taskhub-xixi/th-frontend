import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Camera } from "lucide-react";

// Helper function to ensure avatar URL points to backend
const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://taskhub-be.vercel.app${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function AvatarUpload({ user, loading, handleAvatarChange, avatarPreview }) {
  const avatar = getAvatarUrl(user?.avatar) || "";

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Profile Picture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
            {avatar || avatarPreview ? (
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src={avatarPreview || avatar}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Update your profile picture
              </h3>
              <p className="text-sm text-gray-600">
                Recommended: Square image, at least 400x400 pixels. JPG,
                PNG, or GIF.
              </p>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />

              <Button
                onClick={() =>
                  document.getElementById("avatar-upload").click()
                }
                size="sm"
                variant="outline"
                disabled={loading}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                {avatar ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
