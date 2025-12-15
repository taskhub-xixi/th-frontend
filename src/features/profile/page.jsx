"use client";

import ProfileEdit from "./components/ProfileEdit";
import ChangePassword from "./components/ChangePassword";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Edit Section */}
      <div>
        <ProfileEdit />
      </div>

      {/* Change Password Section */}
      <div>
        <ChangePassword />
      </div>
    </div>
  );
}
