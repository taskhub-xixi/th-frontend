"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, User, XCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { applicationsApi } from "@/lib/api";
import { getUserAvatar } from "@/lib/dicebearAvatar";

const ApplicationCard = ({ application, isPosted }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatBudget = (budget) => {
    if (!budget) return "N/A";
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(0)}k`;
    }
    return `$${budget.toLocaleString()}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow" key={application.id}>
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img
                src={isPosted
                  ? getUserAvatar({ name: application.tasker_name, id: application.tasker_id })
                  : getUserAvatar({ name: application.poster_name || application.job_title, id: application.poster_id })
                }
                alt={isPosted
                  ? `${application.tasker_name || 'Tasker'} avatar`
                  : `${application.poster_name || application.job_title || 'Job'} avatar`
                }
                className="w-full h-full rounded-lg object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((isPosted ? (application.tasker_name || 'Tasker') : (application.poster_name || application.job_title || 'Job')).substring(0, 2))}&background=0ea5e9&color=fff&size=64`;
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base md:text-lg text-foreground break-words">
                  {isPosted
                    ? `${application.tasker_name || "Tasker"} applied to ${application.job_title}`
                    : application.job_title}
                </h3>
                {application.proposal && (
                  <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                    {application.proposal.substring(0, 100)}
                  </p>
                )}
              </div>

              {/* Status Badge - Desktop */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                {getStatusIcon(application.status)}
                <Badge variant={getStatusVariant(application.status)}>
                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Info Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm mb-4 pb-4 border-b border-border">
              <span className="flex items-center gap-1 text-gray-600">
                <User className="h-3 w-3" />
                <span className="font-medium">
                  {isPosted ? application.tasker_name || "Tasker" : application.poster_name || "Job Poster"}
                </span>
              </span>

              {(isPosted ? application.proposed_budget : application.job_budget) && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium">
                    {formatBudget(isPosted ? application.proposed_budget : application.job_budget)}
                  </span>
                </>
              )}

              {application.job_status && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600">{application.job_status}</span>
                </>
              )}

              {/* Status Badge - Mobile */}
              <div className="flex sm:hidden items-center gap-2 ml-auto">
                {getStatusIcon(application.status)}
                <Badge variant={getStatusVariant(application.status)} className="text-xs">
                  {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Applied Date + Main Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Applied: {formatDate(application.created_at)}</span>
                </div>
                <Link href={`/dashboard/jobs/${application.job_id}`} className="sm:ml-auto">
                  <Button className="w-full sm:w-auto text-xs md:text-sm" size="sm">
                    View Job
                  </Button>
                </Link>
              </div>



              {/* Accept/Reject Buttons - Only for Posted Jobs with Pending Status */}
              {isPosted && application.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs md:text-sm bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await applicationsApi.acceptApplication(application.id);

                        if (response.success) {
                          toast.success("Application accepted successfully", {
                            description: `${application.tasker_name || "Tasker"} can now start working on ${application.job_title}`,
                          });
                          // Reload page to show updated status
                          setTimeout(() => window.location.reload(), 1500);
                        } else {
                          toast.error("Failed to accept application", {
                            description: response.message || "Please try again",
                          });
                        }
                      } catch (error) {
                        console.error("Accept error:", error);
                        toast.error("Failed to accept application", {
                          description: "An error occurred while accepting application",
                        });
                      }
                    }}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Accept
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 text-xs md:text-sm bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await applicationsApi.rejectApplication(application.id);

                        if (response.success) {
                          toast.success("Application rejected", {
                            description: "The applicant has been notified",
                          });
                          // Reload page to show updated status
                          setTimeout(() => window.location.reload(), 1500);
                        } else {
                          toast.error("Failed to reject application", {
                            description: response.message || "Could not reject application",
                          });
                        }
                      } catch (error) {
                        console.error("Reject error:", error);
                        toast.error("Failed to reject application", {
                          description: "An error occurred while rejecting application",
                        });
                      }
                    }}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>

                  <Link href={`/dashboard/jobs/${application.job_id}/applicants`}>
                    <Button
                      variant="outline"
                      className="text-xs md:text-sm"
                      size="sm"
                    >
                      All Applicants
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
