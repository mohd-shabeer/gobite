import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components/ui';
import { CartItem } from '../components/menu';
import { useStore } from '../context';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, addOrder, restaurantId, tableNumber } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        items: [...cart],
        total,
        status: 'pending',
        date: new Date().toISOString(),
        restaurantId,
        tableNumber
      };
      addOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      navigate('/order-success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header title="Your Cart" showBack />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-surfaceLight rounded-full flex items-center justify-center text-textSecondary mb-6">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-textSecondary mb-8">Looks like you haven't added anything yet.</p>
            <Button onClick={() => navigate(-1)}>Browse Menu</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <button 
                onClick={clearCart}
                className="flex items-center gap-2 text-sm text-error hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cart.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdate={(qty) => updateQuantity(item.id, qty)} 
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-surface border border-border rounded-xl p-6 mt-6">
              <h3 className="font-bold text-white text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-textSecondary">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-textSecondary">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-40">
           <div className="max-w-3xl mx-auto">
             <Button className="w-full text-lg py-4" onClick={handleCheckout} isLoading={isProcessing}>
               Place Order • ${total.toFixed(2)}
             </Button>
           </div>
        </div>
      )}
    </div>
  );
};
