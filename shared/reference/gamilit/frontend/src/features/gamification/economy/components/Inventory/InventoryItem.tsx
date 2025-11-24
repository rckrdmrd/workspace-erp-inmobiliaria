/**
 * InventoryItem - Individual inventory item display
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { ShopItem } from '../../types/economyTypes';

interface InventoryItemProps {
  item: ShopItem;
  index: number;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({ item, index }) => {
  const rarityColors = {
    common: 'border-rarity-common bg-rarity-common/5',
    rare: 'border-rarity-rare bg-rarity-rare/5',
    epic: 'border-rarity-epic bg-rarity-epic/5',
    legendary: 'border-rarity-legendary bg-rarity-legendary/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`
        p-4 rounded-detective border-2 shadow-card hover:shadow-card-hover
        transition-all duration-300
        ${rarityColors[item.rarity]}
      `}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{item.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-detective-text">{item.name}</h3>
            {item.rarity === 'legendary' && (
              <Sparkles className="w-4 h-4 text-detective-gold animate-pulse" />
            )}
          </div>
          <p className="text-detective-xs text-detective-text-secondary line-clamp-1">
            {item.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-white rounded-full text-detective-xs font-medium capitalize">
              {item.rarity}
            </span>
            <span className="text-detective-xs text-detective-text-secondary">
              Worth: {item.price} ML
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
