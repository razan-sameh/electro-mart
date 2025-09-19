// Category
export interface Category {
  id: number;
  name: string;
  icon?: string;
  imageUrl?: string;
  products?: Product[];
}

// Product
export interface Product {
  id: number;
  name: string;
  price: number;
  category?: Category;
}

// User (Auth)
export interface User {
  id: number;
  username: string;
  email: string;
  token?: string; // for JWT
}

// Cart
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}
