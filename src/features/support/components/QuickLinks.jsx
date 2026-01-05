import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail } from "lucide-react";

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <MessageCircle className="h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-semibold mb-2">FAQ</h3>
          <p className="text-sm text-muted-foreground">Find answers to common questions</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <Mail className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <MessageCircle className="h-8 w-8 text-purple-500 mb-3" />
          <h3 className="font-semibold mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground">Chat with us in real-time</p>
        </CardContent>
      </Card>
    </div>
  );
}