import { apiClient, STRAPI_URL } from "../apiClient";
import { ProductFilters, typProduct } from "@/content/types";

export const getProducts = async (
  locale: string,
  filters?: ProductFilters
): Promise<typProduct[]> => {
  // Initialize queryParams object
  const queryParams: Record<string, any> = {
    populate: "*",
  };

  // Add filters if they exist
  if (filters?.specialOffer) {
    queryParams["filters[special_offers][$null]"] = false;
  }
  if (filters?.categoryId) {
    queryParams["filters[category][id]"] = filters.categoryId;
  }
  if (filters?.brandId) {
    queryParams["filters[brand][id]"] = filters.brandId;
  }

  const res = await apiClient<any>(
    "/products",
    { cache: "force-cache" },
    queryParams,
    locale
  );

return res.data.map((item: any) => ({
    id: item.id,
    name: item.Name,
    description: item.Description,
    price: item.Price,
    stockQuantity: item.StockQuantity,
    imageUrl: item.ImageURL && item.ImageURL.length > 0 
      ? `${STRAPI_URL}${item.ImageURL[0].url}` 
      : undefined,
    brand: item.brand,
    category: item.category,
    specialOffers: Array.isArray(item.special_offers) 
      ? item.special_offers.map((offer: any) => ({
          id: offer.id,
          title: offer.title,
          discountType: offer.discount_type,
          discountValue: offer.discount_value,
          startDate: offer.start_date,
          endDate: offer.end_date,
        }))
      : [],
  }));
};
