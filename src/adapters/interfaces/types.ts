export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  CategoryName?: string; // Add this if your API uses CategoryName
  icon?: string;
  ImageURL?: StrapiImage; // Single image object
  LogoURL?: StrapiImage; // Single image object (alternative field name)
  products?: StrapiProduct[];
  specification_types?: StrapiSpecificationType[];
}

export interface StrapiSpecificationType {
  id: number;
  documentId: string;
  name: string;
  specification_values?: StrapiSpecificationValue[]; // Add this if your API uses CategoryName
  categories?: StrapiCategory[];
}

export interface StrapiSpecificationValue {
  id: number;
  documentId: string;
  value: string;
  specification_type?: StrapiSpecificationType; // Add this if your API uses CategoryName
  products?: StrapiProduct[];
}

export interface StrapiSpecialOffer {
  id: number;
  documentId: string;
  title: string;
  discount_type: string;
  discount_value: number;
  start_date?: string;
  end_date?: string;
  products?: StrapiProduct[];
}

export interface StrapiBrand {
  id: number;
  documentId: string;
  Name: string;
  LogoURL?: StrapiImage;
  products?: StrapiProduct[];
}
export interface StrapiColor {
  documentId: string;

  id: number;
  name: string;
  hex_code: string;
  products?: StrapiProduct[];
}

export interface StrapiProduct {
  documentId: string;
  id: number;
  Name: string;
  Description: string;
  Price: number;
  StockQuantity: number;
  ImageURL?: StrapiImage[];
  brand: StrapiBrand;
  category: StrapiCategory;
  special_offers?: StrapiSpecialOffer[];
  product_colors?: StrapiColor[];
  specification_values?: StrapiSpecificationValue[];
  averageRating: number;
  totalReviews: number;
  reviews?: StrapiReview[];
}

export type StrapiReview = {
  documentId: string;
  id: number;
  Rating: number;
  Comment: string;
  product: StrapiProduct;
  createdAt: string;
  updatedAt: string;
  // users_permissions_user:Strapiuser
};

export type StrapiCartItem = {
  documentId: string;
  id: number;
  product: StrapiProduct;
  Quantity: number;
  product_color: StrapiColor;
};

export type StrapiCart = {
  documentId: string;
  id: number;
  cart_items: StrapiCartItem[];
};
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}
