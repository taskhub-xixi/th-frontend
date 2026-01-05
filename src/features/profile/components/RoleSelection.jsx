import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";
import { Check } from "lucide-react";

export default function RoleSelection({
  user,
  handleRoleUpdate,
  role,
  setRole,
  isRoleUpdating,
}) {
  const [showDialog, setShowDialog] = useState(false);

  const roles = [
    {
      id: "tasker",
      name: "Tasker",
      description: "Find and complete jobs posted by others",
      icon: "👤",
    },
    {
      id: "poster",
      name: "Poster",
      description: "Post jobs and hire freelancers",
      icon: "📋",
    },
  ];

  const selectedRoleData = roles.find((r) => r.id === role);
  const isRoleChanged = role !== user.role;

  const handleConfirm = () => {
    handleRoleUpdate();
    setShowDialog(false);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Account Role</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Select Your Role
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  role === r.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-border hover:border-gray-300 bg-card hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{r.icon}</span>
                  {role === r.id && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {r.name}
                </h3>
                <p className="text-xs text-muted-foreground">{r.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Role Info */}
        {!isRoleChanged && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Your role is already set to <span className="font-medium text-foreground">{user.role}</span>
            </p>
          </div>
        )}

        {/* Selected Role Summary */}
        {isRoleChanged && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              You're switching to{" "}
              <span className="font-semibold">{selectedRoleData?.name}</span> role
            </p>
          </div>
        )}

        {/* Update Button */}
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <Button
            onClick={() => setShowDialog(true)}
            disabled={isRoleUpdating || !isRoleChanged}
            className="w-full"
          >
            {isRoleUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription>
                You're about to change your role from{" "}
                <span className="font-semibold text-foreground">
                  {user.role}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-foreground">
                  {selectedRoleData?.name}
                </span>
                . This action will affect your dashboard and available features.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
