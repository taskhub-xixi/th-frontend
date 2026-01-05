"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applicationSchema } from "@/features/applications/schemas/applicationSchema";
import { jobsApi } from "@/lib/api/jobs";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

export function ApplyJobDialog({ open, onOpenChange, jobTitle, company, jobId, onSubmit }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      portfolio_link: "",
      proposal: "",
      proposed_budget: undefined,
    },
    resolver: zodResolver(applicationSchema),
  });

  const proposalValue = watch("proposal");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 5MB",
        });
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(`.${fileExtension}`)) {
          toast.error("Invalid file type", {
            description: "Please upload PDF, DOC, DOCX, or TXT files only",
          });
          return;
        }
      }

      setResumeFile(file);
    }
  };

  const onFormSubmit = async (formData) => {
    if (!jobId) {
      toast.error("Error", {
        description: "Job ID is missing",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("proposal", formData.proposal.trim());

      if (
        formData.proposed_budget !== undefined &&
        formData.proposed_budget !== null &&
        formData.proposed_budget !== ""
      ) {
        const budgetValue = Number.parseFloat(formData.proposed_budget);
        if (!isNaN(budgetValue)) {
          formDataToSend.append("proposed_budget", budgetValue.toString());
        }
      }

      if (formData.portfolio_link && formData.portfolio_link.trim() !== "") {
        formDataToSend.append("portfolio_link", formData.portfolio_link.trim());
      }

      if (formData.phone && formData.phone.trim() !== "") {
        formDataToSend.append("phone", formData.phone.trim());
      }

      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      }

      const response = await jobsApi.applyToJob(jobId, formDataToSend);

      if (response && !response.success) {
        throw new Error(response.message || "Failed to submit application");
      }

      reset();
      setResumeFile(null);

      if (onSubmit) {
        onSubmit({
          phone: formData.phone,
          portfolioLink: formData.portfolio_link,
          proposal: formData.proposal,
          proposedBudget: formData.proposed_budget,
          resumeFile,
        });
      }

      toast.success("Application submitted!", {
        description: `Your application for "${jobTitle}" has been submitted successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      let errorMessage = "Failed to submit application. Please try again.";

      if (error.response) {
        const responseData = error.response.data;
        errorMessage = responseData?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error("Submission failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setResumeFile(null);
    onOpenChange(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <DialogTitle className="text-xl">Apply for {jobTitle}</DialogTitle>
            <DialogDescription className="mt-1">
              Submit your application to {company}
            </DialogDescription>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 p-6">
          {/* Proposal */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Cover Letter / Proposal{" "}
              <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="proposal"
              render={({ field }) => (
                <>
                  <Textarea
                    className={`min-h-[140px] resize-none ${
                      errors.proposal ? "border-red-500" : ""
                    }`}
                    id="proposal"
                    placeholder="Tell us why you're a great fit for this role, your relevant experience, and why you're interested..."
                    {...field}
                  />
                  {errors.proposal && (
                    <p className="text-xs text-red-500 mt-2">{errors.proposal.message}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Please include your relevant experience
                    </p>
                    <p className="text-xs text-gray-500">
                      {proposalValue?.length || 0}/1000 characters
                    </p>
                  </div>
                </>
              )}
            />
          </div>

          {/* Budget & Phone - Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Proposed Budget */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Proposed Budget <span className="text-gray-400"></span>
              </label>
              <Controller
                control={control}
                name="proposed_budget"
                render={({ field }) => (
                  <>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        $
                      </span>
                      <Input
                        className={`pl-7 ${errors.proposed_budget ? "border-red-500" : ""}`}
                        id="proposed_budget"
                        min="0"
                        placeholder="e.g., 5000000"
                        step="1000"
                        type="number"
                        {...field}
                      />
                    </div>
                    {errors.proposed_budget && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.proposed_budget.message}
                      </p>
                    )}

                  </>
                )}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <>
                    <Input
                      className={errors.phone ? "border-red-500" : ""}
                      id="phone"
                      placeholder="+62 812 3456 7890"
                      type="tel"
                      {...field}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Portfolio Link */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Portfolio Link <span className="text-gray-400">(Optional)</span>
            </label>
            <Controller
              control={control}
              name="portfolio_link"
              render={({ field }) => (
                <>
                  <Input
                    className={errors.portfolio_link ? "border-red-500" : ""}
                    id="portfolio_link"
                    placeholder="https://your-portfolio.com"
                    type="url"
                    {...field}
                  />
                  {errors.portfolio_link && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.portfolio_link.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Link to your portfolio, GitHub, LinkedIn, or relevant work samples
                  </p>
                </>
              )}
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Resume / CV <span className="text-gray-400">(Optional)</span>
              <span className="text-xs text-gray-500 font-normal ml-2">
                PDF, DOC, DOCX, TXT (Max 5MB)
              </span>
            </label>
            <label className="block w-full px-4 py-3 border border-border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer bg-white">
              <input
                accept=".pdf,.doc,.docx,.txt"
                id="resume"
                onChange={handleFileChange}
                type="file"
                className="hidden"
              />
              <p className="font-medium text-sm text-foreground">
                {resumeFile ? resumeFile.name : "Browse..."}{" "}
                {!resumeFile && <span className="text-gray-500">No file selected.</span>}
              </p>
            </label>
            {resumeFile && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-blue-900 truncate">
                      {resumeFile.name}
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {formatFileSize(resumeFile.size)}
                    </p>
                  </div>
                  <button
                    className="ml-3 text-blue-600 hover:text-blue-700 text-xs font-medium whitespace-nowrap"
                    onClick={() => setResumeFile(null)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <DialogFooter className="border-t border-border p-6 bg-white">
          <Button
            disabled={isSubmitting}
            onClick={handleCancel}
            type="button"
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !proposalValue?.trim()}
            onClick={handleSubmit(onFormSubmit)}
            type="submit"
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
