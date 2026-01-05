"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  CreditCard,
  AlertCircle,
  Loader2,
  Wallet,
  ArrowLeft,
  Star,
  MessageCircle,
} from "lucide-react";
import { jobsApi } from "@/lib/api/jobs";
import { applicationsApi } from "@/lib/api/applications";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "@/features/ratings/components/ReviewForm";
import PaymentConfirmationDialog from "@/components/payments/PaymentConfirmationDialog";

const JobPaymentCompletion = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [acceptedApplication, setAcceptedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchJobAndApplication();
    }
  }, [user, id]);

  const fetchJobAndApplication = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch job details
      const jobResponse = await jobsApi.getJobById(id);
      if (!jobResponse.success) {
        const errorInfo = handleApiError(
          new Error(jobResponse.message || "Failed to fetch job"),
          "Failed to fetch job",
        );
        setError(errorInfo.message);
        return;
      }

      const jobData = jobResponse.job;
      setJob(jobData);

      // Check if user is the poster
      if (jobData.poster_id !== user.id) {
        setError("You are not authorized to complete this job");
        return;
      }

      // Check if job is in the right status
      if (jobData.status !== "in_progress") {
        setError("Job must be in progress to complete");
        return;
      }

      // Fetch applications to find the accepted one
      const applicationsResponse = await applicationsApi.getJobApplications(id);
      if (applicationsResponse.success) {
        const acceptedApp = applicationsResponse.applications.find(
          (app) => app.status === "accepted",
        );
        setAcceptedApplication(acceptedApp || null);
      } else {
        const errorInfo = handleApiError(
          new Error(applicationsResponse.message || "Failed to fetch applications"),
          "Failed to fetch applications",
        );
        setError(errorInfo.message);
      }
    } catch (err) {
      const errorInfo = showErrorToast(err, "An error occurred while fetching data");
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!(job && acceptedApplication)) {
      setError("Job or application data is missing");
      return;
    }

    // Prepare payment details for confirmation
    const paymentDetails = {
      jobId: job.id,
      jobTitle: job.title,
      amount: job.budget,
      serviceFee: job.budget * 0.05, // 5% service fee
      total: job.budget * 1.05, // Total including service fee
      senderId: user.id,
      receiverId: acceptedApplication.tasker_id,
      senderName: user.name,
      receiverName: acceptedApplication.tasker_name,
    };

    // Show payment confirmation dialog
    setShowPaymentConfirmation(true);
  };

  const handleReviewSubmit = () => {
    // After review is submitted, redirect to job details or dashboard
    router.push(`/jobs/${job.id}`);
  };

  const handleConfirmPayment = async () => {
    if (!(job && acceptedApplication)) {
      setError("Job or application data is missing");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await jobsApi.completeJob(job.id);
      if (response.success) {
        // Trigger wallet refresh event
        localStorage.setItem("wallet_needs_refresh", Date.now().toString());
        window.dispatchEvent(new Event("wallet-updated"));

        // Show review form after successful completion
        setShowReviewForm(true);
        setShowPaymentConfirmation(false);
      } else {
        const errorInfo = handleApiError(
          new Error(response.message || "Failed to complete job and process payment"),
          "Failed to complete job and process payment",
        );
        setError(errorInfo.message);
      }
    } catch (err) {
      const errorInfo = showErrorToast(err, "An error occurred while completing the job");
      setError(errorInfo.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
  return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </div>
    );
}

if (error) {
  return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card className="text-center">
          <CardContent className="py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
}

if (!job) {
  return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card className="text-center">
          <CardContent className="py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're trying to complete doesn't exist.</p>
            <Button onClick={() => router.push("/jobs")}>Browse Jobs</Button>
          </CardContent>
        </Card>
      </div>
    );
}

if (!acceptedApplication) {
  return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card className="text-center">
          <CardContent className="py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Accepted Application</h2>
            <p className="text-gray-600 mb-6">
              There is no accepted application for this job. You must accept an application before
              completing the job.
            </p>
            <Button onClick={() => router.push(`/jobs/${job.id}`)}>View Job Applications</Button>
          </CardContent>
        </Card>
      </div>
    );
}

return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Button className="mb-4" onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job
        </Button>

        <h1 className="text-3xl font-bold">Complete Job & Process Payment</h1>
        <p className="text-gray-600 mt-2">
          Review the details and complete the job to release payment to the tasker
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Completion & Payment</CardTitle>
          <CardDescription>
            Review the job details and confirm payment to the tasker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Job Title</h3>
                <p className="text-gray-600">{job.title}</p>
              </div>
              <Badge variant="outline">{job.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Job Details</h3>
                <p className="text-sm">
                  <span className="text-gray-500">Budget:</span> ${job.budget.toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Location:</span> {job.location || "Remote"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Posted by:</span> {job.poster_name}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Tasker Details</h3>
                <p className="text-sm">
                  <span className="text-gray-500">Name:</span> {acceptedApplication.tasker_name}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Email:</span> {acceptedApplication.tasker_email}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Application:</span>
                  <Badge className="ml-2" variant="secondary">
                    {acceptedApplication.status}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Payment Amount:</span>
              <span className="text-green-600">${job.budget.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              This amount will be transferred to the tasker upon job completion
            </p>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
            <p className="text-sm text-blue-800">
              By completing this job, you confirm that the work has been satisfactorily completed
              and authorize the payment to be released to the tasker.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {showReviewForm ? (
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Rate Your Experience
              </h3>
              <p className="text-gray-600 mb-4">
                You've successfully completed this job. Would you like to rate your experience with{" "}
                {acceptedApplication?.tasker_name}?
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  After submitting your review, {acceptedApplication?.tasker_name} will also have
                  the opportunity to review you.
                </p>
              </div>

              {acceptedApplication && job && (
                <ReviewForm
                  job={job}
                  onSuccess={handleReviewSubmit}
                  reviewee={acceptedApplication}
                />
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Button
                className="flex-1"
                disabled={processing}
                onClick={() => router.back()}
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="flex-1" disabled={processing} onClick={handleCompleteJob}>
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Job & Pay
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Confirmation Dialog */}
      <PaymentConfirmationDialog
        isOpen={showPaymentConfirmation}
        onClose={() => setShowPaymentConfirmation(false)}
        paymentDetails={{
          jobId: job?.id,
          jobTitle: job?.title,
          amount: job?.budget,
          serviceFee: job?.budget ? job.budget * 0.05 : 0, // 5% service fee
          total: job?.budget ? job.budget * 1.05 : 0, // Total including service fee
          senderId: user?.id,
          receiverId: acceptedApplication?.tasker_id,
          senderName: user?.name,
          receiverName: acceptedApplication?.tasker_name,
        }}
        onSuccess={handleConfirmPayment}
      />
    </div>
  );
}

export default JobPaymentCompletion;
