import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchBuyNow } from "../services/buyNow";

export function useBuyNow() {
  const queryFn = useCallback(() => fetchBuyNow(), []);

  return useSuspenseQuery({
    queryKey: ["buyNow"],
    queryFn,
  });
}
