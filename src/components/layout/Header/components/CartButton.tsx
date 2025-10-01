// components/CartButton.tsx
import { FaShoppingCart } from "react-icons/fa";
import IconButton from "./IconButton";
import { Link } from "@/i18n/navigation";

interface Props {
  itemCount?: number; // Optional cart item count
}

export default function CartButton({ itemCount }: Props) {
  const handleCartClick = () => {
    console.log("Open cart");
    // Add your cart logic here
  };

  return (
    <div className="relative">
      {/* <IconButton onClick={handleCartClick}> */}
      <Link
        href="/cart"
        className={`flex items-center justify-center cursor-pointer hover:text-blue-600 transition-colors`}
      >
        <FaShoppingCart size={20} />
      </Link>
      {/* </IconButton> */}
      {itemCount && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </div>
  );
}
