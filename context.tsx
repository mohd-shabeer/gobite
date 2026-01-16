import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, Order, User, OrderType } from './types';

interface AddToCartParams {
  item: MenuItem;
  quantity: number;
  orderType: OrderType;
  instructions?: string;
  allergies?: string[];
  customAllergy?: string;
}

interface StoreContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (params: AddToCartParams) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  restaurantId: string;
  tableNumber: string;
  setSessionInfo: (restId: string, table: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gobite_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gobite_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gobite_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [restaurantId, setRestaurantId] = useState('default');
  const [tableNumber, setTableNumber] = useState(() => {
    return localStorage.getItem('gobite_table') || '';
  });

  useEffect(() => {
    localStorage.setItem('gobite_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gobite_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gobite_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    localStorage.removeItem('gobite_user');
    localStorage.removeItem('gobite_cart');
    localStorage.removeItem('gobite_orders');
    localStorage.removeItem('gobite_table');
  };

  const addToCart = ({ item, quantity, orderType, instructions, allergies, customAllergy }: AddToCartParams) => {
    // Generate robust ID
    const cleanInstructions = (instructions || '').trim();
    const cleanCustomAllergy = (customAllergy || '').trim();
    const sortedAllergies = [...(allergies || [])].sort().join(',');
    
    const cartId = `${item.id}-${orderType}-${cleanInstructions}-${sortedAllergies}-${cleanCustomAllergy}`;
    
    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) {
        return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { 
        ...item, 
        cartId, 
        quantity, 
        orderType, 
        instructions: cleanInstructions, 
        allergies: allergies?.sort(), 
        customAllergy: cleanCustomAllergy 
      }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const setSessionInfo = (restId: string, table: string) => {
    setRestaurantId(restId);
    setTableNumber(table);
    localStorage.setItem('gobite_table', table);
  };

  return (
    <StoreContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      orders, addOrder,
      restaurantId, tableNumber, setSessionInfo
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};