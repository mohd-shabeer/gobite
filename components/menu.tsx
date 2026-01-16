import React from 'react';
import { Plus, Minus, ShoppingCart, X, Utensils, ShoppingBag, AlertTriangle } from 'lucide-react';
import { MenuItem as MenuItemType, CartItem as CartItemType, OrderType } from '../types';
import { Button } from './ui';
import { useStore } from '../context';
import { useNavigate } from 'react-router-dom';
import { COMMON_ALLERGIES, HOTEL_NAME } from '../data';

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
          Add To Order
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
  const [orderType, setOrderType] = React.useState<OrderType>('Dining');
  const [instructions, setInstructions] = React.useState('');
  const [selectedAllergies, setSelectedAllergies] = React.useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = React.useState('');
  const [existingCartId, setExistingCartId] = React.useState<string | null>(null);
  
  const { cart, addToCart, updateQuantity } = useStore();

  // Reset or Sync when item changes or modal opens
  React.useEffect(() => {
    if (isOpen && item) {
      // Default state reset
      setOrderType('Dining');
      setInstructions('');
      setSelectedAllergies([]);
      setCustomAllergy('');
      // We start with 1, but the effect below will check for existing
      setQuantity(1);
    }
  }, [isOpen, item]);

  // Check for existing item in cart whenever dependencies change
  React.useEffect(() => {
    if (!item || !isOpen) return;

    const cleanInstructions = instructions.trim();
    const cleanCustomAllergy = customAllergy.trim();
    const sortedAllergies = [...selectedAllergies].sort().join(',');
    
    // Generate the ID exactly how context does
    const targetId = `${item.id}-${orderType}-${cleanInstructions}-${sortedAllergies}-${cleanCustomAllergy}`;
    
    const found = cart.find(i => i.cartId === targetId);
    
    if (found) {
      setExistingCartId(found.cartId);
      setQuantity(found.quantity);
    } else {
      setExistingCartId(null);
      // Only reset to 1 if we switched from an existing item to a non-existing configuration
      // We don't want to reset to 1 if the user is just typing instructions (though typing instructions changes ID, so new config, so 1 is correct)
      if (quantity === 0) setQuantity(1); 
    }
  }, [item, isOpen, orderType, instructions, selectedAllergies, customAllergy, cart]);

  if (!isOpen || !item) return null;

  const handleAction = () => {
    if (existingCartId) {
      // Update existing item
      updateQuantity(existingCartId, quantity);
    } else {
      // Add new item
      addToCart({ 
        item, 
        quantity, 
        orderType, 
        instructions, 
        allergies: selectedAllergies,
        customAllergy 
      });
    }
    onClose();
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full sm:max-w-xl bg-surface border border-border sm:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[95vh]">
        <div className="relative h-40 sm:h-56 shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-40" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white leading-tight">{item.name}</h2>
            <span className="text-2xl font-bold text-primary">${(item.price * quantity).toFixed(2)}</span>
          </div>
          <p className="text-textSecondary text-sm mb-6 leading-relaxed">{item.description}</p>

          {/* Dining Type Selection */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-3">Order Serving Options</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setOrderType('Dining')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${orderType === 'Dining' ? 'bg-primary/10 border-primary text-primary' : 'bg-surfaceLight border-border text-textSecondary'}`}
              >
                <Utensils size={18} /> <span className="text-[10px] font-bold">DINING</span>
              </button>
              <button 
                onClick={() => setOrderType('Takeaway')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${orderType === 'Takeaway' ? 'bg-primary/10 border-primary text-primary' : 'bg-surfaceLight border-border text-textSecondary'}`}
              >
                <ShoppingBag size={18} /> <span className="text-[10px] font-bold">TAKEAWAY</span>
              </button>
            </div>
          </div>

          {/* Allergy Request Box */}
          <div className="mb-8 p-5 bg-surfaceLight rounded-2xl border border-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-4">Allergy Request</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_ALLERGIES.map(allergy => (
                <button
                  key={allergy}
                  onClick={() => toggleAllergy(allergy)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedAllergies.includes(allergy) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface border-border text-textSecondary hover:border-white/20'}`}
                >
                  {allergy}
                </button>
              ))}
            </div>
            <input 
              type="text"
              placeholder="Or enter allergy manually..."
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors mb-3"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
            />
            <div className="flex items-start gap-2.5 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
              <AlertTriangle className="text-red-500 shrink-0" size={14} />
              <p className="text-[10px] text-red-500/80 font-medium leading-normal">
                Please note: Some special allergy requests may incur an additional service charge. We cannot guarantee 100% trace-free environment.
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-3">Special Instructions</label>
            <textarea 
              placeholder="Anything else we should know? (e.g. no onions, extra ice)"
              rows={3}
              className="w-full bg-surfaceLight border border-border rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary transition-colors resize-none"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-6 border-t border-border">
            <div className="flex items-center bg-surfaceLight rounded-xl border border-border p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-white/5 rounded-lg text-white transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center font-bold text-white text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-white/5 rounded-lg text-white transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <Button className="flex-1 py-4 text-lg" onClick={handleAction}>
              {existingCartId ? 'Update Order' : 'Add to Order'}
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
  const hasAllergies = (item.allergies && item.allergies.length > 0) || item.customAllergy;

  return (
    <div className="flex flex-col gap-3 p-5 bg-surface rounded-2xl border border-border shadow-sm">
      <div className="flex gap-4">
        <div className="relative">
           <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
           <span className="absolute -top-2 -left-2 px-2 py-0.5 bg-primary text-[10px] font-bold rounded-md text-white">
              {item.orderType.charAt(0)}
           </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-white truncate text-lg">{item.name}</h4>
            <button onClick={onRemove} className="text-textSecondary hover:text-error transition-colors p-1">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-bold text-primary">${item.price.toFixed(2)}</span>
            <span className="text-[10px] text-textSecondary bg-surfaceLight px-2 py-0.5 rounded border border-border uppercase">
              {item.orderType}
            </span>
          </div>
        </div>
      </div>

      {(item.instructions || hasAllergies) && (
        <div className="pl-5 ml-8 space-y-2 border-l-2 border-primary/20 py-1">
          {item.instructions && (
            <p className="text-xs text-textSecondary italic">
              "{item.instructions}"
            </p>
          )}
          {hasAllergies && (
            <div className="flex items-start gap-1.5 text-[11px] text-red-400 font-medium">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>
                Allergies: {[...(item.allergies || []), item.customAllergy].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 mt-2">
        <div className="flex items-center bg-surfaceLight rounded-lg border border-border p-0.5">
          <button 
            onClick={() => onUpdate(item.quantity - 1)}
            className="p-1.5 rounded-md hover:bg-white/5 text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-bold text-white min-w-[30px] text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdate(item.quantity + 1)}
            className="p-1.5 rounded-md hover:bg-white/5 text-white transition-colors"
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
        className="group relative flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-200"
      >
        <ShoppingCart size={28} />
        <span className="absolute -top-1 -right-1 w-7 h-7 bg-white text-primary text-sm font-bold rounded-full flex items-center justify-center border-2 border-background animate-bounce">
          {itemCount}
        </span>
      </button>
    </div>
  );
};