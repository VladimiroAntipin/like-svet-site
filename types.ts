export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  billboard: Billboard;
}

export interface Image {
  id: string;
  url: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  sizeId: string;
  size: Size;
}

export interface ProductColor {
  id: string;
  productId: string;
  colorId: string;
  color: Color;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string | null;
  isFeatured: boolean;
  images: Image[];
  productSizes: ProductSize[];
  productColors: ProductColor[];
  isGiftCard?: boolean;
  giftPrices?: GiftCardPrice[];
}

export interface GiftCardPrice {
  id: string;
  productId: string;
  value: number; 
}

export interface Favorite {
  id: string;          
  product: Product;     
}

export interface Order {
  id: string;
  products: Product[];
  totalAmount: string;
  createdAt: string;
}