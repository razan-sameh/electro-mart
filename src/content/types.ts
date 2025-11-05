import {
  enmStrapiPaymentMethod,
  enmStrapiPaymentStatus,
} from "@/adapters/interfaces/enms";
import { enmDiscountType, enmOrderStatus } from "./enums";

// Category
export type typCategory = {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  products?: typProduct[];
  specificationTypes?: typSpecificationType[];
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
  id: string;
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
export type typProductFilters = {
  specialOffer?: boolean;
  categoryId?: string;
  brandId?: string;
  specificationValuesId?: string[];
  colorsId?: string[];
  brandsId?: string[];
  price?: number;
};

export type typColor = {
  id: number;
  documentId: string;
  name: string;
  hexCode?: string;
  products?: typProduct[];
};

// Product
export type typProduct = {
  id: number;
  documentId: string;
  imagesUrl: string[];
  name: string;
  price: number;
  category: typCategory;
  brand: typBrand;
  description: string;
  stockQuantity: number;
  specialOffers?: typSpecialOffer[];
  colors?: typColor[];
  specificationValues?: typSpecificationValues[];
  averageRating: number;
  totalReviews: number;
  reviews?: typReview[];
};

export type typReview = {
  id: string;
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
  documentId: string;
  username: string;
  email: string;
  token?: string; // for JWT
  phone: typPhone;
  address: typAddress[];
};

export type typAddress = {
  id: string;
  streetAddress: string;
  postalCode: number;
  city: string;
  country: string;
};

export type typPhone = {
  id: number;
  documentId: string;
  dailcode: string;
  number: number;
  countryCode: string;
};

// Cart
export type typCartItem = {
  id: number;
  documentId: string;
  product: typProduct;
  quantity: number;
  selectedColor: typColor;
};

export type typCart = {
  id: string;
  items: typCartItem[];
};

export type typOrderItem = {
  id: number;
  documentId: string;
  product: typProduct;
  quantity: number;
  UnitPrice: number;
};

export type typPayment = {
  id: number;
  documentId: string;
  totalPayment: number;
  paymentStatus: enmStrapiPaymentStatus;
  paymentMethod: enmStrapiPaymentMethod;
};

export type typOrder = {
  id: number;
  documentId: string;
  orderItems: typOrderItem[];
  date: string;
  totalPayment: number;
  orderStatus: enmOrderStatus;
  ShippingAddress: typAddress;
  payment: typPayment;
};
