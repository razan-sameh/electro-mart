import { typOrderItem } from "@/content/types";

type Props = {
  item: typOrderItem;
};

export default function OrderItemCard({ item }: Props) {
  return (
    <div className="bg-body rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 w-full">
      <img
        src={item.product.imagesUrl[0]}
        alt={item.product.name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 w-full">
        <p className="font-medium">{item.product.name}</p>

        {/* السعر قبل الخصم */}
        <p className="text-sm text-content ">
          {item.quantity} x E£{item.UnitPrice} (E£{item.subtotal})
        </p>

        {/* خصم المنتج */}
        {item.discountValue > 0 && (
          <p className="text-xs text-secondary">- E£{item.discountValue}</p>
        )}
        {/* السعر بعد الخصم */}
        <p className="text-content text-sm">E£{item.total}</p>

        {/* الكمية واللون */}
        {/* <p className="text-content text-xs">Quantity: {item.quantity}</p> */}
        <p className="text-content text-xs">Color: {item.selectedColor.name}</p>
      </div>
    </div>
  );
}
