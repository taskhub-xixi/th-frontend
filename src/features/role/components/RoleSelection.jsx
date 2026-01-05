"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/features/role/hooks/useRole";

export default function RoleSelection() {
  const { handleRoleSelect } = useRole();
  const { isUpdating } = useRole();
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto p-6 pt-0">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Pilih Peran Anda</CardTitle>
          <CardDescription>Pilih apakah Anda ingin menjadi Poster atau Tasker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              disabled={isUpdating || user?.role === "poster"}
              onClick={() => handleRoleSelect("poster")}
            >
              {isUpdating ? "Memperbarui..." : "Saya adalah Poster"}
            </Button>
            <Button
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              disabled={isUpdating || user?.role === "tasker"}
              onClick={() => handleRoleSelect("tasker")}
            >
              {isUpdating ? "Memperbarui..." : "Saya adalah Tasker"}
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold">Poster</h3>
              <p className="text-sm">
                Poster adalah pengguna yang membuat dan memposting tugas-tugas yang perlu
                diselesaikan. Anda akan mencari seseorang untuk menyelesaikan tugas yang Anda
                perlukan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Tasker</h3>
              <p className="text-sm ">
                Tasker adalah pengguna yang menyelesaikan tugas-tugas yang diposting oleh Poster.
                Anda akan mencari tugas-tugas yang bisa Anda selesaikan untuk mendapatkan
                penghasilan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
