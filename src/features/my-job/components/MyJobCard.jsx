import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, DollarSign, Eye, MapPin, MoreHorizontal, Pencil, Trash2, Users, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyJobCard({ job, onEdit, onView, onViewApplicants, onDelete }) {
  const router = useRouter();

  // Format budget
  const formatBudget = (budget) => {
    if (!budget) return "Negotiable";
    return `$${budget.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
      case "published":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Active
          </Badge>
        );
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            In Progress
          </Badge>
        );
      case "ready_for_payment":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Ready for Payment
          </Badge>
        );
      case "closed":
      case "completed":
        return (
          <Badge variant="outline" className="text-gray-500">
            Closed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get initials for logo
  const getInitials = (title) => {
    return title?.charAt(0).toUpperCase() || "J";
  };

  return (
    <Card
      key={job.id}
      className="border-border hover:shadow-md transition-shadow"
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {getInitials(job.title)}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    {job.title}
                  </h3>
                  {getStatusBadge(job.status)}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {job.description?.substring(0, 100) ||
                    "No description"}
                  ...
                </p>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onView(job.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(job.id)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {job.applicants_count > 0 && (
                      <DropdownMenuItem
                        onClick={() => onViewApplicants(job.id)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Applicants ({job.applicants_count})
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(job.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location || "Remote"}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatBudget(job.budget)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {job.applicants_count || 0} applicants
                </span>
              </div>
              <div className="flex items-center gap-2">
                {job.status === "ready_for_payment" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onViewApplicants(job.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-1" />
                    Complete Payment
                  </Button>
                )}
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Posted {formatDate(job.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
