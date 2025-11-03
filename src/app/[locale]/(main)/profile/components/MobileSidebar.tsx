"use client";
import { useState } from "react";
import { FiX, FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button (visible only on mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-gray-700 hover:text-primary"
      >
        <FiMenu size={22} />
      </button>

      {/* Overlay & Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="relative bg-white w-64 h-full shadow-xl z-50 p-4 overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <FiX size={22} />
            </button>
            <Sidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
