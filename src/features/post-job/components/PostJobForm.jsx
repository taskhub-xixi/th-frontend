"use client";

import {
  categoryOptions,
  commitmentOptions,
  experienceLevelOptions,
  paymentTypeOptions,
  workTypeOptions,
} from "@/data/jobOptions";
import { usePostJobForm } from "../hooks/usePostJobForm";

export default function PostJobForm({ user }) {
  const {
    formData,
    handleChange,
    handlePublish,
    handleSaveDraft,
    handleBack,
    isSubmitting,
    isSavingDraft,
  } = usePostJobForm(user);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
          Job Title *
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="title"
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., Website Development"
          type="text"
          value={formData.title}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
          Description *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="description"
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe the job in detail..."
          rows={4}
          value={formData.description}
        />
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="budget">
          Budget ($) *
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="budget"
          min="1"
          onChange={(e) => handleChange("budget", e.target.value)}
          placeholder="e.g., 500"
          type="number"
          value={formData.budget}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="location">
          Location
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="location"
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="e.g., New York, NY"
          type="text"
          value={formData.location}
        />
      </div>

      {/* Work Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="work_type">
          Work Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="work_type"
          onChange={(e) => handleChange("work_type", e.target.value)}
          value={formData.work_type}
        >
          {workTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Commitment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="commitment">
          Commitment
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="commitment"
          onChange={(e) => handleChange("commitment", e.target.value)}
          value={formData.commitment}
        >
          {commitmentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
          Category
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="category"
          onChange={(e) => handleChange("category", e.target.value)}
          value={formData.category}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="experience_level">
          Experience Level
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="experience_level"
          onChange={(e) => handleChange("experience_level", e.target.value)}
          value={formData.experience_level}
        >
          {experienceLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="payment_type">
          Payment Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="payment_type"
          onChange={(e) => handleChange("payment_type", e.target.value)}
          value={formData.payment_type}
        >
          {paymentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="skills">
          Required Skills (comma-separated)
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="skills"
          onChange={(e) => handleChange("skills", e.target.value)}
          placeholder="e.g., React, Node.js, MongoDB"
          type="text"
          value={formData.skills}
        />
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="deadline">
          Deadline
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          id="deadline"
          onChange={(e) => handleChange("deadline", e.target.value)}
          type="date"
          value={formData.deadline}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md"
          onClick={handleBack}
          type="button"
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md"
          disabled={isSavingDraft}
          onClick={handleSaveDraft}
          type="button"
        >
          {isSavingDraft ? "Saving..." : "Save Draft"}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={isSubmitting}
          onClick={handlePublish}
          type="button"
        >
          {isSubmitting ? "Publishing..." : "Publish Job"}
        </button>
      </div>
    </div>
  );
}
