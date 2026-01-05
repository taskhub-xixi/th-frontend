import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthenticationGate({ router }) {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Who are you?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Please log in to access your profile settings
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button variant="outline" onClick={() => router.push("/register")}>
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}