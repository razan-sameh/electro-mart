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
  id: number;
  name: string;
  specificationValues?: typSpecificationValus[];
  categories?: typCategory[];
};

export type typSpecificationValus = {
  id: number;
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
  id: number;
  title: string;
  discountType: enmDiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  products?: typProduct[];
};
export type ProductFilters = {
  specialOffer?: boolean;
  categoryId?: string;
  brandId?: number;
};

export type typColor = {
  id: number;
  name: string;
  hexCode?: string;
  products?: typProduct[];
};

// Product
export type typProduct = {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  category?: typCategory;
  brand: typBrand;
  description: string;
  stockQuantity: number;
  specialOffers?: typSpecialOffer[];
  color?: typColor[];
  specificationValues?: typSpecificationValus[];
};

// User (Auth)
export type typUser = {
  id: number;
  username: string;
  email: string;
  token?: string; // for JWT
};

// Cart
export type typCartItem = {
  id: number;
  product: typProduct;
  quantity: number;
};

export type typCart = {
  id: number;
  userId: number;
  items: typCartItem[];
};
