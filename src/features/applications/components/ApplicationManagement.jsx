"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { applicationsApi } from "@/lib/api/applications";
import { jobsApi } from "@/lib/api/jobs";
import { showErrorToast } from "@/lib/errorHandler";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ApplicationManagement = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [completingJobId, setCompletingJobId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "poster" || !jobId) {
      router.push("/dashboard/jobs");
      return;
    }

    fetchJobAndApplications();
  }, [jobId, user]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch job details
      const jobResponse = await jobsApi.getJobById(jobId);

      if (!jobResponse.success) {
        setError(jobResponse.message || "Failed to fetch job");
        return;
      }

      const jobData = jobResponse.job || jobResponse;
      setJob(jobData);

      // Check if user is the poster of this job
      if (jobData.poster_id !== user.id) {
        setError("You can only view applications for your own jobs");
        return;
      }

      // Fetch applications for this job - PASTIKAN API endpoint ini ada!
      const applicationsResponse = await applicationsApi.getJobApplications(jobId);

      if (applicationsResponse.success) {
        setApplications(applicationsResponse.applications || []);
      } else {
        setError(applicationsResponse.message || "Failed to fetch applications");
      }
    } catch (err) {
      const errorInfo = showErrorToast(err, "Failed to load data");
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Di handleAcceptApplication:
  const handleAcceptApplication = async (applicationId) => {
    try {
      const result = await new Promise((resolve) => {
        toast(
          <div className="w-full">
            <div className="flex flex-col space-y-2">
              <h4 className="font-semibold">Accept Application</h4>
              <p className="text-sm text-gray-600">
                This will reject all other applications for this job. Are you sure?
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    resolve(true);
                    toast.dismiss();
                  }}
                  size="sm"
                >
                  Yes, Accept
                </Button>
                <Button
                  onClick={() => {
                    resolve(false);
                    toast.dismiss();
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>,
          {
            duration: Number.POSITIVE_INFINITY, // Tidak auto dismiss
          },
        );
      });

      if (!result) return;

      const response = await applicationsApi.acceptApplication(applicationId);

      if (response.success) {
        await fetchJobAndApplications(); // Refresh data
        toast.success("Application accepted successfully", {
          description: "The tasker has been notified.",
        });
      } else {
        toast.error("Failed to accept application", {
          description: response.message || "Please try again",
        });
      }
    } catch (err) {
      showErrorToast(err, "Accept failed");
    }
  };

  // Di handleRejectApplication:
  const handleRejectApplication = async (applicationId) => {
    try {
      const result = await new Promise((resolve) => {
        toast(
          <div className="w-full">
            <div className="flex flex-col space-y-2">
              <h4 className="font-semibold">Reject Application</h4>
              <p className="text-sm text-gray-600">
                Are you sure you want to reject this application?
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    resolve(true);
                    toast.dismiss();
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Yes, Reject
                </Button>
                <Button
                  onClick={() => {
                    resolve(false);
                    toast.dismiss();
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>,
          {
            duration: Number.POSITIVE_INFINITY,
          },
        );
      });

      if (!result) return;

      const response = await applicationsApi.rejectApplication(applicationId);

      if (response.success) {
        await fetchJobAndApplications(); // Refresh data
        toast.success("Application rejected", {
          description: "The tasker has been notified.",
        });
      } else {
        toast.error("Failed to reject application", {
          description: response.message || "Please try again",
        });
      }
    } catch (err) {
      showErrorToast(err, "Reject failed");
    }
  };

  const handleCompleteJob = async () => {
    try {
      setCompletingJobId(jobId);
      const response = await jobsApi.completeJob(jobId);

      if (response.success) {
        toast.success("Job completed successfully! Payment processed.", {
          description: "The tasker has been notified.",
        });
        // Refresh data
        await fetchJobAndApplications();
        setActiveTab("completed");
      } else {
        toast.error(response.message || "Failed to complete job");
      }
    } catch (err) {
      showErrorToast(err, "Failed to complete job");
    } finally {
      setCompletingJobId(null);
    }
  };

  // Check authorization
  if (user?.role !== "poster") {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Only posters can view applications for their jobs.</p>
            <Button onClick={() => router.push("/dashboard/profile")}>Go to Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-4/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Alert className="mx-auto max-w-md" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => router.push(`/dashboard/jobs/${jobId}`)}>Back to Job</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if there's an accepted application
  const acceptedApplication = applications.find((app) => app.status === "accepted");

  // Job can be completed if it's in progress and has an accepted application
  const canCompleteJob = job?.status === "in_progress" && acceptedApplication;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <Button className="mb-4" onClick={() => router.back()} size="sm" variant="outline">
          ← Back to Job
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold">Applications for: {job?.title}</h1>
        <p className="text-gray-600 mt-2">Manage applications for your job posting</p>
      </div>

      {/* Job Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job Status</p>
              <Badge
                className="mt-1"
                variant={
                  job?.status === "open"
                    ? "default"
                    : job?.status === "in_progress"
                      ? "secondary"
                      : job?.status === "completed"
                        ? "outline"
                        : "destructive"
                }
              >
                {job?.status?.replace("_", " ") || "Unknown"}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="font-semibold mt-1">${job?.budget?.toLocaleString() || "0"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="font-semibold mt-1">{applications.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="font-semibold mt-1">
                {applications.filter((app) => app.status === "accepted").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Applications and Job Status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="ready-payment" className={job?.status === "ready_for_payment" ? "bg-amber-100" : ""}>
            Ready for Payment
          </TabsTrigger>
          <TabsTrigger value="completed" className={job?.status === "completed" ? "bg-green-100" : ""}>
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Applications */}
        <TabsContent value="applications" className="space-y-4">
          <CardTitle className="text-lg">Applications ({applications.length})</CardTitle>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-4">
                  No taskers have applied to this job yet. Check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
              <Card className="hover:shadow-md transition-shadow" key={application.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          alt={application.tasker_name || "Tasker"}
                          src={application.tasker_avatar}
                        />
                        <AvatarFallback>
                          {(application.tasker_name || "T").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {application.tasker_name || "Unknown Tasker"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {application.tasker_email || "No email"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="text-xs"
                        variant={
                          application.status === "pending"
                            ? "default"
                            : application.status === "accepted"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {application.status.toUpperCase()}
                      </Badge>
                      {application.status === "accepted" && (
                        <Badge className="text-xs bg-green-50 text-green-700" variant="outline">
                          SELECTED
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Application Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                    {application.proposed_budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          Proposed: ${Number(application.proposed_budget || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Proposal */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-gray-700">Proposal</h4>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-gray-700 whitespace-pre-line text-sm">
                        {application.proposal || "No proposal provided"}
                      </p>
                    </div>
                  </div>

                  {/* Actions for pending applications */}
                  {application.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAcceptApplication(application.id)}
                        size="sm"
                        variant="outline"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleRejectApplication(application.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>

        {/* Tab 2: Ready for Payment */}
        <TabsContent value="ready-payment" className="space-y-4">
          {job?.status === "ready_for_payment" ? (
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <Zap className="h-5 w-5" />
                  Ready for Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  The tasker has submitted work for this job. Review and process the payment below.
                </p>

                {/* Tasker Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Tasker Information</h4>
                  {acceptedApplication && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-600">Name:</span>{" "}
                        <span className="font-medium">{acceptedApplication.tasker_name}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Email:</span>{" "}
                        <span className="font-medium">{acceptedApplication.tasker_email}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Budget:</span>{" "}
                        <span className="font-medium">${job?.budget?.toLocaleString() || "0"}</span>
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteJob}
                  disabled={completingJobId === jobId}
                  size="lg"
                >
                  {completingJobId === jobId ? "Processing..." : "Complete Job & Process Payment"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Not Ready Yet</h3>
                <p className="text-gray-600">
                  Job must be in "Ready for Payment" status. Tasker needs to submit work first.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Completed */}
        <TabsContent value="completed" className="space-y-4">
          {job?.status === "completed" ? (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Job Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800">
                    ✅ This job has been successfully completed and payment has been processed to the tasker.
                  </p>
                </div>

                {acceptedApplication && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Completion Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Completed by:</span>{" "}
                        <span className="font-medium">{acceptedApplication.tasker_name}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Amount Paid:</span>{" "}
                        <span className="font-medium">${job?.budget?.toLocaleString() || "0"}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Not Completed Yet</h3>
                <p className="text-gray-600">
                  This job hasn't been completed yet. Complete it in the "Ready for Payment" tab.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationManagement;
