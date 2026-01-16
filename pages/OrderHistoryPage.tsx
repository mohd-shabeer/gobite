import React from 'react';
import { Header, StatusBadge } from '../components/ui';
import { useStore } from '../context';
import { Clock, ShoppingBag, Utensils } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useStore();

  return (
    <div className="min-h-screen bg-background">
      <Header title="Order History" showBack />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-textSecondary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
            <p className="text-textSecondary">Your past orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-colors shadow-lg">
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">Order #{order.id}</h3>
                    <p className="text-xs text-textSecondary mt-1">{new Date(order.date).toLocaleString()}</p>
                    <p className="text-xs text-textSecondary mt-0.5">Table: <span className="text-white">{order.tableNumber}</span></p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="space-y-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={item.cartId || idx} className="flex justify-between items-start text-sm">
                      <div className="flex gap-3">
                         <div className="w-6 h-6 rounded bg-surfaceLight flex items-center justify-center text-xs font-bold text-white shrink-0">
                           {item.quantity}x
                         </div>
                         <div className="flex flex-col gap-1.5">
                           <span className="text-textSecondary font-medium leading-tight">{item.name}</span>
                           <div className="flex flex-wrap gap-2">
                             <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${
                               item.orderType === 'Takeaway' 
                               ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                               : 'bg-primary/10 border-primary/20 text-primary'
                             }`}>
                               {item.orderType === 'Takeaway' ? <ShoppingBag size={10} /> : <Utensils size={10} />}
                               {item.orderType}
                             </span>
                             {item.instructions && (
                               <span className="text-[10px] text-textSecondary italic max-w-[200px] truncate">
                                 Note: {item.instructions}
                               </span>
                             )}
                           </div>
                         </div>
                      </div>
                      <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                  <span className="text-textSecondary">Total Amount</span>
                  <span className="text-primary font-bold text-xl">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};