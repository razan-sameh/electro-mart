import { FaUser, FaShoppingCart } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import IconButton from "./IconButton";

interface Props {
  layout: "desktop" | "mobile";
}

export default function IconButtonGroup({ layout }: Props) {
  const icons = [
    {
      icon: <IoLanguage size={20} />,
      key: "language",
      showOn: ["desktop"],
      onClick: () => console.log("Change language"),
    },
    {
      icon: <FaUser size={20} />,
      key: "user",
      showOn: ["desktop", "mobile"],
      onClick: () => console.log("Go to profile"),
    },
    {
      icon: <FaShoppingCart size={20} />,
      key: "cart",
      showOn: ["desktop", "mobile"],
      onClick: () => console.log("Open cart"),
    },
  ];

  return (
    <div
      className={`text-gray-700 ${
        layout === "desktop"
          ? "hidden md:flex gap-6"
          : "flex md:hidden gap-4 ml-auto"
      }`}
    >
      {icons
        .filter((item) => item.showOn.includes(layout))
        .map((item) => (
          <IconButton key={item.key} onClick={item.onClick}>{item.icon}</IconButton>
        ))}
    </div>
  );
}
