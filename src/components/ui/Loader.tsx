"use client";
import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  size?: number; // diameter in px
  color?: string; // color of spinner
  text?: string; // optional text under spinner
  fullscreen?: boolean; // center it in the whole page
  className?: string; // extra classes
}

export default function Loader({
  size = 40,
  color = "#2563eb", // Tailwind blue-600
  text,
  fullscreen = false,
  className = "",
}: LoaderProps) {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid #a0a0a030`, // light gray
        borderTopColor: color,
        borderRadius: "50%",
      }}
      className="mx-auto"
    />
  );

  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-50"
          : "flex flex-col items-center justify-center"
      } ${className}`}
    >
      {spinner}
      {text && <p className="mt-3 text-gray-600 font-medium">{text}</p>}
    </div>
  );
}
