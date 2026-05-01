

export interface StrapiColor {
  documentId: string;
  id: number;
  name: string;
  hex_code: string;
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
  id: string;
  email: string;
  user_metadata: { display_name?: string };
  phone?: string;
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
  default_variant_id: number;
  offer: ProductOfferDB | null;
  display_price: number;
  original_price: number;
  max_price: number;
  min_price: number;
  averageRating: number;
  totalReviews: number;
  default_variant_attributes: ProductAttributeDB[];
}
export type CartItemDB = {
  id: number;
  product: ProductDB;
  variant: ProductVariantDB;
  quantity: number;
  total_price: number;
  unit_price: number;
};
export type CartDB = {
  id: number;
  items: CartItemDB[];
};

export type WishlistItemDB = {
  id: number;
  product: ProductDB;
  variant: ProductVariantDB;
  original_price: number;
  display_price: number;
  applied_offer: ProductOfferDB;
};

export type WishlistDB = {
  id: number;
  items: WishlistItemDB[];
};
export interface orderItemDB {
  id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
  product_variant_id: number;
  product_title: string;
  product_image: string;
  sku: string;
}

export interface orderDB {
  id: number;
  order_number: string;
  created_at: string;
  updated_at: string;
  status: string;
  shipping_address: AddressDB | null;
  phone: PhoneDB | null;
  discount_amount: number | null;
  total_amount: number;
  subtotal_amount: number;
  items: orderItemDB[];
  payment: paymentDB | null;
}

export interface paymentDB {
  payment_method: string;
  status: string;
  amount: number;
  currency: string;
  card_brand: string;
  card_last4: string;
}

export interface AddressDB {
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface PhoneDB {
  dialCode: string;
  number: string;
  countryCode: string;
}

export interface ReviewImageDB {
  id: number;
  image_url: string;
  position: number;
}

export interface ReviewDB {
  id: number;
  created_at: string;
  updated_at: string;
  product_id: number;
  product_variant_id: number;
  order_item_id: number;
  user_id: string;
  rating: number;
  comment: string;
  status: string;
  helpful_count: number;
  unhelpful_count: number;
  images: ReviewImageDB[];
}
