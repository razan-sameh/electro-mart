// components/Header/SearchBar.tsx
import { FaSearch, FaBars } from "react-icons/fa";
import ProductsDropdown from "./ProductsDropdown";
import { useLocale } from "next-intl";
import { Suspense } from "react";

interface Props {
  isMobile?: boolean; // true => render mobile layout with hamburger
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
  placeholder: string;
  className?: string;
}

export default function SearchBar({
  isMobile = false,
  menuOpen,
  setMenuOpen,
  placeholder,
  className = "",
}: Props) {
  const locale = useLocale();

  return (
    <div
      className={`${
        isMobile
          ? "flex md:hidden"
          : "hidden md:flex justify-center w-full px-2"
      } ${className}`}
    >
      {isMobile && setMenuOpen && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-4 py-2 bg-background/60 flex items-center justify-center rounded-es-md rounded-t-none md:rounded-md"
        >
          <FaBars size={22} className="text-icon" />
        </button>
      )}
      <Suspense fallback={<div>Loading...</div>}>
        {!isMobile && <ProductsDropdown />}
      </Suspense>
      <div
        className={`relative flex-1 ${
          isMobile ? "" : "w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl"
        }`}
      >
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full px-4 py-2 pe-10 bg-background/70 text-icon placeholder:text-icon  focus:outline-none ${
            isMobile
              ? "rounded-ee-md rounded-t-none md:rounded-md"
              : "rounded-e-md"
          }`}
        />
        <FaSearch
          className={`absolute ${
            locale === "ar" ? "left-3" : "right-3"
          } top-1/2 -translate-y-1/2 text-icon`}
        />
      </div>
    </div>
  );
}
