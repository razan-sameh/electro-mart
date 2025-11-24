import { z } from "zod";
export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required"),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
});

export type ReviewSchemaType = z.infer<typeof reviewSchema>;