import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scale, so it reads `text-h1` as a
 * text *colour* and lets a later `text-gray-900` delete it -- which silently
 * strips the type scale off every heading. Registering the custom sizes as font
 * sizes is what keeps `cn("text-h1", "text-gray-900")` meaning both.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "body-lg",
            "body",
            "body-sm",
            "caption",
          ],
        },
      ],
    },
  },
});

/**
 * Merges class names and lets a later Tailwind class win over an earlier one,
 * so a component's default can always be overridden by its caller.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
