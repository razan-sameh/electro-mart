"use client";

import { JSX, useMemo, useTransition } from "react";
import { MdLanguage } from "react-icons/md";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

// 👇 labels + icons + display codes
const LANGUAGE_MAP: Record<
  string,
  { label: string; icon: JSX.Element; displayCode?: string }
> = {
  en: { label: "English", icon: <MdLanguage size={20} />, displayCode: "EN" },
  ar: { label: "العربية", icon: <MdLanguage size={20} />, displayCode: "ع" },
};

export function useLanguage() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // نبني languageOptions مباشرة من routing.locales
  const languageOptions = useMemo(
    () =>
      routing.locales.map((code) => ({
        code, // 👈 لازم يفضل زي ما هو (en, ar)
        label: LANGUAGE_MAP[code]?.label || code.toUpperCase(),
        icon: LANGUAGE_MAP[code]?.icon || <MdLanguage size={20} />,
        displayCode: LANGUAGE_MAP[code]?.displayCode || code.toUpperCase(),
      })),
    []
  );

  // اللغة الحالية
  const currentLanguage =
    languageOptions.find((opt) => opt.code.toLowerCase() === locale) ??
    languageOptions[0];

  // تغيير اللغة
  const changeLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      router.replace({ pathname }, { locale: newLocale });
    });
  };

  return {
    locale,
    languageOptions,
    currentLanguage,
    changeLanguage,
    isPending,
  };
}
