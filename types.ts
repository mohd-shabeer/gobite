export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export type OrderType = 'Dining' | 'Takeaway';

export interface CartItem extends MenuItem {
  quantity: number;
  orderType: OrderType;
  instructions?: string;
  allergies?: string[];
  customAllergy?: string;
  cartId: string; // Unique ID for same item with different options
}

export interface User {
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  restaurantId: string;
  tableNumber: string;
}

export interface Restaurant {
  id: string;
  name: string;
}