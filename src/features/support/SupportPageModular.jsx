"use client";

import { useSupport } from "@/features/support/hooks/useSupport";
import QuickLinks from "@/features/support/components/QuickLinks";
import SupportTickets from "@/features/support/components/SupportTickets";
import ContactForm from "@/features/support/components/ContactForm";

export default function SupportPageModular() {
  const {
    loading,
    initialLoading,
    tickets,
    formData,
    setFormData,
    handleSubmit
  } = useSupport();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

      <QuickLinks />

      {!initialLoading && (
        <SupportTickets tickets={tickets} />
      )}

      <ContactForm
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}