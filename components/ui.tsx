import React from 'react';
import { Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context';

// --- Logo Component ---
interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}
export const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-4xl',
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20`}>
        G
      </div>
      <span className={`font-bold text-white tracking-tight ${size === 'small' ? 'text-lg' : size === 'medium' ? 'text-2xl' : 'text-4xl'}`}>
        Gobite
      </span>
    </div>
  );
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, className = '', disabled, ...props 
}) => {
  const baseClasses = "relative px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary hover:bg-primaryDark text-white shadow-lg shadow-primary/30 hover:shadow-primary/40",
    secondary: "bg-surfaceLight hover:bg-border text-white",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-textSecondary mb-2">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary">
            {icon}
          </div>
        )}
        <input 
          className={`w-full bg-surface border ${error ? 'border-error' : 'border-border'} focus:border-primary rounded-xl py-3 ${icon ? 'pl-11' : 'px-4'} pr-4 text-white placeholder-textSecondary/50 outline-none transition-colors duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

// --- Status Badge Component ---
export const StatusBadge: React.FC<{ status: 'pending' | 'completed' | 'cancelled' }> = ({ status }) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    completed: "bg-success/10 text-success border-success/20",
    cancelled: "bg-error/10 text-error border-error/20",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} capitalize`}>
      {status}
    </span>
  );
};

// --- Header Component ---
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  subtitle?: string;
}
export const Header: React.FC<HeaderProps> = ({ title, showBack, showCart, subtitle }) => {
  const navigate = useNavigate();
  const { cart } = useStore();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full glass">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-surfaceLight rounded-full transition-colors text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
             {title ? (
               <h1 className="text-lg font-bold text-white">{title}</h1>
             ) : (
                <Logo size="small" />
             )}
             {subtitle && <p className="text-xs text-textSecondary">{subtitle}</p>}
          </div>
        </div>
        
        {showCart && (
          <button onClick={() => navigate('/cart')} className="relative p-2 hover:bg-surfaceLight rounded-full transition-colors text-white">
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
