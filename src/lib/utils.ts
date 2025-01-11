import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a statistic name string into a human-readable format.
 *
 * This function takes a string representing a statistic name, replaces hyphens (`-`) with spaces,
 * capitalizes the first letter of each word, and returns the formatted string.
 *
 * @param {string} statName
 * @returns {string}
 */
export const formatStatName = (statName: string) => {
  return statName
    .replace("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Plays an audio
 * @param {string} src Audio file src
 */
export const playAudio = (src: string) => {
  const audio = new Audio(src);
  audio.play();
};
