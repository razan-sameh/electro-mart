import { useState } from "react";
import { typWishlistItem } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import ProductPrice from "@/components/reusable/ProductPrice";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";

type productCardProps = {
  item: typWishlistItem;
  onRemove: (item: typWishlistItem) => void;
};

export default function ProductCard({ item, onRemove }: productCardProps) {
  const { cartItems, addItem } = useUnifiedCart();
  const [added, setAdded] = useState(false);

  // Check if this product with the selected color is already in cart
  const isInCart = cartItems.some(
    (cartItem) =>
      cartItem.product.documentId === item.product.documentId &&
      cartItem.selectedColor.id === item.selectedColor.id
  );

  const handleRemove = () => onRemove(item);

  const handleAddToCart = async () => {
    if (isInCart || added) return;

    setAdded(true); // optimistic UI update

    try {
      await addItem({
        product: item.product,
        quantity: 1,
        selectedColor: item.selectedColor,
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
      setAdded(false); // rollback if failed
    }
  };

  return (
    <div className="relative bg-background rounded-lg shadow hover:shadow-lg transition text-start w-full">
      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 z-10 bg-body/90 hover:bg-white rounded-full p-1.5 shadow-sm transition"
        aria-label="Remove from wishlist"
      >
        <IoMdClose className="w-4 h-4 text-content" />
      </button>

      <Link href={`/products/${item.product.documentId}`} className="block">
        {/* Discount badge */}
        <div className="relative">
          {item.product.specialOffers?.[0] && (
            <span className="absolute top-2 left-0 bg-secondary text-white text-xs px-2 py-1 rounded-e-sm">
              {item.product.specialOffers[0].title}
            </span>
          )}
          <img
            src={item.product.imagesUrl[0]}
            alt={item.product.name}
            className="w-full h-48 object-contain mb-3 p-4"
          />
        </div>

        {/* Title & Price */}
        <div className="p-4 pt-0">
          <h3 className="text-sm font-medium mb-2 line-clamp-2">
            {item.product.name}
          </h3>
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 cursor-pointer me-2`}
              style={{ backgroundColor: item.selectedColor.hexCode }}
            />
            <p>{item.selectedColor.name}</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            {/* Price */}
            <ProductPrice item={item.product} />

            {/* Rating */}
            <div className="flex items-center text-sm text-gray-600">
              <FaStar className="w-4 h-4 fill-yellow-400 mr-1" />
              {item.product.averageRating} ({item.product.totalReviews})
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {isInCart || added ? (
          <div className="w-full bg-gray-300 text-gray-700 py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium cursor-default">
            Added to Cart
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-2.5 px-4 rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            <FiShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
