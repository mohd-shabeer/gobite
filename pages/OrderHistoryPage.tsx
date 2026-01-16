import React from 'react';
import { Header, StatusBadge } from '../components/ui';
import { useStore } from '../context';
import { Clock } from 'lucide-react';

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
              <div key={order.id} className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white">Order #{order.id}</h3>
                    <p className="text-sm text-textSecondary">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-textSecondary">
                        <span className="text-white font-medium">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="text-textSecondary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-textSecondary">Total Amount</span>
                  <span className="text-primary font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
