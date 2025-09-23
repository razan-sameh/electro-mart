import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getProducts } from "../services/products";
import { useLocale } from "next-intl";
import { typProductFilters } from "@/content/types";

export const useProducts = (filters?: typProductFilters, search?:string) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["products", filters,search], // React Query automatically serializes the filters object
    queryFn: () => getProducts(locale, filters,search),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
