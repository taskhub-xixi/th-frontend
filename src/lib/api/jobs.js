import apiClient from "@/lib/axios";

/**
 * Jobs API Service
 * Handles all job-related operations
 */

export const jobsApi = {
  /**
   * Get all jobs with optional filters
   * GET /api/jobs
   */
  getJobs: async (params = {}) => {
    const response = await apiClient.get("/api/jobs", { params });
    return response.data;
  },

  /**
   * Get single job by ID
   * GET /api/jobs/:id
   */
  getJobById: async (jobId) => {
    const response = await apiClient.get(`/api/jobs/${jobId}`);
    return response.data;
  },

  /**
   * Create new job (poster only)
   * POST /api/jobs
   */
  createJob: async (data) => {
    const response = await apiClient.post("/api/jobs", data);
    return response.data;
  },

  /**
   * Update job (poster only)
   * PUT /api/jobs/:id
   */
  updateJob: async (jobId, data) => {
    const response = await apiClient.put(`/api/jobs/${jobId}`, data);
    return response.data;
  },

  /**
   * Delete job (poster only)
   * DELETE /api/jobs/:id
   */
  deleteJob: async (jobId) => {
    const response = await apiClient.delete(`/api/jobs/${jobId}`);
    return response.data;
  },

  /**
   * Get my posted jobs (poster only)
   * GET /api/jobs/my-jobs
   */
  getMyJobs: async (params = {}) => {
    const response = await apiClient.get("/api/jobs/my-jobs", { params });
    return response.data;
  },

  /**
   * Save job
   * POST /api/jobs/:id/save
   */
  saveJob: async (jobId) => {
    const response = await apiClient.post(`/api/jobs/${jobId}/save`);
    return response.data;
  },

  /**
   * Get saved jobs
   * GET /api/jobs/saved (protected)
   */
  getSavedJobs: async (params = {}) => {
    const response = await apiClient.get("/api/jobs/saved", { params });
    return response.data;
  },

  /**
   * Toggle save job
   * POST /api/jobs/:id/save
   */
  toggleSaveJob: async (jobId) => {
    const response = await apiClient.post(`/api/jobs/${jobId}/save`);
    return response.data;
  },

  /**
   * Unsave job
   * DELETE /api/jobs/:id/save
   */
  unsaveJob: async (jobId) => {
    const response = await apiClient.delete(`/api/jobs/${jobId}/save`);
    return response.data;
  },

  /**
   * Apply to a job (tasker only) - for form data with files
   * POST /api/applications/jobs/:id/apply
   */
  applyToJob: async (jobId, applicationData) => {
    // If applicationData is FormData (for file uploads), don't set Content-Type

    const response = await apiClient.post(
      `/api/applications/jobs/${jobId}/apply`,
      applicationData,
      // config
    );
    return response.data;
  },

  /**
   * Complete job and process payment (poster only)
   * PUT /api/jobs/:id/complete
   */
  completeJob: async (jobId) => {
    const response = await apiClient.put(`/api/jobs/${jobId}/complete`);
    return response.data;
  },

  /**
   * Submit work - Tasker marks job as completed and ready for payment
   * PUT /api/jobs/:id/submit-work
   */
  submitWork: async (jobId) => {
    const response = await apiClient.put(`/api/jobs/${jobId}/submit-work`);
    return response.data;
  },
};
