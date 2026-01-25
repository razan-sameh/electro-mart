import { typProduct, typProductVariant } from "@/content/types";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

type Props = {
  selectedVariant: typProductVariant;
  product: typProduct;
  state: any;
};

export default function ProductActions({
  selectedVariant,
  product,
  state,
}: Props) {
  const t = useTranslations("ProductDetails");
  const { cart, addItem, updateItem } = useCart();
  const router = useRouter();
  const {
    wishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const isInWishlist = !!wishlist?.items?.some(
    (i) => i.variant.id === selectedVariant?.id,
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const existingItem = cart?.items?.find(
      (i) => i.variant.id === selectedVariant.id,
    );

    if (existingItem) {
      await updateItem({
        itemId: existingItem.id,
        quantity: existingItem.quantity + state.quantity,
      });
    } else {
      await addItem({
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

    const existingItem = wishlist?.items?.find(
      (i) => i.variant.id === selectedVariant.id,
    );

    if (existingItem) {
      await removeFromWishlist(existingItem.id);
      toast.success(t("successRemoved", { product: product.name }));
    } else {
      await addToWishlist(selectedVariant.id);
      toast.success(t("successAdded", { product: product.name }));
    }
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
