"use client";

import { ApplyJobDialog } from "@/components/ApplyJobDialog";
import { ReviewSelection } from "@/components/reviews/ReviewSelection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { jobsApi } from "@/lib/api/jobs";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { getCompanyAvatar } from "@/lib/dicebearAvatar";
import {
  ArrowLeft,
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  MapPin,
  Target,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const id = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMarkedApplied, setIsMarkedApplied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);
  const [workSubmitted, setWorkSubmitted] = useState(false);
  const [savedJobsFromApi, setSavedJobsFromApi] = useState([]);

  // Fetch saved jobs from API when user is logged in
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return;

      try {
        const response = await jobsApi.getSavedJobs();
        // Handle different response formats
        if (response.savedJobs) {
          const savedJobIds = response.savedJobs.map((jobItem) => jobItem.id);
          setSavedJobsFromApi(savedJobIds);
        } else if (response.jobs) {
          const savedJobIds = response.jobs.map((jobItem) => jobItem.id);
          setSavedJobsFromApi(savedJobIds);
        }
      } catch (error) {
        showErrorToast(error, "Failed to load saved jobs");
      }
    };

    fetchSavedJobs();
  }, [user]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const data = await jobsApi.getJobById(id);
        // PERBAIKAN: Data bisa dalam bentuk { success, job } atau langsung job object
        const jobData = data.job || data;
        setJob(jobData);

        // Check if job is saved using multiple methods
        checkIfSaved(jobData);
      } catch (err) {
        const errorInfo = showErrorToast(err, "Failed to load job details");
        setError(errorInfo.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Improved function to check if job is saved
  const checkIfSaved = (jobData) => {
    if (!(user && jobData)) return false;

    const jobId = jobData.id || id;

    try {
      // Method 1: Check from API response (most reliable)
      if (savedJobsFromApi.length > 0) {
        const isSavedInApi = savedJobsFromApi.includes(Number.parseInt(jobId, 10));
        if (isSavedInApi) {
          setIsSaved(true);
          return true;
        }
      }

      // Method 2: Check localStorage as fallback
      const savedJobsFromStorage = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      const isSavedInStorage = savedJobsFromStorage.includes(Number.parseInt(jobId, 10));

      setIsSaved(isSavedInStorage);
      return isSavedInStorage;
    } catch (err) {
      showErrorToast(err, "Failed to check saved status");
      return false;
    }
  };

  // Improved toggle save function
  const handleToggleSave = async () => {
    if (!(job && user)) {
      toast.error("You need to be logged in to save jobs");
      return;
    }

    const jobId = job.id || id;

    try {
      setIsSaving(true);

      if (isSaved) {
        // Unsave job - cek dulu apakah job ada di saved jobs
        const savedJobsFromStorage = JSON.parse(localStorage.getItem("savedJobs") || "[]");
        const jobIdInt = Number.parseInt(jobId, 10);

        // Cek apakah job benar-benar ada di saved jobs sebelum mencoba unsave
        const isActuallySaved = savedJobsFromApi.includes(jobIdInt) ||
                               savedJobsFromStorage.includes(jobIdInt);

        if (!isActuallySaved) {
          // Jika tidak ada di saved jobs, set ke false dan return
          setIsSaved(false);
          return;
        }

        try {
          await jobsApi.unsaveJob(jobId);
        } catch (err) {
          // Jika API gagal, tetap update UI dan localStorage
          console.warn("API unsave failed, updating local state:", err);
        }

        setIsSaved(false);

        // Update API state
        setSavedJobsFromApi((prev) => prev.filter((savedId) => savedId !== jobIdInt));

        // Update localStorage
        localStorage.setItem(
          "savedJobs",
          JSON.stringify(savedJobsFromStorage.filter((j) => j !== jobIdInt)),
        );

        toast.success("Job removed from your saved list");
      } else {
        // Save job
        try {
          await jobsApi.saveJob(jobId);
        } catch (err) {
          // Jika API gagal, tetap update UI dan localStorage
          console.warn("API save failed, updating local state:", err);
        }

        setIsSaved(true);

        // Update API state
        const jobIdInt = Number.parseInt(jobId, 10);
        setSavedJobsFromApi((prev) => {
          if (!prev.includes(jobIdInt)) {
            return [...prev, jobIdInt];
          }
          return prev;
        });

        // Update localStorage
        const savedJobsFromStorage = JSON.parse(localStorage.getItem("savedJobs") || "[]");
        if (!savedJobsFromStorage.includes(jobIdInt)) {
          savedJobsFromStorage.push(jobIdInt);
          localStorage.setItem("savedJobs", JSON.stringify(savedJobsFromStorage));
        }

        toast.success("Job added to your saved list");
      }
    } catch (err) {
      showErrorToast(err, "Failed to update saved status");
    } finally {
      setIsSaving(false);
    }
  };

  // Mark as applied
  const handleMarkApplied = () => {
    setIsMarkedApplied(!isMarkedApplied);

    // Save to localStorage
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    const jobIdInt = Number.parseInt(id, 10);

    if (isMarkedApplied) {
      // Remove from applied
      localStorage.setItem(
        "appliedJobs",
        JSON.stringify(appliedJobs.filter((j) => j !== jobIdInt)),
      );
      toast.success("Job removed from applied list");
    } else {
      // Add to applied
      if (!appliedJobs.includes(jobIdInt)) {
        appliedJobs.push(jobIdInt);
      }
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
      toast.success("Job added to your applied list");
    }
  };

  // Check if job is already applied when component mounts
  useEffect(() => {
    if (id) {
      const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
      setIsMarkedApplied(appliedJobs.includes(Number.parseInt(id, 10)));
    }
  }, [id]);

  // Handle apply
  const handleApply = () => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      return;
    }

    // Check if user has already applied to this job
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    if (appliedJobs.includes(Number.parseInt(id, 10))) {
      toast.error("You have already applied to this job");
      return;
    }

    setApplyDialogOpen(true);
  };

  // Handle complete job
  const handleCompleteJob = async () => {
    if (!job) return;

    try {
      setIsCompleting(true);
      const response = await jobsApi.completeJob(job.id);

      if (response.success) {
        toast.success("Job completed successfully! Payment processed and notifications sent.");
        // Update job status in local state
        setJob({ ...job, status: "completed" });
        // Optionally redirect to my jobs
        setTimeout(() => {
          router.push("/dashboard/my-jobs");
        }, 1500);
      }
    } catch (error) {
      const errorInfo = showErrorToast(error, "Failed to complete job");
      console.error("Complete job error:", errorInfo);
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle submit work (for taskers)
  const handleSubmitWork = async () => {
    if (!job) return;

    try {
      setIsSubmittingWork(true);
      const response = await jobsApi.submitWork(job.id);

      if (response.success) {
        toast.success("Work submitted successfully! Waiting for poster to complete payment.");
        setWorkSubmitted(true);
        setJob({ ...job, status: "ready_for_payment" });
      }
    } catch (error) {
      const errorInfo = showErrorToast(error, "Failed to submit work");
      console.error("Submit work error:", errorInfo);
    } finally {
      setIsSubmittingWork(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format budget
  const formatBudget = (budget) => {
    if (!budget) return "Negotiable";
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(1)}k`;
    }
    return `$${budget.toLocaleString()}`;
  };

  // Parse skills dari string atau array
  const parseSkills = () => {
    if (!(job && job.skills)) return [];

    if (Array.isArray(job.skills)) {
      return job.skills;
    }

    if (typeof job.skills === "string") {
      return job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    return [];
  };

  // Get poster info
  const getPosterInfo = () => {
    if (!job) return { name: "Unknown", avatar: null };

    if (job.poster) {
      return {
        name: job.poster.name || job.poster.email || "Unknown",
        avatar: job.poster.avatar,
      };
    }

    // Fallback to poster_name if available
    if (job.poster_name) {
      return {
        name: job.poster_name,
        avatar: job.poster_avatar,
      };
    }

    return { name: "Unknown", avatar: null };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-muted-foreground">{error || "Job not found"}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/jobs")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  const skills = parseSkills();
  const posterInfo = getPosterInfo();

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Header - Poster Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={posterInfo.avatar || getCompanyAvatar({ name: posterInfo.name })}
            alt={posterInfo.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(posterInfo.name.substring(0, 2))}&background=0ea5e9&color=fff&size=40`;
            }}
          />
          <div>
            <span className="text-muted-foreground block text-sm md:text-base">
              Posted by {posterInfo.name}
            </span>
            <span className="text-muted-foreground text-xs md:text-sm">
              Posted {formatDate(job.created_at)}
            </span>
          </div>
        </div>

        {user && (
          <Button
            variant={isMarkedApplied ? "default" : "outline"}
            size="sm"
            className="gap-2 w-full sm:w-auto"
            onClick={handleMarkApplied}
          >
            <CheckCircle className="h-4 w-4" />
            {isMarkedApplied ? "Applied" : "Mark as applied"}
          </Button>
        )}
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location || "Remote"}
            </Badge>

            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {job.work_type || "Remote"}
            </Badge>

            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.commitment || "Contract"}
            </Badge>

            {job.deadline && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Deadline: {formatDate(job.deadline)}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Button */}
          <Button
            variant={isSaved ? "default" : "outline"}
            size="icon"
            onClick={handleToggleSave}
            disabled={isSaving || !user}
            className="h-10 w-10"
            title={isSaved ? "Remove from saved" : "Save job"}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          {/* Conditional rendering for Apply button */}
          {user?.role === "tasker" && job.status === "open" && (
            <Button onClick={handleApply} className="px-6">
              Apply Now
            </Button>
          )}

          {/* Tasker Submit Work button */}
          {user?.role === "tasker" && job.status === "in_progress" && !workSubmitted && (
            <Button
              onClick={() => handleSubmitWork()}
              className="px-6 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmittingWork}
            >
              {isSubmittingWork ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Work"
              )}
            </Button>
          )}

          {/* If user is poster, show actions based on job status */}
          {user?.role === "poster" && job.poster_id === user.id && (
            <>
              {job.status === "in_progress" && (
                <Button
                  onClick={() => handleCompleteJob()}
                  className="px-6 bg-green-600 hover:bg-green-700"
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Completing...
                    </>
                  ) : (
                    "Complete & Pay"
                  )}
                </Button>
              )}
              {job.status !== "completed" && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
                  className="px-6"
                >
                  Edit Job
                </Button>
              )}
            </>
          )}

          {/* If not logged in, show login button */}
          {!user && (
            <Button onClick={() => router.push("/login")} className="px-6">
              Login to Apply
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description || "No description available."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Job Info Sidebar */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Budget */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget
              </h3>
              <p className="text-2xl font-bold text-gray-900">{formatBudget(job.budget)}</p>
              {job.payment_type && (
                <p className="text-sm text-gray-500 mt-1">
                  Payment:{" "}
                  {job.payment_type.replace("_", " ").charAt(0).toUpperCase() +
                    job.payment_type.slice(1)}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Experience Level
              </h3>
              <Badge variant="secondary">
                {job.experience_level
                  ? job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)
                  : "Not specified"}
              </Badge>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="font-normal">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills specified</p>
                )}
              </div>
            </div>

            {/* Job Status */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Job Status
              </h3>
              <Badge
                variant={
                  job.status === "open"
                    ? "default"
                    : job.status === "in_progress"
                      ? "secondary"
                      : job.status === "completed"
                        ? "outline"
                        : "destructive"
                }
              >
                {job.status === "in_progress"
                  ? "In Progress"
                  : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>

            {/* Category */}
            {job.category_name && (
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <Badge variant="secondary">{job.category_name}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Work Type */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Work Type</h4>
                <p className="font-medium">
                  {job.work_type
                    ? job.work_type.charAt(0).toUpperCase() + job.work_type.slice(1)
                    : "Not specified"}
                </p>
              </div>

              {/* Commitment */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Commitment</h4>
                <p className="font-medium">
                  {job.commitment
                    ? job.commitment.replace("-", " ").charAt(0).toUpperCase() +
                      job.commitment.slice(1)
                    : "Not specified"}
                </p>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
                <p className="font-medium">
                  {job.deadline ? formatDate(job.deadline) : "No deadline"}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <p className="font-medium">{job.location || "Remote"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <ReviewSelection
        jobId={job.id}
        companyName={posterInfo.name}
        revieweeId={job.tasker_id || job.poster_id}
      />

      {/* Application Dialog - Only show for taskers */}
      {user?.role === "tasker" && (
        <ApplyJobDialog
          open={applyDialogOpen}
          onOpenChange={setApplyDialogOpen}
          jobTitle={job.title}
          company={posterInfo.name}
          jobId={job.id}
          onSubmit={() => {
            setIsMarkedApplied(true);
            toast.success(`Your application for "${job.title}" has been submitted.`);
          }}
        />
      )}

      {/* Back button */}
      <div className="pt-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard/jobs")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
    </div>
  );
}
