import { typProduct } from "@/content/types";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useUnifiedWishlist } from "@/hooks/useUnifiedWishlist";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

type Props = {
  selectedVariant: any;
  product: typProduct;
  state: any;
};

export default function ProductActions({
  selectedVariant,
  product,
  state,
}: Props) {
  const t = useTranslations("ProductDetails");
  const { cartItems: cart, addItem, updateQuantity } = useUnifiedCart();
  const router = useRouter();
  const {
    wishlistItems: wishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useUnifiedWishlist();
  console.log({product});
  
  const isInWishlist = wishlist.some(
    (i) => i.product.id === product.id && i.variantId === selectedVariant?.id
  );
  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const existingItem = cart.find((i) => i.variantId === selectedVariant.id);

    if (existingItem) {
      await updateQuantity(
        existingItem,
        existingItem.quantity + state.quantity
      );
    } else {
      await addItem({
        product,
        variantId: selectedVariant.id,
        quantity: state.quantity,
      });
    }

    toast.success(t("successAdded", { product: product.name }));
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;

    const body = {
      productId: product.id,
      variantId: selectedVariant.id,
    };

    const res = await fetch("/api/buy-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      router.push("/checkout/shipping?isBuyNow=1");
    } else {
      console.error(data.error || "Something went wrong");
    }
  };

  const handleAddToWishlist = async () => {
    if (!selectedVariant) return;

    const existingItem = wishlist.find(
      (i) => i.variantId === selectedVariant.id
    );

    if (existingItem) {
      await removeFromWishlist(existingItem);
    } else {
      await addToWishlist({
        product,
        variantId: selectedVariant.id,
      });
    }

    toast.success(t("successAdded", { product: product.name }));
  };

  return (
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
  );
}
