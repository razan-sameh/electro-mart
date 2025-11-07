import {
  enmStrapiPaymentStatus,
  enmStrapiOrderStatus,
  enmStrapiDiscountType,
} from "./enms";

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
export type StrapiPaymentMethod = {
  id: number;
  documentId: string;
  brand: string;
  last4: string;
  token: string;
  exp_month: number;
  exp_year: number;
};
export interface StrapiPayment {
  id: number;
  documentId: string;
  Amount: number;
  payment_status: enmStrapiPaymentStatus;
  payment_method: StrapiPaymentMethod;
}

export interface StrapiOrderItem {
  id: number;
  documentId: string;
  Quantity: number;
  UnitPrice: number;
  product: StrapiProduct;
  discount_value: number;
  selected_color: StrapiColor;
  total: number;
  subtotal:number
}

export interface StrapiUser {
  id: number;
  documentId: string;
  email: string;
  username: string;
  phone?: StrapiPhone;
}

export interface StrapiOrder {
  id: number;
  documentId: string;
  order_status: enmStrapiOrderStatus;
  order_items: StrapiOrderItem[];
  payment: StrapiPayment;
  address: StrapiAddress;
  Total: number;
  subtotal: number;
  discount_total: number;
  createdAt: string;
  user: StrapiUser;
}

export interface StrapiColor {
  documentId: string;
  id: number;
  name: string;
  hex_code: string;
}
export interface StrapiPhone {
  documentId: string;
  id: number;
  dailcode: string;
  number: string;
  countryCode: string;
}

export interface StrapiAddress {
  documentId: string;
  id: number;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  phone: StrapiPhone;
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
export type StrapiBuyNow = {
  documentId: string;
  id: number;
  product: StrapiProduct;
  quantity: number;
  product_color: StrapiColor;
  expiresAt: string;
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
