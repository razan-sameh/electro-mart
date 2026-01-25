import { enmStrapiPaymentStatus, enmStrapiOrderStatus } from "./enms";

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


export interface StrapiSpecialOffer {
  id: number;
  documentId: string;
  title: string;
  discount_type: string;
  discount_value: number;
  start_date?: string;
  end_date?: string;
  products?: ProductDB[];
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
  product: ProductDB;
  discount_value: number;
  selected_color: StrapiColor;
  total: number;
  subtotal: number;
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
  user: UserDB;
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

export type StrapiReview = {
  documentId: string;
  id: number;
  Rating: number;
  Comment: string;
  product: ProductDB;
  createdAt: string;
  updatedAt: string;
  user: UserDB;
};

export type StrapiBuyNow = {
  documentId: string;
  id: number;
  product: ProductDB;
  quantity: number;
  product_color: StrapiColor;
  expiresAt: string;
};


////////////////////////////////////////////

export interface UserDB {
  id: number;
  email: string;
  user_metadata: {display_name?: string};
  phone?: StrapiPhone;
}


export interface ProductImageDB {
  url: string;
  is_main: boolean;
  position?: number;
}
export interface ProductSpecDB {
  id: number;
  key: string;
  value: string;
  is_filterable: boolean;
}

export interface ProductAttributeDB {
  id: number;
  attribute: string;
  value: string;
  hex_code?: string;
}
export interface ProductOfferDB {
  discount_percent?: number;
  discount_amount?: number;
  title?: string;
  start_date?: string;
  end_date?: string;
}

export interface ProductVariantDB {
  id: number;
  sku: string;
  price: number;
  stock: number;
  is_active: boolean;
  offer: ProductOfferDB | null;
  attributes: ProductAttributeDB[];
}
export interface CategoryDB {
  title: string;
  id: number;
  icon?: string;
  image_url?: string;
}

export interface BrandDB {
  name: string;
  id: number;
  logo_url?: string;
  products?: ProductDB[];
}
export interface ProductDB {
  id: number;
  slug: string;
  title: string;
  description: string;
  brand: BrandDB;
  category: CategoryDB;
  images: ProductImageDB[];
  specs: ProductSpecDB[];
  variants: ProductVariantDB[];
  offer: ProductOfferDB | null;
  display_price: number;
  original_price: number;
  max_price: number;
  min_price: number;
  averageRating: number;
  totalReviews: number;
}
export type CartItemDB = {
  id: number;
  product: ProductDB;
  variant: ProductVariantDB;
  quantity: number;
  total_price:number
  unit_price:number
};
export type CartDB = {
  id: number;
  items: CartItemDB[];
};

export type WishlistItemDB = {
  id: number;
  product: ProductDB;
  variant: ProductVariantDB;
  original_price:number;
  display_price:number;
  applied_offer:ProductOfferDB
};

export type WishlistDB = {
  id: number;
  items: WishlistItemDB[];
};