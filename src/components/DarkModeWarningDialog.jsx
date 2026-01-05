"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

export function DarkModeWarningDialog({ open, onOpenChange, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDialogTitle>Dark Mode Tidak Stabil</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-foreground mt-2">
            Kami masih mengerjakan optimasi dark mode. Beberapa warna dan tampilan mungkin tidak terlihat sempurna.
            <br />
            <br />
            Apakah Anda ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 justify-end mt-4">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Lanjutkan
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
