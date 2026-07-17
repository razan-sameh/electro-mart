// components/UserButton.tsx
"use client";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";
import IconButton from "./IconButton";

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label={
        resolvedTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={() => {
        if (!mounted) return;
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {!mounted ? (
        <div className="w-5 h-5" />
      ) : resolvedTheme === "dark" ? (
        <MdOutlineLightMode size={20} />
      ) : (
        <MdDarkMode size={20} />
      )}
    </IconButton>
  );
}
