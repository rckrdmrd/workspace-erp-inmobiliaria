/**
 * ShopNavigation - Category tabs navigation
 */

import { motion } from 'framer-motion';
import { Store, Palette, Shield, Star, MessageCircle } from 'lucide-react';
import type { ShopCategory } from '../../types/economyTypes';

interface ShopNavigationProps {
  selectedCategory: ShopCategory | 'all';
  onSelectCategory: (category: ShopCategory | 'all') => void;
}

export const ShopNavigation: React.FC<ShopNavigationProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'all' as const, name: 'All Items', icon: Store, color: 'detective-text' },
    { id: 'cosmetics' as const, name: 'Cosmetics', icon: Palette, color: 'detective-orange' },
    { id: 'profile' as const, name: 'Profile', icon: Shield, color: 'detective-blue' },
    { id: 'guild' as const, name: 'Guild', icon: Shield, color: 'rank-capitan-from' },
    { id: 'premium' as const, name: 'Premium', icon: Star, color: 'detective-gold' },
    { id: 'social' as const, name: 'Social', icon: MessageCircle, color: 'detective-success' },
  ];

  return (
    <div className="mb-8">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-detective font-medium transition-all
                whitespace-nowrap
                ${isSelected
                  ? 'bg-detective-orange text-white shadow-orange'
                  : 'bg-white text-detective-text hover:bg-detective-bg border-2 border-detective-orange/20'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
