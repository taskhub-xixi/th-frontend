"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { jobSchema } from "@/features/jobs/schemas/jobSchema";
import { jobsApi } from "@/lib/api/jobs";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const JobForm = ({ initialData = null, mode = "create", jobId = null }) => {
  const isEdit = mode === "edit";
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with validation schema
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      budget: initialData?.budget?.toString() || "",
      category_id: initialData?.category_id?.toString() || "",
      commitment: initialData?.commitment || "",
      deadline: initialData?.deadline || "",
      description: initialData?.description || "",
      experience_level: initialData?.experience_level || "",
      location: initialData?.location || "",
      payment_type: initialData?.payment_type || "",
      skills: initialData?.skills || "",
      status: initialData?.status || "open",
      title: initialData?.title || "",
      work_type: initialData?.work_type || "",
    },
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        if (!jobId) {
          setError("Job ID is required for editing");
          return;
        }

        const jobData = {
          ...data,
          budget: Number.parseFloat(data.budget),
          category_id: data.category_id ? Number.parseInt(data.category_id) : null,
          deadline: data.deadline || null,
          location: data.location || null,
        };

        const response = await jobsApi.updateJob(jobId, jobData);
        if (response.success) {
          toast("Job updated successfully", {
            action: {
              label: "Close",
              onClick: () => console.log("Closed"),
            },
            description: "Success!",
          });
          router.push(`/dashboard/jobs/${jobId}`);
          router.refresh();
        } else {
          const errorInfo = handleApiError(
            new Error(response.message || "Failed to update job"),
            "Failed to update job",
          );
          setError(errorInfo.message);
          toast.error(errorInfo.toastMessage, {
            description: "Error",
          });
        }
      } else {
        const jobData = {
          ...data,
          budget: Number.parseFloat(data.budget),
          category_id: data.category_id ? Number.parseInt(data.category_id) : null,
          deadline: data.deadline || null,
          location: data.location || null,
        };

        const response = await jobsApi.createJob(jobData);
        if (response.success) {
          toast("Job updated successfully", {
            action: {
              label: "Close",
              onClick: () => console.log("Closed"),
            },
            description: "Success!",
          });
          router.push(`/dashboard/jobs/${response.job.id}`);
          router.refresh();
        } else {
          const errorInfo = handleApiError(
            new Error(response.message || "Failed to create job"),
            "Failed to create job",
          );
          setError(errorInfo.message);
          toast.error(errorInfo.toastMessage, {
            description: "Error",
          });
        }
      }
    } catch (err) {
      const errorInfo = showErrorToast(err, "An error occurred while submitting the job");
      setError(errorInfo.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user is a poster
  if (user?.role !== "poster") {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">
            Only posters can create jobs. Please select the "poster" role in your profile.
          </p>
          <Button onClick={() => router.push("/role")}>Go to Role Selection</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Job" : "Post a New Job"}</h1>
        <p className="text-gray-600 mt-2">
          {isEdit
            ? "Update the details of your job posting"
            : "Fill out the form to post a new job"}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Field>
              <FieldLabel>Job Title *</FieldLabel>
              <FieldGroup>
                <Input placeholder="e.g., Build a responsive website" {...field} />
              </FieldGroup>
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Field>
              <FieldLabel>Job Description *</FieldLabel>
              <FieldGroup>
                <Textarea
                  placeholder="Describe the job requirements, responsibilities, and any other important details..."
                  rows={6}
                  {...field}
                />
              </FieldGroup>
              {errors.description && <FieldError>{errors.description.message}</FieldError>}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <FieldGroup>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Web Development</SelectItem>
                      <SelectItem value="2">Design</SelectItem>
                      <SelectItem value="3">Writing</SelectItem>
                      <SelectItem value="4">Marketing</SelectItem>
                      <SelectItem value="5">Data Entry</SelectItem>
                      <SelectItem value="6">Mobile Development</SelectItem>
                      <SelectItem value="7">Consulting</SelectItem>
                      <SelectItem value="8">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                {errors.category_id && <FieldError>{errors.category_id.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <Field>
                <FieldLabel>Budget ($) *</FieldLabel>
                <FieldGroup>
                  <Input placeholder="e.g., 500" step="0.01" type="number" {...field} />
                </FieldGroup>
                {errors.budget && <FieldError>{errors.budget.message}</FieldError>}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <Field>
                <FieldLabel>Deadline (Optional)</FieldLabel>
                <FieldGroup>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        variant={"outline"}
                      >
                        {field.value ? (
                          new Date(field.value).toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        disabled={(date) => date < new Date()}
                        initialFocus
                        mode="single"
                        onSelect={(date) => field.onChange(date ? date : null)}
                        selected={field.value ? new Date(field.value) : undefined}
                      />
                    </PopoverContent>
                  </Popover>
                </FieldGroup>
                {errors.deadline && <FieldError>{errors.deadline.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <Field>
                <FieldLabel>Location (Optional)</FieldLabel>
                <FieldGroup>
                  <Input placeholder="e.g., Remote, Jakarta, etc." {...field} />
                </FieldGroup>
                {errors.location && <FieldError>{errors.location.message}</FieldError>}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="work_type"
            render={({ field }) => (
              <Field>
                <FieldLabel>Work Type</FieldLabel>
                <FieldGroup>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                {errors.work_type && <FieldError>{errors.work_type.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="commitment"
            render={({ field }) => (
              <Field>
                <FieldLabel>Commitment</FieldLabel>
                <FieldGroup>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commitment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                {errors.commitment && <FieldError>{errors.commitment.message}</FieldError>}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="experience_level"
            render={({ field }) => (
              <Field>
                <FieldLabel>Experience Level</FieldLabel>
                <FieldGroup>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="experienced">Experienced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                {errors.experience_level && (
                  <FieldError>{errors.experience_level.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="payment_type"
            render={({ field }) => (
              <Field>
                <FieldLabel>Payment Type</FieldLabel>
                <FieldGroup>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="project">Project Based</SelectItem>
                      <SelectItem value="milestone">Milestone Based</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                {errors.payment_type && <FieldError>{errors.payment_type.message}</FieldError>}
              </Field>
            )}
          />
        </div>

        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <Field>
              <FieldLabel>Required Skills (Optional)</FieldLabel>
              <FieldDescription>Separate multiple skills with commas</FieldDescription>
              <FieldGroup>
                <Input placeholder="e.g., JavaScript, React, Node.js" {...field} />
              </FieldGroup>
              {errors.skills && <FieldError>{errors.skills.message}</FieldError>}
            </Field>
          )}
        />

        {isEdit && (
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldGroup>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                {errors.status && <FieldError>{errors.status.message}</FieldError>}
              </Field>
            )}
          />
        )}

        <div className="flex gap-4 pt-4">
          <Button className="w-full md:w-auto" disabled={submitting} type="submit">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Posting..."}
              </>
            ) : isEdit ? (
              "Update Job"
            ) : (
              "Post Job"
            )}
          </Button>

          <Button
            className="w-full md:w-auto"
            disabled={submitting}
            onClick={() => router.back()}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
