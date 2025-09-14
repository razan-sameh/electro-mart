"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./components/Logo";
import MobileDrawer from "./components/MobileDrawer";
import IconButtonGroup from "./components/IconButtonGroup";
import SearchBar from "./components/SearchBar";
import CategoriesNavBar from "../CategoriesNavBar";
import { FaBars } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const bgColor = pathname === "/" ? "rgba(255,255,255,0.7)" : "white";
  // classes based on pathname
  const containerClasses =
    pathname === "/"
      ? "relative max-w-7xl mx-auto rounded-t-lg rounded-b-none md:rounded-lg px-4 md:px-12 py-3"
      : "relative max-w-7xl mx-auto rounded-t-lg md:rounded-t-lg md:rounded-b-none px-4 md:px-12 py-3";

  return (
    <header className="absolute top-6 left-0 w-full z-20 px-4">
      <div className={containerClasses} style={{ backgroundColor: bgColor }}>
        <div className="relative flex items-center justify-between">
          <Logo />
          <SearchBar />
          <IconButtonGroup layout="desktop" />
          <IconButtonGroup layout="mobile" />
        </div>
      </div>
      <SearchBar isMobile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {pathname !== "/" && (
        <div className="hidden md:block ">
          <CategoriesNavBar />
        </div>
      )}{" "}
      {menuOpen && <MobileDrawer setMenuOpen={setMenuOpen} />}
    </header>
  );
}
