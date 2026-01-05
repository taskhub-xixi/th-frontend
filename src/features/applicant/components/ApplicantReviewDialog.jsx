"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { applicationsApi } from "@/lib/api/applications";
import { getUserAvatar } from "@/lib/dicebearAvatar";
import {
  ArrowLeft,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

export default function ApplicantReviewDialog() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Fetch application details
  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await applicationsApi.getApplicationById(applicationId);
        const appData = response.application || response;
        setApplication(appData);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError(
          err.response?.data?.message || "Failed to load application details"
        );
        toast.error("Failed to load applicant details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  // Handle accept application
  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      const response = await applicationsApi.acceptApplication(applicationId);

      if (response.success) {
        toast.success("Application accepted successfully");
        setApplication((prev) => ({
          ...prev,
          status: "accepted",
        }));
        setTimeout(() => {
          router.push("/dashboard/applicant");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to accept application");
      }
    } catch (err) {
      console.error("Error accepting application:", err);
      toast.error("Failed to accept application");
    } finally {
      setIsAccepting(false);
    }
  };

  // Handle reject application
  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const response = await applicationsApi.rejectApplication(applicationId);

      if (response.success) {
        toast.success("Application rejected");
        setApplication((prev) => ({
          ...prev,
          status: "rejected",
        }));
        setTimeout(() => {
          router.push("/dashboard/applicant");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to reject application");
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      toast.error("Failed to reject application");
    } finally {
      setIsRejecting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "accepted":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          label: "Accepted",
          color: "bg-green-100 text-green-800 border-green-200",
          badgeVariant: "default",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5" />,
          label: "Rejected",
          color: "bg-red-100 text-red-800 border-red-200",
          badgeVariant: "destructive",
        };
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          badgeVariant: "secondary",
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          label: status,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          badgeVariant: "outline",
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-800 mb-4">{error || "Application not found"}</p>
            <Button onClick={() => router.push("/dashboard/applicant")}>
              Go to Applicants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.status);
  const userAvatar = getUserAvatar({
    name: application.user?.name,
    id: application.user?.id,
    email: application.user?.email,
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={userAvatar}
                alt={application.user?.name || "Applicant"}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <CardTitle className="text-2xl">
                  {application.user?.name || "Applicant"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Applied for{" "}
                  <span className="font-medium">
                    {application.job?.title || "Job"}
                  </span>
                </p>
              </div>
            </div>
            <Badge className={`${statusInfo.color} border`}>
              <span className="flex items-center gap-2">
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">
                {application.user?.email || "Not provided"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Bio</span>
              </div>
              <p className="text-sm text-gray-700 ml-6">
                {application.user?.experience || "Not provided"}
              </p>
            </div>
          </div>

          {/* Job Application Details */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Application Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Job Title</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {application.job?.title || "Not specified"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Applied Date</span>
                </div>
                <p className="text-sm text-gray-700 ml-6">
                  {formatDate(application.created_at || application.applied_at)}
                </p>
              </div>
            </div>

            {/* Proposal/Cover Letter */}
            {application.proposal && (
              <div className="space-y-2">
                <h4 className="font-medium">Proposal</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {application.proposal}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {application.status === "pending" && (
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300"
                onClick={handleReject}
                disabled={isRejecting || isAccepting}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </>
                )}
              </Button>

              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAccept}
                disabled={isAccepting || isRejecting}
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Application
                  </>
                )}
              </Button>
            </div>
          )}

          {application.status !== "pending" && (
            <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                This application has already been{" "}
                <span className="font-semibold">{application.status}</span>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
