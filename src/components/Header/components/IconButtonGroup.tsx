// components/IconButtonGroup.tsx (refactored)
"use client";
import LanguageDropdown from "./LanguageDropdown";
import UserButton from "./UserButton";
import CartButton from "./CartButton";

interface Props {
  layout: "desktop" | "mobile";
  cartItemCount?: number; // Optional cart count
}

export default function IconButtonGroup({ layout, cartItemCount }: Props) {
  // Define which components to show on each layout
  const componentConfig = [
    {
      key: "language",
      showOn: ["desktop"],
      component: <LanguageDropdown />,
    },
    {
      key: "user", 
      showOn: ["desktop", "mobile"],
      component: <UserButton />,
    },
    {
      key: "cart",
      showOn: ["desktop", "mobile"],
      component: <CartButton itemCount={cartItemCount} />,
    },
  ];

  return (
    <div
      className={`text-gray-700 ${
        layout === "desktop"
          ? "hidden md:flex gap-6"
          : "flex md:hidden gap-4 ms-auto"
      }`}
    >
      {componentConfig
        .filter((config) => config.showOn.includes(layout))
        .map((config) => (
          <div key={config.key}>
            {config.component}
          </div>
        ))}
    </div>
  );
}