import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getMaxPrice, getMinPrice, getProducts } from "../services/products";
import { useLocale } from "next-intl";
import { typProductFilters } from "@/content/types";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
function getFiltersFromUrl(searchParams: URLSearchParams): typProductFilters {
  return {
    categoryId: searchParams.get("categoryId") || undefined,
    colorsId: searchParams.get("colorsId")?.split(",") || [],
    specificationValuesId:
      searchParams.get("specificationValuesId")?.split(",") || [],
    price: searchParams.get("price")
      ? Number(searchParams.get("price"))
      : undefined,
  };
}
export const useProducts = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // remove empty strings
  const categoryIndex = pathSegments.findIndex((seg) => seg === "categories");
  const categoryId =
    categoryIndex !== -1 ? pathSegments[categoryIndex + 1] : undefined;
  const searchParams = useSearchParams();
  const filters = getFiltersFromUrl(searchParams);
  filters.categoryId = categoryId; // merge path + query
  const searchQuery = searchParams.get("search") || undefined;
  return useSuspenseQuery({
    queryKey: ["products", filters, searchQuery,locale], // React Query automatically serializes the filters object
    queryFn: () => getProducts(locale, filters, searchQuery),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSpecialOffers = (limit?: number) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["specialOffers", limit,locale],
    queryFn: () =>
      getProducts(locale, { specialOffer: true }, undefined, limit), // filters: specialOffer only
  });
};

export const usePriceRange = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const categoryIndex = pathSegments.findIndex((seg) => seg === "categories");
  const categoryId =
    categoryIndex !== -1 ? pathSegments[categoryIndex + 1] : undefined;

  return useSuspenseQuery({
    queryKey: ["price-range", categoryId,locale],
    queryFn: async () => {
      const [minPrice, maxPrice] = await Promise.all([
        getMinPrice(locale, categoryId),
        getMaxPrice(locale, categoryId),
      ]);

      return { minPrice, maxPrice };
    },
  });
};

