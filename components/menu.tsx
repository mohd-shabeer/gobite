import React from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { MenuItem as MenuItemType, CartItem as CartItemType } from '../types';
import { Button } from './ui';
import { useStore } from '../context';
import { useNavigate } from 'react-router-dom';

// --- Category Tabs ---
interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}
export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border py-2">
      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface text-textSecondary hover:bg-surfaceLight hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Menu Item Card ---
interface MenuItemProps {
  item: MenuItemType;
  onClick: () => void;
}
export const MenuItem: React.FC<MenuItemProps> = ({ item, onClick }) => {
  return (
    <div 
      className="bg-surface rounded-xl overflow-hidden border border-border group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.popular && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            Popular
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white line-clamp-1">{item.name}</h3>
          <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-textSecondary text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
        <Button size="sm" className="w-full text-sm py-2">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

// --- Item Detail Modal ---
interface ItemDetailModalProps {
  item: MenuItemType | null;
  isOpen: boolean;
  onClose: () => void;
}
export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, isOpen, onClose }) => {
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useStore();

  React.useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleAddToCart = () => {
    addToCart(item, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full sm:max-w-lg bg-surface border border-border sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="relative h-64">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-white">{item.name}</h2>
            <span className="text-2xl font-bold text-primary">${(item.price * quantity).toFixed(2)}</span>
          </div>
          <p className="text-textSecondary mb-6">{item.description}</p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center bg-surfaceLight rounded-xl border border-border p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-white/5 rounded-lg text-white transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-bold text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-white/5 rounded-lg text-white transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <Button className="flex-1" onClick={handleAddToCart}>
              Add to Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Cart Item ---
interface CartItemProps {
  item: CartItemType;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}
export const CartItem: React.FC<CartItemProps> = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex gap-4 p-4 bg-surface rounded-xl border border-border">
      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-white">{item.name}</h4>
          <button onClick={onRemove} className="text-textSecondary hover:text-error transition-colors">
            <X size={18} />
          </button>
        </div>
        <p className="text-primary font-bold text-sm mb-2">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onUpdate(item.quantity - 1)}
            className="p-1 rounded-full bg-surfaceLight border border-border text-white hover:border-primary transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdate(item.quantity + 1)}
            className="p-1 rounded-full bg-surfaceLight border border-border text-white hover:border-primary transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Floating Cart Button ---
export const CartFloatingButton: React.FC = () => {
  const { cart } = useStore();
  const navigate = useNavigate();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button 
        onClick={() => navigate('/cart')}
        className="group relative flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-lg shadow-primary/40 hover:scale-110 transition-transform duration-200"
      >
        <ShoppingCart size={28} />
        <span className="absolute -top-2 -right-2 w-7 h-7 bg-white text-primary text-sm font-bold rounded-full flex items-center justify-center border-2 border-background animate-bounce">
          {itemCount}
        </span>
      </button>
    </div>
  );
};
