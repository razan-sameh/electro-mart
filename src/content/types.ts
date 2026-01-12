import { enmStrapiPaymentStatus } from "@/adapters/interfaces/enms";
import { enmDiscountType, enmOrderStatus } from "./enums";

// Category
export type typCategory = {
  id: number;
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
export type typProductFilters = {
  specialOffer?: boolean;
  categoryId?: number;
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
  hexCode: string;
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
  documentId: string;
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
  documentId: string;
  product: typProduct;
  quantity: number;
  selectedColor: typColor;
};

export type typCart = {
  id: string;
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
