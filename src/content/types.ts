import { enmDiscountType } from "./enums";

// Category
export type typCategory = {
  id: number;
  name: string;
  icon?: string;
  imageUrl?: string;
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
  defaultVariantId: number;
  defaultVariantAttributes: typProductAttribute[];
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

export type typUser = {
  id: string;
  username: string;
  email: string;
  phone?: string;
};

export type typShippingAddress = {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
};

export type typPhone = {
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
  total: number;
};

export type typCart = {
  id: number;
  items: typCartItem[];
};

export type typWishlistItem = {
  id: number;
  product: typProduct;
  variant: typProductVariant;
  originalPrice: number;
  displayPrice: number;
  appliedOffer?: typProductOffer;
};

export type typWishlist = {
  id: number;
  items: typWishlistItem[];
};

export type typOrderItem = {
  id: number;
  productTitle: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: string;
  productVariantId: number;
};

export type typPayment = {
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  cardBrand: string;
  cardLast4: string;
};

export type typOrder = {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  subtotal: number;
  discountAmount: number | null;
  orderStatus: string;
  shippingAddress: typShippingAddress | null;
  phone: typPhone | null;
  items: typOrderItem[];
  payment: typPayment | null;
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
