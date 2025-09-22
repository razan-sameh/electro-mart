import { ProductFilters } from "@/content/types";

export class FilterAdapter {
  private static instance: FilterAdapter;

  private constructor() {}

  public static getInstance(): FilterAdapter {
    if (!FilterAdapter.instance) {
      FilterAdapter.instance = new FilterAdapter();
    }
    return FilterAdapter.instance;
  }

  adaptToStrapiFilters(filters?: ProductFilters): Record<string, any> {
    const queryParams: Record<string, any> = {
      populate: "*",
    };

    if (!filters) {
      return queryParams;
    }

    if (filters.specialOffer) {
      queryParams["filters[special_offers][$null]"] = false;
    }

    if (filters.categoryId) {
      queryParams["filters[category][id]"] = filters.categoryId;
    }

    if (filters.brandId) {
      queryParams["filters[brand][id]"] = filters.brandId;
    }

    return queryParams;
  }

  adaptFromQueryParams(searchParams: URLSearchParams): ProductFilters {
    const filters: ProductFilters = {};

    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      filters.categoryId = parseInt(categoryId);
    }

    const brandId = searchParams.get('brandId');
    if (brandId) {
      filters.brandId = parseInt(brandId);
    }

    const specialOffer = searchParams.get('specialOffer');
    if (specialOffer) {
      filters.specialOffer = specialOffer === 'true';
    }

    return filters;
  }
}
