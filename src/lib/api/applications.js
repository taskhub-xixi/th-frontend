import apiClient from "@/lib/axios";

/**
 * Applications API Service
 * Handles job application operations
 */

export const applicationsApi = {
  /**
   * Accept application (poster only)
   * PUT /api/applications/applications/:id/accept
   */
  acceptApplication: async (applicationId) => {
    const response = await apiClient.put(
      `/api/applications/applications/${applicationId}/accept`
    );
    return response.data;
  },
  /**
   * Apply to a job (tasker only)
   * POST /api/applications/jobs/:id/apply
   */
  applyToJob: async (jobId, data = {}) => {
    const response = await apiClient.post(
      `/api/applications/jobs/${jobId}/apply`,
      data
    );
    return response.data;
  },

  /**
   * Get applications for a job (poster only)
   * GET /api/applications/jobs/:id/applications
   */
  getJobApplications: async (jobId) => {
    const response = await apiClient.get(
      `/api/applications/jobs/${jobId}/applications`
    );
    return response.data;
  },

  /**
   * Get my applications (tasker only)
   * GET /api/applications/my-applications
   */
  getMyApplications: async () => {
    const response = await apiClient.get("/api/applications/my-applications");
    return response.data;
  },

  /**
   * Reject application (poster only)
   * PUT /api/applications/applications/:id/reject
   */
  rejectApplication: async (applicationId) => {
    const response = await apiClient.put(
      `/api/applications/applications/${applicationId}/reject`
    );
    return response.data;
  },

  /**
   * Get application by ID
   * GET /api/applications/applications/:id
   */
  getApplicationById: async (applicationId) => {
    const response = await apiClient.get(
      `/api/applications/applications/${applicationId}`
    );
    return response.data;
  },
};

// Export individual functions
export const applyToJob = applicationsApi.applyToJob;
export const getJobApplications = applicationsApi.getJobApplications;
export const acceptApplication = applicationsApi.acceptApplication;
export const rejectApplication = applicationsApi.rejectApplication;
export const getMyApplications = applicationsApi.getMyApplications;

// Alias for compatibility
export const getApplicationsForJob = applicationsApi.getJobApplications;
