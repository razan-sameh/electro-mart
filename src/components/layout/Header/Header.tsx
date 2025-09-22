"use client";
import { Suspense, useState } from "react";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import CategoriesNavBar from "@/components/reusable/CategoriesNavBar";
import Logo from "./components/Logo";
import MobileDrawer from "./components/MobileDrawer";
import SearchBar from "./components/SearchBar";
import IconButtonGroup from "./components/IconButtonGroup";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const isLanding = pathname === `/${locale}` || pathname === "/";

  const t = useTranslations("Header");

  // classes based on pathname
  const containerClasses = isLanding
    ? "relative max-w-7xl mx-auto rounded-t-lg rounded-b-none md:rounded-lg px-4 md:px-12 py-3"
    : "relative max-w-7xl mx-auto rounded-t-lg md:rounded-t-lg md:rounded-b-none px-4 md:px-12 py-3";

  return (
    <header className={`w-full px-4 ${isLanding ? 'absolute top-6 left-0  z-20' : 'mt-6'}`}>
      <div
        className={`${
          isLanding ? "bg-background/60" : "bg-background"
        } 
        ${containerClasses}`}
      >
        <div className="relative flex items-center justify-between">
          <Logo />
          <SearchBar placeholder={t("searchPlaceholder")} />
          <IconButtonGroup layout="desktop" />
          <IconButtonGroup layout="mobile" />
        </div>
      </div>
      <SearchBar
        isMobile
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        placeholder={t("searchPlaceholder")}
      />
      <Suspense fallback={<div>Loading...</div>}>
        {pathname !== "/" && (
          <div className="hidden md:block ">
            <CategoriesNavBar />
          </div>
        )}
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        {menuOpen && <MobileDrawer setMenuOpen={setMenuOpen} />}
      </Suspense>
    </header>
  );
}
