import * as z from "zod";
export const PhoneSchema = z.object({
  dialCode: z.string().min(1, "Dial code is required"),
  number: z.string().min(8, "Phone number must be at least 8 digits"),
  countryCode: z.string().min(1, "Country code is required"),
});
export const ProfileSchema = z.object({
  username: z.string().min(2, "name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: PhoneSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type typProfileData = z.infer<typeof ProfileSchema>;
