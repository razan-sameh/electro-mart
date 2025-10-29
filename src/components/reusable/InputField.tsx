"use client";

import { useState } from "react";
import {
  FieldError,
  FieldValues,
  UseFormRegister,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { IconType } from "react-icons";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
  value
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <div
        className={`flex items-center border border-lightGray rounded-md px-3 py-2 ${
          error ? "border-red-500" : ""
        }`}
      >
        {/* 👇 Only show icon if NOT phone input */}
        {Icon && <Icon className="w-5 h-5 text-gray-400 mr-2" />}

        {/* 📱 Phone input */}
        {isPhone && setValue ? (
          <PhoneInput
            country={"eg"}
            value={value || ""} // ✅ استخدم القيمة الممررة من AddressForm
            inputStyle={{
              border: "none",
              width: "100%",
              fontSize: "14px",
              background: "transparent",
            }}
            buttonStyle={{
              border: "none",
              background: "transparent",
            }}
            onChange={(val) =>
              setValue(name, val as any, { shouldValidate: true })
            }
            placeholder={placeholder}
            inputProps={{ required: true }}
          />
        ) : (
          <>
            <input
              type={isPassword && showPassword ? "text" : type}
              placeholder={placeholder}
              className="flex-1 outline-none text-sm bg-transparent"
              {...register(name)}
            />
            {isPassword && (
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
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
