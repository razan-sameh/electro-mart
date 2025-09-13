import {
  FaTimes,
  FaDesktop,
  FaGamepad,
  FaHeadphones,
  FaCamera,
  FaPrint,
} from "react-icons/fa";
import {
  IoHome,
  IoLanguage,
  IoMusicalNotes,
  IoPhonePortrait,
  IoTabletPortrait,
  IoWatch,
} from "react-icons/io5";
import Link from "next/link";

interface Props {
  setMenuOpen: (open: boolean) => void;
}

export default function MobileDrawer({ setMenuOpen }: Props) {
  const menuItems = [
    { icon: <FaDesktop />, label: "Computers", href: "#" },
    { icon: <IoPhonePortrait />, label: "Cell phones", href: "#" },
    { icon: <FaGamepad />, label: "Gaming", href: "#" },
    { icon: <IoTabletPortrait />, label: "Tablets", href: "#" },
    { icon: <FaHeadphones />, label: "Headphones", href: "#" },
    { icon: <IoMusicalNotes />, label: "Speakers", href: "#" },
    { icon: <FaCamera />, label: "Cameras", href: "#" },
    { icon: <IoWatch />, label: "Smart watch", href: "#" },
    { icon: <FaPrint />, label: "Printer", href: "#" },
    { icon: <IoHome />, label: "Smart home", href: "#" },
    { icon: <IoMusicalNotes />, label: "Accessories", href: "#" },
  ];

  return (
    <div className="fixed inset-0 z-30">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setMenuOpen(false)}
      />
      <div className="absolute left-0 top-0 w-72 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            ELECTRIC<span style={{ color: "#FB5F2F" }}>.</span>MART
          </Link>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes size={22} className="text-gray-600" />
          </button>
        </div>

        <h3 className="text-blue-600 font-semibold mb-4">Products</h3>
        <nav className="flex flex-col space-y-4 text-gray-800">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 text-gray-700">
          <button className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              <IoLanguage /> Language (English)
            </span>
            <span>{">"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
