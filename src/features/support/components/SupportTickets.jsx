import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock, CheckCircle } from "lucide-react";

export default function SupportTickets({ tickets }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
      case "closed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (!tickets || tickets.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50">
              <div className="flex items-start gap-4">
                {getStatusIcon(ticket.status)}
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {ticket.category || "general"}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      ticket.priority === "urgent" ? "bg-red-100 text-red-800" :
                      ticket.priority === "high" ? "bg-orange-100 text-orange-800" :
                      ticket.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium capitalize">
                {ticket.status?.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}