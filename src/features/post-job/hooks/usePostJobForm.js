"use client";
import { jobsApi } from "@/lib/api/jobs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createJobSchema } from "@/features/jobs/schemas/jobSchema";

// Hanya field yang didukung backend
const initialFormData = {
  budget: "",
  category: "",
  commitment: "full-time",
  deadline: "",
  description: "",
  experience_level: "intermediate",
  location: "",
  payment_type: "fixed",
  skills: "",
  title: "",
  work_type: "remote",
};

export function usePostJobForm(user) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const editJobId = searchParams.get("edit");

    if (editJobId) {
      fetchJobForEdit(editJobId);
    }

    if (user && user.role !== "poster") {
      toast.error("Access Denied", {
        description: "Only posters can create job listings",
      });

      router.push("/dashboard");
    }
  }, [user]);

  const fetchJobForEdit = async (id) => {
    try {
      const response = await jobsApi.getJobById(id);
      const job = response.job || response;

      setJobId(id);
      setFormData({
        budget: job.budget ? job.budget.toString() : "",
        category: job.category_id ? job.category_id.toString() : "",
        commitment: job.commitment || "full-time",
        deadline: job.deadline ? job.deadline.split("T")[0] : "",
        description: job.description || "",
        experience_level: job.experience_level || "intermediate",
        location: job.location || "",
        payment_type: job.payment_type || "fixed",
        skills: job.skills || "",
        title: job.title || "",
        // FIELD BARU:
        work_type: job.work_type || "remote",
      });
    } catch (error) {
      console.error("Error fetching job for edit:", error);
      toast.error("Error", {
        description: "Failed to load job data for editing",
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Prepare data for validation - handle potential NaN values for coerce
    const dataToValidate = {
      budget: formData.budget ? Number.parseFloat(formData.budget) : undefined,
      category_id: formData.category ? Number.parseInt(formData.category) : null,
      commitment: formData.commitment,
      deadline: formData.deadline || null,
      description: formData.description || "",
      experience_level: formData.experience_level,
      location: formData.location || null,
      payment_type: formData.payment_type,
      skills: formData.skills || null,
      title: formData.title || "",
      work_type: formData.work_type,
    };

    // Validate using Zod schema
    const validationResult = createJobSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      // Convert Zod errors to form errors
      const errors = {};
      if (validationResult.error && validationResult.error.errors) {
        validationResult.error.errors.forEach((error) => {
          errors[error.path[0]] = { message: error.message };
        });
      }

      setFormErrors(errors);

      // Show first error as toast
      if (
        validationResult.error &&
        validationResult.error.errors &&
        validationResult.error.errors.length > 0
      ) {
        const firstError = validationResult.error.errors[0];
        toast.error("Validation Error", {
          description: firstError.message,
        });
      } else {
        toast.error("Validation Error", {
          description: "There are validation errors in the form",
        });
      }

      return false;
    }

    // Clear errors if validation passes
    setFormErrors({});

    return true;
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error("Login Required", {
        description: "Please login to post a job",
      });
      router.push("/login");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Hanya kirim field yang didukung backend
      const jobData = {
        budget: Number.parseFloat(formData.budget),
        commitment: formData.commitment,
        deadline: formData.deadline || null,
        description: formData.description.trim(),
        experience_level: formData.experience_level,
        location: formData.location?.trim() || null,
        payment_type: formData.payment_type,
        skills: formData.skills || null,
        title: formData.title.trim(),

        work_type: formData.work_type,
      };

      // Hanya kirim category_id jika ada nilai
      if (formData.category && formData.category.trim() !== "") {
        jobData.category_id = Number.parseInt(formData.category);
      }

      if (jobId) {
        await jobsApi.updateJob(jobId, jobData);
        toast.success("Job Updated!", {
          description: "Your job listing has been updated successfully.",
        });
      } else {
        await jobsApi.createJob(jobData);
        toast.success("Job Published!", {
          description: "Your job listing is now live and visible to taskers.",
        });
      }

      if (jobId) {
        router.push(`/dashboard/jobs/${jobId}`);
      } else {
        router.push("/dashboard/jobs"); // atau "/dashboard/my-jobs" jika ada
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to publish job. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast.error("Login Required", {
        description: "Please login to save a job draft",
      });
      router.push("/login");
      return;
    }

    setIsSavingDraft(true);

    try {
      // Hanya kirim field yang didukung backend
      const jobData = {
        budget: Number.parseFloat(formData.budget),
        commitment: formData.commitment,
        deadline: formData.deadline || null,
        description: formData.description.trim(),
        experience_level: formData.experience_level,
        location: formData.location?.trim() || null,
        payment_type: formData.payment_type,
        skills: formData.skills,
        title: formData.title.trim(),
        work_type: formData.work_type,
      };

      // Hanya kirim category_id jika ada nilai
      if (formData.category && formData.category.trim() !== "") {
        jobData.category_id = Number.parseInt(formData.category);
      }

      let response;
      if (jobId) {
        response = await jobsApi.updateJob(jobId, jobData);
        toast.success("Job Updated!", {
          description: "Your job has been updated.",
        });
      } else {
        response = await jobsApi.createJob(jobData);
        toast.success("Job Created!", {
          description: "Your job has been created successfully.",
        });
      }

      if (response.job?.id && !jobId) {
        setJobId(response.job.id);
        window.history.replaceState({}, "", `?edit=${response.job.id}`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save job. Please try again.",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    formData,
    formErrors,
    handleBack,
    handleChange,
    handlePublish,
    handleSaveDraft,
    isSavingDraft,
    isSubmitting,
    jobId,
  };
}
