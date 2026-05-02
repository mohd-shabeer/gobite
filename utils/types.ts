export interface ItemVariant {
  id: string;
  variantName: string;
  priceImpact: number;
}

export interface MenuItem {
  id: string;
  categoryId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  available?: boolean;
  offerPrice?: number;
  itemType?: "veg" | "non-veg";
  stockType?: "unlimited" | "limited";
  stockQuantity?: number;
  variants?: ItemVariant[];
}

export type OrderType = "Dining" | "Takeaway";

export interface CartItem extends MenuItem {
  quantity: number;
  orderType: OrderType;
  instructions?: string;
  allergies?: string[];
  customAllergy?: string;
  cartId: string;
  status?: "active" | "removed" | "unavailable";
  staffNote?: string;
  selectedVariant?: ItemVariant;
}

export type UserRole = "customer" | "admin" | "kitchen";

export interface User {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  password?: string;
  username?: string;
  restaurant_id?: number | string;
  restaurant_name?: string;
  qr_code_token?: string;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  restaurantId: string;
  restaurantName: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
}

export interface Restaurant {
  id: string;
  name: string;
}
