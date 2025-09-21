import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getProducts } from "../services/products";
import { useLocale } from "next-intl";
import { ProductFilters } from "@/content/types";

export const useProducts = (filters?: ProductFilters) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["products", filters], // React Query automatically serializes the filters object
    queryFn: () => getProducts(locale, filters),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
