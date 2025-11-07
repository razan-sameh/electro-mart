import * as z from "zod";

// Phone schema as an object
export const PhoneSchema = z.object({
  dialCode: z.string().min(1, "Dial code is required"),
  number: z.string().min(8, "Phone number must be at least 8 digits"),
  countryCode: z.string().min(1, "Country code is required"),
});

// Address schema
export const AddressSchema = z.object({
  phone: PhoneSchema,
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City / Place is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
});

// Type inferred from schema
export type typAddressFormData = z.infer<typeof AddressSchema>;