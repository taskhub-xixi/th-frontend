import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccountSettings({ user }) {
  const router = useRouter();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Email Address</Label>
            <Input disabled type="email" value={user?.email || ""} />
          </div>
          <div>
            <Label>Username</Label>
            <Input disabled type="text" value={user?.name || ""} />
          </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard/profile")}
          variant="outline"
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}