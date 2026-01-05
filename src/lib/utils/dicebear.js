/**
 * DiceBear Avatar Utility
 * Generates unique, colorful avatars based on user data
 */

import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

/**
 * Generate a DiceBear avatar URL
 * @param {string} seed - Unique identifier (job title, company name, etc.)
 * @param {object} options - Additional options for customization
 * @returns {string} - URL of the avatar
 */
export function generateDiceBearAvatar(seed, options = {}) {
  if (!seed) {
    seed = "job";
  }

  try {
    const avatar = createAvatar(initials, {
      seed: seed,
      backgroundColor: ["d1d5db", "e5e7eb", "f3f4f6", "f9fafb"], // light gray shades
      fontSize: 36,
      fontWeight: 600,
      textColor: ["374151", "4b5563", "6b7280", "9ca3af"], // gray text colors
      size: options.size || 64,
      ...options,
    });

    return avatar.toDataUri();
  } catch (error) {
    console.error("Error generating DiceBear avatar:", error);
    // Fallback to a simple colored avatar with initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed.substring(0, 2))}&background=0ea5e9&color=fff&size=64`;
  }
}

/**
 * Get DiceBear avatar for a job
 * @param {object} job - Job object
 * @returns {string} - Avatar URL
 */
export function getJobAvatar(job) {
  if (!job) return generateDiceBearAvatar("Job");
  
  // Use job title or poster name for the avatar
  const seed = job.title || job.poster_name || `Job ${job.id}`;
  return generateDiceBearAvatar(seed);
}

/**
 * Get DiceBear avatar for a user
 * @param {object} user - User object
 * @returns {string} - Avatar URL
 */
export function getUserAvatar(user) {
  if (!user) return generateDiceBearAvatar("User");
  
  // Use user name or email for the avatar
  const seed = user.name || user.email || `User ${user.id}`;
  return generateDiceBearAvatar(seed);
}

/**
 * Get DiceBear avatar for a company
 * @param {object} company - Company object
 * @returns {string} - Avatar URL
 */
export function getCompanyAvatar(company) {
  if (!company) return generateDiceBearAvatar("Company");
  
  // Use company name for the avatar
  const seed = company.name || company.title || `Company ${company.id}`;
  return generateDiceBearAvatar(seed);
}