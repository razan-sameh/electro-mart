import * as z from "zod";

export const ProfileSchema = z.object({
  username: z.string().min(2, "name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .regex(/^[+0-9\s-]+$/, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type typProfileData = z.infer<typeof ProfileSchema>;
