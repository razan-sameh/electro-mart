"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, typProfileData } from "./schemas";
import { BsPencilSquare } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import InputField from "@/components/reusable/InputField";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { FiX } from "react-icons/fi";

export default function ProfileForm() {
  const [editingFields, setEditingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();

  const form = useForm<typProfileData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      phone: user?.phone ? `${user.phone.dailcode}${user.phone.number}` : "", // ✅ convert to string
      password: "********",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        phone: user.phone ? `${user.phone.dailcode}${user.phone.number}` : "",
        password: "********",
      });
    }
  }, [user, form]);

  const handleSave = async (field: keyof typProfileData) => {
    let value = form.getValues(field);

    // Clean invisible characters
    const cleanValue = value.replace(/[\u202A-\u202E\u200E\u200F]/g, "").trim();

    setIsLoading(true);
    setSuccess("");
    setError("");

    try {
      // Map form field to Strapi field
      const payload: Record<string, any> = {};

      if (field === "phone") {
        // Ensure the number starts with "+"
        const formattedValue = cleanValue.startsWith("+")
          ? cleanValue
          : `+${cleanValue}`;

        const phoneNumber = parsePhoneNumberFromString(formattedValue);
        if (!phoneNumber) throw new Error("Invalid phone number format");

        payload.phone = {
          dailcode: phoneNumber.countryCallingCode, // e.g. "20"
          number: phoneNumber.nationalNumber, // e.g. "1501092044"
          countryCode: phoneNumber.country, // e.g. "EG"
        };
      } else {
        payload[field] = cleanValue;
      }

      const res = await fetch("/api/auth/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");

      setSuccess(`${field} updated successfully!`);
      setEditingFields((prev) => prev.filter((f) => f !== field));
      form.setValue(field, value);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (field: keyof typProfileData) => {
    // Reset the field back to the original user value
    if (user) {
      form.setValue(
        field,
        field === "phone"
          ? user.phone
            ? `${user.phone.dailcode}${user.phone.number}`
            : ""
          : (user as any)[field] || ""
      );
    }
    // Exit edit mode
    setEditingFields((prev) => prev.filter((f) => f !== field));
  };

  const handlePassword = async () => {
    router.push("/profile/change-password");
  };

  const toggleEditing = (field: keyof typProfileData) => {
    setEditingFields(
      (prev) =>
        prev.includes(field)
          ? prev.filter((f) => f !== field) // disable if already editing
          : [...prev, field] // add if not editing
    );
  };

  if (userLoading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background p-6 rounded-2xl shadow-sm"
    >
      {Object.entries(form.getValues()).map(([key]) => {
        const isEditing = editingFields.includes(key);

        const fieldLabels: Record<string, string> = {
          username: "User name",
          email: "Email",
          phone: "Phone number",
          password: "Password",
        };

        return (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium text-content mb-1">
              {fieldLabels[key] || key}
            </label>
            <InputField
              canShowPassword={false}
              placeholder={fieldLabels[key] || key}
              register={form.register}
              name={key as keyof typProfileData}
              type={key === "password" ? "password" : "text"}
              error={form.formState.errors[key as keyof typProfileData]}
              readOnly={!isEditing}
              iconAction={
                isEditing ? (
                  <div className="flex items-center gap-2">
                    <FiCheck
                      className="text-green-600 cursor-pointer"
                      size={18}
                      onClick={() => handleSave(key as keyof typProfileData)}
                    />
                    <FiX
                      className="text-red-500 cursor-pointer"
                      size={18}
                      onClick={() => handleCancel(key as keyof typProfileData)}
                    />
                  </div>
                ) : (
                  <BsPencilSquare
                    size={18}
                    className="cursor-pointer"
                    onClick={() =>
                      key === "password"
                        ? handlePassword()
                        : toggleEditing(key as keyof typProfileData)
                    }
                  />
                )
              }
              isPhone={key === "phone"}
              setValue={form.setValue}
              value={form.getValues(key as keyof typProfileData)}
            />
          </div>
        );
      })}

      <div className="sm:col-span-2 mt-2">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
      </div>
    </form>
  );
}
