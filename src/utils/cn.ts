import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function for constructing CSS `class` strings conditionally with support for TailwindCSS class overrides.
 *
 * @see https://github.com/kobaltedev/pigment/blob/main/packages/pigment/src/utils/cn.ts
 * @see https://github.com/dcastil/tailwind-merge/blob/v1.11.0/docs/what-is-it-for.md
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
