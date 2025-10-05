"use client";

import { FieldError, FieldValues, UseFormRegister, Path } from "react-hook-form";
import { IconType } from "react-icons";

interface Props<T extends FieldValues> {
  placeholder: string;
  icon: IconType;
  error?: FieldError;
  type?: string;
  register: UseFormRegister<T>;
  name: Path<T>; // ✅ Use Path<T> instead of keyof T
}

export default function InputField<T extends FieldValues>({
  placeholder,
  icon: Icon,
  error,
  type = "text",
  register,
  name,
}: Props<T>) {
  return (
    <div>
      <div
        className={`flex items-center border border-lightGray rounded-md px-3 py-2 ${
          error ? "border-red-500" : ""
        }`}
      >
        <Icon className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm"
          {...register(name)}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
