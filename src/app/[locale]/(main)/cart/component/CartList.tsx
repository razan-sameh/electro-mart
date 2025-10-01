"use client";

import CartItem from "./CartItem";
import { typCartItem } from "@/content/types";

interface Props {
  items: typCartItem[];
}

export default function CartList({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={`${item.id}-${item.selectedColor?.id}`} item={item} />
      ))}
    </div>
  );
}
