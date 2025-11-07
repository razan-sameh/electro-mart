"use client";

import { typPhone } from "@/content/types";
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  FieldError,
  FieldValues,
  UseFormRegister,
  Path,
  UseFormSetValue,
  PathValue,
} from "react-hook-form";
import { IconType } from "react-icons";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString, PhoneNumber } from "libphonenumber-js";

interface Props<T extends FieldValues> {
  placeholder: string;
  icon?: IconType;
  error?: FieldError;
  type?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  setValue?: UseFormSetValue<T>;
  isPhone?: boolean;
  value?: string;
  readOnly?: boolean;
  iconAction?: React.ReactNode;
  onIconClick?: () => void;
  /** ✅ whether to allow showing/hiding password (default: true) */
  canShowPassword?: boolean;
}

export default function InputField<T extends FieldValues>({
  placeholder,
  icon: Icon,
  error,
  type = "text",
  register,
  name,
  setValue,
  isPhone = false,
  value,
  readOnly = false,
  iconAction,
  onIconClick,
  canShowPassword = true, // ✅ default true
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div>
      <div
        className={`flex items-center border border-lightGray rounded-md px-3 py-2 ${
          error ? "border-red-500" : ""
        } ${readOnly ? "bg-lightGray cursor-not-allowed" : ""}`}
      >
        {Icon && <Icon className="w-5 h-5 text-gray-400 me-2" />}

        {/* --- Input or PhoneInput --- */}
        <div className="flex-1 flex items-center justify-between gap-2">
          {isPhone && setValue ? (
            <PhoneInput
              country={"eg"}
              value={value || ""}
              inputStyle={{
                border: "none",
                width: "100%",
                fontSize: "14px",
                background: "transparent",
                textAlign: isRTL ? "right" : "left",
                direction: isRTL ? "rtl" : "ltr",
              }}
              buttonStyle={{
                border: "none",
                background: "transparent",
              }}
              onChange={(val, data: any) => {
                const phoneNumber: PhoneNumber | undefined =
                  parsePhoneNumberFromString(`+${val}`);

                const phoneObject: typPhone = {
                  dialCode: phoneNumber?.countryCallingCode || "",
                  number: phoneNumber?.nationalNumber || "",
                  countryCode: phoneNumber?.country || "",
                };

                // 👇 send object instead of string
                setValue(name, phoneObject as PathValue<T, Path<T>>, {
                  shouldValidate: true,
                });
              }}
              placeholder={placeholder}
              disabled={readOnly}
            />
          ) : (
            <input
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              className="flex-1 outline-none text-sm bg-transparent"
              {...register(name)}
              readOnly={readOnly}
            />
          )}

          {/* 👁️ or ✅ / ✏️ icon */}
          <div className="flex items-center gap-2 ml-2">
            {isPassword && canShowPassword && !readOnly && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <IoEyeOutline className="w-5 h-5 text-gray-400" />
                ) : (
                  <IoEyeOffOutline className="w-5 h-5 text-gray-400" />
                )}
              </button>
            )}

            {iconAction && (
              <button
                type="button"
                onClick={onIconClick}
                className="text-primary focus:outline-none"
              >
                {iconAction}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
