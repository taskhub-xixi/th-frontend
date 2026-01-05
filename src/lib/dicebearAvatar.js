/**
 * DiceBear Avatar Utility
 * Generates unique, colorful avatars based on user data
 */

import { avataaars, lorelei, micah, openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export const AVATAR_STYLES = [
  { name: "micah", displayName: "Micah", style: micah },
  { name: "avataaars", displayName: "Adventurer", style: avataaars },
  { name: "lorelei", displayName: "Lorelei", style: lorelei },
  { name: "openPeeps", displayName: "Open Peeps", style: openPeeps },
];

export const BACKGROUND_COLORS = [
  "#b6e3f4",
  "#c0aede",
  "#d1d4f9",
  "#ffd5dc",
  "#fff0f5",
  "#87ceeb",
  "#98f5e1",
  "#ff6b6b",
  "#4ecdc4",
];

/**
 * Generate a DiceBear avatar SVG URL
 * @param {string} seed - Unique identifier (user ID, email, name)
 * @param {object} options - Additional options
 * @returns {string} - Data URL of the avatar
 */
export function generateDiceBearAvatar(seed, options = {}) {
  if (!seed) {
    seed = Math.random().toString(36).substring(7);
  }

  try {
    // Use openPeeps style by default (most professional)
    const avatar = createAvatar(openPeeps, {
      seed: seed,
      size: options.size || 128,
      scale: options.scale || 100,
      ...options,
    });

    return avatar.toDataUri();
  } catch (error) {
    console.error("Error generating DiceBear avatar:", error);
    // Fallback to a simple colored avatar
    return generateFallbackAvatar(seed);
  }
}

/**
 * Generate avatar for a user
 * @param {object} user - User object
 * @returns {string} - Avatar data URL
 */
export function getUserAvatar(user) {
  if (!user) return generateFallbackAvatar("unknown");

  const seed = user.id?.toString() || user.email || user.name || "unknown";
  return generateDiceBearAvatar(seed, {
    size: 128,
    backgroundColor: ["b6e3f5", "c0aede", "f5a623"],
  });
}

/**
 * Generate avatar for a company
 * @param {object} company - Company object
 * @returns {string} - Avatar data URL
 */
export function getCompanyAvatar(company) {
  if (!company) return generateFallbackAvatar("company");

  const seed = company.id?.toString() || company.name || "company";
  return generateDiceBearAvatar(seed, {
    size: 128,
    backgroundColor: ["f0a2a2", "d4a5a5", "ffa500"],
  });
}

/**
 * Fallback avatar generator
 * @param {string} seed - Unique identifier
 * @returns {string} - Data URL
 */
function generateFallbackAvatar(seed) {
  try {
    const avatar = createAvatar(openPeeps, {
      seed: seed,
      size: 128,
    });
    return avatar.toDataUri();
  } catch (error) {
    console.error("Fallback avatar generation failed:", error);
    // Return a simple colored SVG as last resort
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect fill='%23888' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='white' font-size='48' font-weight='bold' transform='translate(0, 2)'%3E?%3C/text%3E%3C/svg%3E`;
  }
}

export default {
  generateDiceBearAvatar,
  getUserAvatar,
  getCompanyAvatar,
};
