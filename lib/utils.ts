// File: lib/utils.ts
// This file contains shared utility functions.
// We are adding cleanJsonString here so it can be used
// by both Server Actions and the Gemini library.

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Cleans a JSON string that might be wrapped in markdown backticks
 * or contain other artifacts.
 * @param jsonString The potentially dirty JSON string from the AI
 * @returns A clean JSON string
 */
export function cleanJsonString(jsonString: string): string {
  // 1. Remove Markdown backticks (```json ... ```)
  let cleaned = jsonString.replace(/^```json\s*|```$/g, '');

  // 2. Remove potential "thoughts" or text before the JSON
  // This finds the first '{' and assumes the JSON starts there.
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace > -1) {
    cleaned = cleaned.substring(firstBrace);
  }

  // 3. Remove potential text or artifacts after the JSON
  // This finds the last '}' and assumes the JSON ends there.
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace > -1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }

  // 4. Trim whitespace
  cleaned = cleaned.trim();

  // 5. Remove newline characters and other control characters
  // that might invalidate the JSON
  return cleaned.replace(/[\n\r\t]/g, '');
}