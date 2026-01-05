"use client";
import { jobsApi } from "@/lib/api/jobs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { postJobFormSchema } from "../schemas/postJobSchema";

const defaultValues = {
  title: "",
  description: "",
  budget: "",
  location: "",
  work_type: "remote",
  commitment: "full-time",
  category: "0",
  experience_level: "intermediate",
  payment_type: "fixed",
  skills: "",
  deadline: "",
  additional_info: "",
};

export function usePostJobFormReactHookForm(user) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [jobId, setJobId] = useState(null);

  const form = useForm({
    resolver: zodResolver(postJobFormSchema),
    defaultValues,
  });

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
  }, [user, form]);

  const fetchJobForEdit = async (id) => {
    try {
      const response = await jobsApi.getJobById(id);
      const job = response.job || response;

      setJobId(id);
      form.reset({
        title: job.title || "",
        description: job.description || "",
        budget: job.budget ? job.budget.toString() : "",
        location: job.location || "",
        work_type: job.work_type || "remote",
        commitment: job.commitment || "full-time",
        category: job.category_id ? job.category_id.toString() : "0",
        experience_level: job.experience_level || "intermediate",
        payment_type: job.payment_type || "fixed",
        skills: job.skills || "",
        deadline: job.deadline ? job.deadline.split("T")[0] : "",
        additional_info: job.additional_info || "",
      });
    } catch (error) {
      console.error("Error fetching job for edit:", error);
      toast.error("Error", {
        description: "Failed to load job data for editing",
      });
    }
  };

  const prepareJobData = (data) => {
    return {
      title: data.title.trim(),
      description: data.description.trim(),
      budget: Number.parseFloat(data.budget),
      location: data.location?.trim() || null,
      work_type: data.work_type,
      commitment: data.commitment,
      category_id: data.category && data.category !== "0" ? Number.parseInt(data.category) : null,
      experience_level: data.experience_level,
      payment_type: data.payment_type,
      skills: data.skills?.trim() || null,
      deadline: data.deadline || null,
      additional_info: data.additional_info?.trim() || null,
    };
  };

  const handlePublish = async (data) => {
    if (!user) {
      toast.error("Login Required", {
        description: "Please login to post a job",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = prepareJobData(data);

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
        router.push("/dashboard/jobs");
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
      const data = form.getValues();
      const jobData = prepareJobData(data);

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
    form,
    handleSubmit: form.handleSubmit(handlePublish),
    handleSaveDraft,
    handleBack,
    isSubmitting,
    isSavingDraft,
    jobId,
  };
}
