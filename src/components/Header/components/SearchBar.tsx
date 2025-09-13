// components/Header/SearchBar.tsx
import { FaSearch, FaBars } from "react-icons/fa";

interface Props {
  isMobile?: boolean; // true => render mobile layout with hamburger
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  isMobile = false,
  menuOpen,
  setMenuOpen,
  placeholder = "I'm searching for...",
  className = "",
}: Props) {
  return (
    <div className={`${isMobile ? "flex md:hidden" : "hidden md:flex justify-center w-full px-2"} ${className}`}>
      {isMobile && setMenuOpen && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="px-4 py-2 bg-white/70 flex items-center justify-center rounded-bl-md rounded-t-none md:rounded-md"
        >
          <FaBars size={22} className="text-gray-700" />
        </button>
      )}
      <div className={`relative flex-1 ${isMobile ? "" : "w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl"}`}>
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full px-4 py-2 pr-10 border border-gray-300 bg-white text-gray-800 focus:outline-none ${
            isMobile ? "rounded-br-md rounded-t-none md:rounded-md" : "rounded-md"
          }`}
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}
