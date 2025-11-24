"use client";

import { typProduct } from "@/content/types";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { useReducer } from "react";
import { calculateDiscountedPrice } from "@/content/utils";
import { cartItemReducer } from "./cartItemReducer";
import toast from "react-hot-toast";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useUnifiedWishlist } from "@/hooks/useUnifiedWishlist";
import { FaHeart } from "react-icons/fa";

interface Props {
  product: typProduct;
}

export default function ProductInfo({ product }: Props) {
  const { cartItems: cart, addItem, updateQuantity } = useUnifiedCart(); // ✅ unified cart hook
  const router = useRouter();
  // useReducer instead of multiple useStates
  const [state, dispatch] = useReducer(cartItemReducer, {
    quantity: 1,
    selectedColor: product.colors?.[0], // 👈 default color
  });
  const t = useTranslations("ProductDetails");
  const {
    wishlistItems: wishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useUnifiedWishlist();

  const discountedPrice = calculateDiscountedPrice(product);
  const formattedDiscountedPrice =
    discountedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " E£";
  const isInWishlist = wishlist.some(
    (i) =>
      i.product.documentId === product.documentId &&
      i.selectedColor?.documentId === state.selectedColor?.documentId
  );

  const handleAddToCart = async () => {
    if (!state.selectedColor) return;

    // 1️⃣ Check if product + color already exists in cart
    const existingItem = cart.find(
      (i) =>
        i.product.documentId === product.documentId &&
        i.selectedColor?.documentId === state.selectedColor!.documentId
    );

    if (existingItem) {
      // 2️⃣ Update quantity
      await updateQuantity(
        existingItem,
        existingItem.quantity + state.quantity
      );
    } else {
      // 3️⃣ Add new item
      await addItem({
        product,
        quantity: state.quantity,
        selectedColor: state.selectedColor,
      });
    }

    toast.custom(
      (tToast) => (
        <div
          className={`${
            tToast.visible ? "animate-enter" : "animate-leave"
          } max-w-xs w-full bg-background shadow-lg rounded-lg pointer-events-auto flex flex-col items-center  p-4`}
        >
          <FaCheckCircle className="text-green-500 mb-2" size={32} />
          <div className="text-green-600 font-medium text-center">
            {t("successAdded", { product: product.name })}
          </div>
        </div>
      ),
      { position: "bottom-left" }
    );
  };

  const handleAddToWishlist = async () => {
    if (!state.selectedColor) return;

    // 1️⃣ Check if product + color already exists in wishlist
    const existingItem = wishlist.find(
      (i) =>
        i.product.documentId === product.documentId &&
        i.selectedColor?.documentId === state.selectedColor!.documentId
    );

    if (existingItem) {
      // 2️⃣ Add new item
      await removeFromWishlist(existingItem);
    } else {
      // 2️⃣ Add new item
      await addToWishlist({
        product,
        selectedColor: state.selectedColor,
      });
    }

    toast.custom(
      (tToast) => (
        <div
          className={`${
            tToast.visible ? "animate-enter" : "animate-leave"
          } max-w-xs w-full bg-background shadow-lg rounded-lg pointer-events-auto flex flex-col items-center p-4`}
        >
          <FaCheckCircle className="text-green-600 mb-2" size={32} />
          <div className="text-green-600font-medium text-center">
            {product.name}
            {/* {t("successAddedToWishlist", { product: product.name })} */}
          </div>
        </div>
      ),
      { position: "bottom-left" }
    );
  };
  const handleBuyNow = async () => {
    if (!state.selectedColor) return;

    const body = {
      productId: product.id,
      colorId: state.selectedColor.id,
    };

    const res = await fetch("/api/buy-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // نضيف param عشان Checkout تعرف انها Buy Now
      router.push("/checkout/shipping?isBuyNow=1");
    } else {
      console.error(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-content">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaStar size={16} className="fill-secondary" />
        <span className="text-content">
          {product.averageRating.toFixed(2)} ({product.totalReviews})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        {product.specialOffers?.[0] && (
          <span className="text-gray-400 line-through text-lg">
            {product.price} E£
          </span>
        )}
        <span className="text-2xl font-bold text-secondary">
          {formattedDiscountedPrice}
        </span>
      </div>

      {/* Colors */}
      {product.colors?.length && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">{t("chooseColor")}</h3>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <div
                key={color.documentId}
                onClick={() =>
                  dispatch({ type: "SELECT_COLOR", payload: color })
                }
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  state.selectedColor?.documentId === color.documentId
                    ? "border-primary scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => dispatch({ type: "DECREASE" })}
          className="px-3 py-2 border border-lightGray rounded-md"
        >
          <FiMinus />
        </button>
        <input
          type="number"
          min={1}
          value={state.quantity}
          onChange={(e) =>
            dispatch({
              type: "SET_QUANTITY",
              payload: parseInt(e.target.value, 10) || 1,
            })
          }
          className="w-16 text-center border border-lightGray rounded-md py-1"
        />
        <button
          onClick={() => dispatch({ type: "INCREASE" })}
          className="px-3 py-2 border border-lightGray rounded-md"
        >
          <FiPlus />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
        >
          {t("addToCart")}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 px-6 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition"
        >
          {t("buyNow")}
        </button>
        <button
          onClick={handleAddToWishlist}
          className="px-4 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition"
        >
          {isInWishlist ? (
            <FaHeart size={20} className="text-secondary" />
          ) : (
            <FiHeart size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
