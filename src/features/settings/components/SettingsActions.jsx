import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SettingsActions({ loading, onSave, onCancel }) {
  return (
    <div className="mt-6 flex gap-4">
      <Button disabled={loading} onClick={onSave}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
      <Button onClick={onCancel} variant="outline">
        Cancel
      </Button>
    </div>
  );
}