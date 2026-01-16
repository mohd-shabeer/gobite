import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ClipboardList } from 'lucide-react';
import { Button } from '../components/ui';
import { useStore } from '../context';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [countdown, setCountdown] = useState(10);
  const latestOrder = orders[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 text-center shadow-2xl animate-fade-in relative overflow-hidden">
        {/* Confetti-like decoration (CSS based usually, simplified here) */}
        
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 text-success animate-slide-up">
          <Check size={40} strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Order Placed!</h1>
        <p className="text-textSecondary mb-8">
          Your order <span className="text-white font-bold">#{latestOrder?.id}</span> has been sent to the kitchen.
        </p>

        <div className="bg-surfaceLight rounded-xl p-4 mb-8">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-textSecondary">Total Items</span>
                <span className="text-white font-bold">{latestOrder?.items.reduce((a,b) => a + b.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-textSecondary">Total Amount</span>
                <span className="text-primary font-bold">${latestOrder?.total.toFixed(2)}</span>
            </div>
        </div>

        <div className="space-y-3">
          <Button onClick={() => navigate('/orders')} className="w-full" variant="outline">
            <ClipboardList className="w-4 h-4" /> View Order
          </Button>
          <Button onClick={() => navigate('/menu/default/1')} className="w-full">
            Order More <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-textSecondary mt-6">
          Redirecting to history in {countdown}s...
        </p>
      </div>
    </div>
  );
};
