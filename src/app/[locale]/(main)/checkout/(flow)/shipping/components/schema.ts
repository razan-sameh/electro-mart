import * as z from "zod";

export const AddressSchema = z.object({
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City / Place is required"),
  postalCode: z
    .string()
    .min(3, "Postal code is required")
    .regex(/^[A-Za-z0-9\s-]+$/, "Invalid postal code"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  addNewAddress: z.boolean().optional(),
  differentBillingAddress: z.boolean().optional(),
});

export type typAddressData = z.infer<typeof AddressSchema>;
