"use client";
import { useMemo } from "react";
import { MdLanguage } from "react-icons/md";

export const useLanguageData = () => {
  const languageOptions = useMemo(() => [
    { code: "en", label: "English", icon: <MdLanguage size={20} /> },
    { code: "Ar", label: "Arabic", icon: <MdLanguage size={20} /> },
  ], []);

  return { languageOptions };
};