import { enmDiscountType } from "./enums";

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
  id: string;
  name: string;
  hexCode?: string;
  products?: typProduct[];
};

// Product
export type typProduct = {
  id: string;
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
  id: string;
  username: string;
  email: string;
  token?: string; // for JWT
};

// Cart
export type typCartItem = {
  id: number;      
  documentId: string   
  product: typProduct; 
  quantity: number;
  selectedColor: typColor; 
};

export type typCart = {
  id: string;
  items: typCartItem[];
};
