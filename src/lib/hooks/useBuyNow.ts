import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchBuyNow } from "../services/buyNow";

export function useBuyNow() {
  const queryFn = useCallback(() => fetchBuyNow(), []);

  return useQuery({
    queryKey: ["buyNow"],
    queryFn,
    retry: 1, // 👈 Avoid infinite retry loops
  });
}
