"use client";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";
import MobileDrawer from "@/components/reusable/MobileDrawer";

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
        <MobileDrawer
          setMenuOpen={setOpen}
          isOpen={open}
        >
          <Sidebar onClose={() => setOpen(false)} />
        </MobileDrawer>
      )}
    </>
  );
}
