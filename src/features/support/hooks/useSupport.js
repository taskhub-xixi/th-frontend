import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleApiError, showErrorToast } from "@/lib/errorHandler";
import { supportApi } from "@/lib/api/support";

export function useSupport() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium",
  });

  // Load support tickets on page load
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await supportApi.getMyTickets();
        if (response.success) {
          setTickets(response.tickets || []);
        }
      } catch (error) {
        showErrorToast(error, "Failed to load tickets");
      } finally {
        setInitialLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await supportApi.createTicket({
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      });

      if (response.success) {
        toast({
          title: "Success!",
          description: "Support ticket submitted successfully",
        });
        setFormData({ subject: "", description: "", category: "general", priority: "medium" });

        // Reload tickets
        const ticketsResponse = await supportApi.getMyTickets();
        if (ticketsResponse.success) {
          setTickets(ticketsResponse.tickets || []);
        }
      } else {
        throw new Error(response.message || "Failed to submit ticket");
      }
    } catch (error) {
      showErrorToast(error, "Failed to submit support ticket");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    initialLoading,
    tickets,
    formData,
    setFormData,
    handleSubmit
  };
}