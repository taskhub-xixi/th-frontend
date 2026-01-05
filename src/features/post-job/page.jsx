"use client";

import { useAuth } from "@/context/AuthContext";
import BudgetPaymentForm from "@/features/post-job/components/BudgetPaymentForm";
import JobDetailsForm from "@/features/post-job/components/JobDetailsForm";
import LocationWorkSetupForm from "@/features/post-job/components/LocationWorkSetupForm";
import PostJobActions from "@/features/post-job/components/PostJobActions";
import PostJobHeader from "@/features/post-job/components/PostJobHeader";
import SkillsCategoryForm from "@/features/post-job/components/SkillsCategoryForm";
import { usePostJobFormReactHookForm } from "@/features/post-job/hooks/usePostJobFormReactHookForm";

export default function PostJobPage() {
  const { user } = useAuth();

  const { form, handleSubmit, handleSaveDraft, handleBack, isSubmitting, isSavingDraft, jobId } =
    usePostJobFormReactHookForm(user);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      <PostJobHeader jobId={jobId} onBack={handleBack} />

      <JobDetailsForm form={form} />

      <LocationWorkSetupForm form={form} />

      <BudgetPaymentForm form={form} />

      <SkillsCategoryForm form={form} />

      <PostJobActions
        isSavingDraft={isSavingDraft}
        isSubmitting={isSubmitting}
        jobId={jobId}
        onPublish={handleSubmit}
        onSaveDraft={handleSaveDraft}
      />

      <div className="text-sm text-gray-500">
        <p>* Required fields</p>
        <p className="mt-1">
          Your job will be reviewed to ensure it meets our community guidelines.
        </p>
      </div>
    </div>
  );
}
