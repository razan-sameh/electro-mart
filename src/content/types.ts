import { enmStrapiPaymentStatus } from "@/adapters/interfaces/enms";
import { enmDiscountType, enmOrderStatus } from "./enums";

// Category
export type typCategory = {
  id: number;
  name: string;
  icon?: string;
  imageUrl?: string;
};

export type typSpecificationType = {
  id: string;
  name: string;
  specificationValues?: typSpecificationValues[];
  categories?: typCategory[];
};

export type typSpecificationValues = {
  id: string;
  name: string;
  specificationType?: typSpecificationType;
  products?: typProduct[];
};

export type typBrand = {
  id: number;
  name: string;
  imageUrl?: string;
  products?: typProduct[];
};
export type typSpecialOffer = {
  id: string;
  title: string;
  discountType: enmDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  products?: typProduct[];
};

export type typColor = {
  id: number;
  documentId: string;
  name: string;
  hexCode: string;
};

export type typProductImage = {
  url: string;
  is_main: boolean;
  position?: number;
};
export type typProductSpec = {
  id: number;
  key: string;
  value: string;
  is_filterable?: boolean;
};

export type typProductAttribute = {
  id: number;
  attribute: string;
  value: string;
  hexCode?: string;
};
export type typProductOffer = {
  discountPercent?: number;
  discountAmount?: number;
  title?: string;
  startDate?: string;
  endDate?: string;
};

export type typProductVariant = {
  id: number;
  sku: string;
  price: number;
  stock: number;
  is_active: boolean;
  offer: typProductOffer | null;
  attributes: typProductAttribute[];
};

export type typProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  brand: typBrand;
  category: typCategory;
  imagesUrl: typProductImage[];
  specs: typProductSpec[];
  variants: typProductVariant[];
  specialOffers?: typProductOffer;
  averageRating: number;
  totalReviews: number;
  reviews?: typReview[];
  displayPrice: number;
  originalPrice: number;
};

export type typReview = {
  id: number;
  documentId: string;
  rating: number;
  comment: string;
  user: typUser;
  createdAt: string;
  updatedAt: string;
};

export type RatingBreakdown = {
  star: number;
  count: number;
  percentage: number;
};

// User (Auth)
export type typUser = {
  id: number;
  username: string;
  email: string;
  token?: string; // for JWT
  phone?: typPhone;
  address?: typShippingAddress[];
  paymentMethods?: typPaymentMethod[];
};
export type typPaymentMethod = {
  id: number;
  documentId: string;
  brand: string;
  last4: string;
  token: string; // for JWT
  expMonth: number;
  expYear: number;
};

export type typShippingAddress = {
  documentId?: string;
  id?: number;
  streetAddress: string;
  postalCode: string;
  city: string;
  phone: typPhone;
  country: string;
};

export type typPhone = {
  id?: number;
  documentId?: string;
  dialCode: string;
  number: string;
  countryCode: string;
};

// Cart
export type typCartItem = {
  id: number;
  product: typProduct;
  variant: typProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type typCart = {
  id: number;
  items: typCartItem[];
};

export type typWishlistItem = {
  id: number;
  documentId: string;
  product: typProduct;
  selectedColor: typColor;
};

export type typWishlist = {
  id: string;
  items: typWishlistItem[];
};

export type typOrderItem = {
  id: number;
  documentId: string;
  product: typProduct;
  quantity: number;
  UnitPrice: number;
  selectedColor: typColor;
  discountValue: number;
  total: number;
  subtotal: number;
};

export type typPayment = {
  id: number;
  documentId: string;
  totalPayment: number;
  paymentStatus: enmStrapiPaymentStatus;
  paymentMethod: typPaymentMethod;
};

export type typOrder = {
  id: number;
  documentId: string;
  orderItems: typOrderItem[];
  date: string;
  total: number;
  subtotal: number;
  discountTotal: number;
  orderStatus: enmOrderStatus;
  ShippingAddress: typShippingAddress;
  payment: typPayment;
  user: typUser;
};

export type typProductFilters = {
  categoryId?: number;
  brandIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  attributes?: { attribute_id: number; value_id: number }[];
  specs?: { spec_id: number; value_id: number }[];
  hasOffer?: boolean;
};

export type PriceRange = {
  min: number;
  max: number;
};

export type typSidebarFilters = {
  categories: typCategory[];
  brands: typBrand[];
  specs: typProductSpec[];
  attributes: typProductAttribute[];
  price_range: PriceRange;
};

