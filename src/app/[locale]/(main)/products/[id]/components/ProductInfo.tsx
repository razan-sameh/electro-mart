"use client";
import { typProduct } from "@/content/types";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useReducer, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";
import { calculateDiscountedPrice } from "@/content/utils";
import { cartItemReducer } from "./cartItemReducer";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  product: typProduct;
}

export default function ProductInfo({ product }: Props) {
  const { addToCart } = useCartStore();

  // useReducer instead of multiple useStates
  const [state, dispatch] = useReducer(cartItemReducer, {
    quantity: 1,
    selectedColor: product.colors?.[0], // 👈 أول لون
  });

  const discountedPrice = calculateDiscountedPrice(product);

  const formattedDiscountedPrice =
    discountedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " €";
const handleAddToCart = () => {
  addToCart(product, state.quantity, state.selectedColor);

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-xs w-full bg-background shadow-lg rounded-lg pointer-events-auto flex flex-col items-center  p-4`}
      >
        <FaCheckCircle className="text-green-500 mb-2" size={32} />
        <div className="text-green-600 font-medium text-center">
          {`${product.name} successfully added`}
        </div>
      </div>
    ),
    { position: "top-right" } // 👈 moved to bottom
  );
};

  return (
    <div className="flex flex-col gap-6">
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-content">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FaStar size={16} className="fill-secondary" />
        <span className="text-content">
          {product.averageRating} ({product.totalReviews})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        {product.specialOffers?.[0] && (
          <span className="text-gray-400 line-through text-lg">
            {product.price} €
          </span>
        )}
        <span className="text-2xl font-bold text-secondary">
          {formattedDiscountedPrice}
        </span>
      </div>

      {/* Colors */}
      {product.colors?.length && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium">Choose Color:</h3>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <div
                key={color.id}
                onClick={() =>
                  dispatch({ type: "SELECT_COLOR", payload: color })
                }
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  state.selectedColor?.id === color.id
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
          Add to Cart
        </button>

        <button className="flex-1 px-6 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition">
          Buy Now
        </button>
        <button className="px-4 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition">
          <FiHeart size={20} />
        </button>
      </div>
    </div>
  );
}
