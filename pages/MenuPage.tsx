import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/ui';
import { CategoryTabs, MenuItem, ItemDetailModal, CartFloatingButton } from '../components/menu';
import { useStore } from '../context';
import { MENU_ITEMS, CATEGORIES } from '../data';
import { MenuItem as MenuItemType } from '../types';

export const MenuPage: React.FC = () => {
  const { restaurantId, tableNumber } = useParams();
  const { setSessionInfo } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  useEffect(() => {
    if (restaurantId && tableNumber) {
      setSessionInfo(restaurantId, tableNumber);
    }
  }, [restaurantId, tableNumber, setSessionInfo]);

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        subtitle={`Table ${tableNumber || '1'} • Restaurant`} 
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
      </main>

      <ItemDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />

      <CartFloatingButton />
    </div>
  );
};
