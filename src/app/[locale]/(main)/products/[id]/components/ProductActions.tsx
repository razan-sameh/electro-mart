import { typCartItem, typProduct, typProductVariant } from "@/content/types";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/hooks/useCart";
import { useCreateOrder } from "@/lib/hooks/useCheckout";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

type Props = {
  selectedVariant: typProductVariant;
  product: typProduct;
  state: any;
  isOutOfStock: boolean;
};

export default function ProductActions({
  selectedVariant,
  product,
  state,
  isOutOfStock,
}: Props) {
  const t = useTranslations("ProductDetails");
  const { cart, addItem, updateItem } = useCart();
  const router = useRouter();
  const {
    wishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();
  const { mutateAsync: createOrder } = useCreateOrder();

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
    const item: typCartItem = {
      variant: selectedVariant,
      quantity: state.quantity,
      id: 0, // Temporary ID, will be ignored in order creation
      product: product,
      total: selectedVariant.price * state.quantity,
      unitPrice: selectedVariant.price,
    };
    await createOrder({
      items: [item],
      orderId: undefined,
    });
    router.push(
      `/checkout/shipping?isBuyNow=1&productId=${product.id}&variantId=${selectedVariant.id}&quantity=${state.quantity}`,
    );
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
        aria-label="Add to cart"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="flex-1 px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("addToCart")}
      </button>

      <button
        aria-label="Buy now"
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        className="flex-1 px-6 py-3 bg-lightGray/40 rounded-lg shadow hover:bg-lightGray/60 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("buyNow")}
      </button>

      <button
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
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
