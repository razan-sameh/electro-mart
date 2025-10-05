import * as z from "zod";

// Validation schemas for each step
export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
  })

export type typForgotPasswordData = z.infer<typeof forgotPasswordSchema>;