"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { applicationSchema } from "../schemas/applicationSchema";
import { applicationsApi } from "@/lib/api/applications";
import { jobsApi } from "@/lib/api/jobs";
import { showErrorToast } from "@/lib/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import ProposalField from "./ProposalField";
import BudgetField from "./BudgetField";

const ApplicationForm = () => {
  const router = useRouter();
  const { id: jobId } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      proposal: "",
      proposed_budget: "",
    },
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.getJobById(jobId);
        setJob(res.job || res);
      } catch (err) {
        setError(showErrorToast(err).message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError("");

    try {
      await applicationsApi.applyToJob(jobId, {
        proposal: data.proposal.trim(),
        ...(data.proposed_budget && {
          proposed_budget: Number(data.proposed_budget),
        }),
      });

      router.push(`/dashboard/jobs/${jobId}`);
      router.refresh();
    } catch (err) {
      setError(showErrorToast(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== "tasker") {
    return <p className="text-red-600">Only taskers can apply to jobs.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Button onClick={() => router.back()} size="sm" variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-2xl font-bold">Apply to {job.title}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <AlertCircle className="inline mr-2 h-4 w-4 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <ProposalField error={errors.proposal?.message} register={register} />

        <BudgetField error={errors.proposed_budget?.message} register={register} />

        <Button className="w-full" disabled={submitting} size="lg">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ApplicationForm;
