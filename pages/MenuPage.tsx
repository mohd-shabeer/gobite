import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Button, Logo } from '../components/ui';
import { CategoryTabs, MenuItem, ItemDetailModal, CartFloatingButton } from '../components/menu';
import { useStore } from '../context';
import { MENU_ITEMS, CATEGORIES, AVAILABLE_TABLES, HOTEL_NAME } from '../data';
import { MenuItem as MenuItemType } from '../types';
import { ShieldAlert, MapPin } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { tableNumber, setSessionInfo } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [showTablePicker, setShowTablePicker] = useState(!tableNumber);

  useEffect(() => {
    if (!tableNumber) {
      setShowTablePicker(true);
    }
  }, [tableNumber]);

  const handleTableSelect = (num: string) => {
    setSessionInfo(restaurantId || 'default', num);
    setShowTablePicker(false);
  };

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header 
        subtitle={`Serving at ${tableNumber || '...'} • ${HOTEL_NAME}`} 
        showCart 
      />
      
      <CategoryTabs 
        categories={CATEGORIES} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredItems.map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedItem(item)} 
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-textSecondary">No items found in this category.</p>
          </div>
        )}

        {/* Allergy Safety Footer Label */}
        <div className="mt-16 p-8 bg-surface border border-border rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left transition-all hover:border-primary/20">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h4 className="font-bold text-white text-xl mb-2 flex items-center gap-2 justify-center sm:justify-start">
              Allergies & Dietary Needs
            </h4>
            <p className="text-sm text-textSecondary leading-relaxed max-w-2xl">
              Safety first! Please let <span className="text-white font-bold">{HOTEL_NAME}</span> know about any allergies you may have before finalizing your order. Our team is dedicated to accommodating your health requirements.
            </p>
          </div>
        </div>
      </main>

      {/* Table Picker Overlay */}
      {showTablePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-2xl" />
          <div className="relative w-full max-w-lg bg-surface border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-slide-up text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
               <MapPin size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Welcome to {HOTEL_NAME}</h2>
            <p className="text-textSecondary mb-10 text-base">Please select your table location to start your dining experience.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {AVAILABLE_TABLES.map(num => (
                <button
                  key={num}
                  onClick={() => handleTableSelect(num)}
                  className="py-5 bg-surfaceLight border border-border rounded-2xl text-white font-bold text-lg hover:bg-primary hover:border-primary hover:scale-105 transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}
            </div>

            <p className="text-xs text-textSecondary font-medium">
              Ordering for takeaway? You may select any table to proceed with your order.
            </p>
          </div>
        </div>
      )}

      <ItemDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <CartFloatingButton />
    </div>
  );
};
