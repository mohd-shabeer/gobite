import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components/ui';
import { CartItem } from '../components/menu';
import { useStore } from '../context';
import { Trash2, ShoppingBag, ShieldAlert, ChevronRight } from 'lucide-react';
import { Order } from '../types';
import { HOTEL_NAME } from '../data';

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
      <Header title="Order Review" showBack />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-surfaceLight rounded-full flex items-center justify-center text-textSecondary mb-8">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-textSecondary mb-10 max-w-xs">Looks like you haven't picked your favorites yet. Let's fix that!</p>
            <Button onClick={() => navigate(-1)} className="px-10">Browse Our Menu</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-surfaceLight/50 p-5 rounded-2xl border border-border">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    <span className="font-bold">{tableNumber?.split('-')[1] || '0'}</span>
                 </div>
                 <div>
                    <p className="text-[10px] text-textSecondary uppercase font-bold tracking-widest">Active Table</p>
                    <p className="text-white font-bold">{tableNumber || 'Not Set'}</p>
                 </div>
              </div>
              <button 
                onClick={clearCart}
                className="flex items-center gap-2 text-xs font-bold text-error/80 hover:text-error transition-colors p-2"
              >
                <Trash2 size={16} /> RESET ORDER
              </button>
            </div>

            <div className="space-y-4">
              {cart.map(item => (
                <CartItem 
                  key={item.cartId} 
                  item={item} 
                  onUpdate={(qty) => updateQuantity(item.cartId, qty)} 
                  onRemove={() => removeFromCart(item.cartId)}
                />
              ))}
            </div>

            {/* Sticky Allergy Reminder */}
            <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
              <ShieldAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Safety Instruction: Allergies</p>
                 <p className="text-xs text-textSecondary leading-relaxed">
                   Important: If you have any food allergies, please let <span className="text-white font-bold">{HOTEL_NAME}</span> know about it before checkout. Your health is our priority.
                 </p>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-surface border border-border rounded-3xl p-8 mt-2 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <h3 className="font-bold text-white text-xl mb-6">Order Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-textSecondary">
                  <span className="font-medium">Selected Items ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-textSecondary">
                  <span className="font-medium">Tax & Service Fee (10%)</span>
                  <span className="text-white font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between items-center text-white">
                  <span className="text-lg font-bold">Estimated Total</span>
                  <span className="text-3xl font-black text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-center text-textSecondary pb-4 uppercase tracking-[0.2em]">
              Final prices include GST where applicable
            </p>
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-40">
           <div className="max-w-3xl mx-auto">
             <Button className="w-full text-xl py-5 rounded-2xl shadow-2xl shadow-primary/30" onClick={handleCheckout} isLoading={isProcessing}>
               Confirm Order <ChevronRight size={20} />
             </Button>
           </div>
        </div>
      )}
    </div>
  );
};
