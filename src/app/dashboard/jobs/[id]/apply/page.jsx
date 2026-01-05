"use client";

import { useParams } from "next/navigation";
import ApplicationForm from "@/features/applications/components/ApplicationForm";

export default function ApplyJobPage() {
  const params = useParams();
  const jobId = params.id;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <ApplicationForm jobId={jobId} />
    </div>
  );
}
