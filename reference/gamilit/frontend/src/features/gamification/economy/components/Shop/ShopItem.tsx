/**
 * ShopItem - Reusable shop item card component
 */

import { motion } from 'framer-motion';
import { ShoppingCart, Lock, Check, Sparkles } from 'lucide-react';
import type { ShopItem as ShopItemType } from '../../types/economyTypes';
import { useEconomyStore } from '../../store/economyStore';

interface ShopItemProps {
  item: ShopItemType;
  onPurchase?: (item: ShopItemType) => void;
}

export const ShopItem: React.FC<ShopItemProps> = ({ item, onPurchase }) => {
  const canAfford = useEconomyStore((state) => state.canAfford);
  const addToCart = useEconomyStore((state) => state.addToCart);

  const rarityColors = {
    common: 'border-rarity-common text-rarity-common bg-rarity-common/5',
    rare: 'border-rarity-rare text-rarity-rare bg-rarity-rare/5',
    epic: 'border-rarity-epic text-rarity-epic bg-rarity-epic/5',
    legendary: 'border-rarity-legendary text-rarity-legendary bg-rarity-legendary/5',
  };

  const rarityGlows = {
    common: 'hover:shadow-card-hover',
    rare: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    epic: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    legendary: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-gold-shine',
  };

  const affordable = canAfford(item.price);
  const locked = !item.isPurchasable || (item.requirements !== undefined && Object.keys(item.requirements).length > 0);

  const handleAddToCart = () => {
    if (!item.isOwned && item.isPurchasable && affordable) {
      addToCart(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`
        relative bg-white rounded-detective border-2 shadow-card
        transition-all duration-300 overflow-hidden
        ${rarityColors[item.rarity]}
        ${rarityGlows[item.rarity]}
        ${!affordable && !item.isOwned ? 'opacity-75' : ''}
      `}
    >
      {/* Rarity Badge */}
      <div className={`
        absolute top-2 right-2 px-2 py-1 rounded-full text-detective-xs font-bold uppercase
        ${rarityColors[item.rarity]}
        border ${item.rarity === 'legendary' ? 'animate-gold-shine' : ''}
      `}>
        {item.rarity === 'legendary' && <Sparkles className="inline w-3 h-3 mr-1" />}
        {item.rarity}
      </div>

      {/* Item Icon */}
      <div className="p-6 flex items-center justify-center bg-gradient-to-br from-detective-bg to-white">
        <div className="text-6xl">{item.icon}</div>
      </div>

      {/* Item Info */}
      <div className="p-4">
        <h3 className="font-bold text-detective-lg text-detective-text mb-2 truncate">
          {item.name}
        </h3>
        <p className="text-detective-sm text-detective-text-secondary mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-detective-bg text-detective-xs text-detective-text-secondary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Requirements */}
        {item.requirements && (
          <div className="mb-4 p-2 bg-detective-orange/10 rounded-detective">
            <div className="flex items-center gap-2 text-detective-sm text-detective-text-secondary">
              <Lock className="w-4 h-4" />
              <span>
                {item.requirements.rank && `Rank: ${item.requirements.rank}`}
                {item.requirements.level && ` | Level: ${item.requirements.level}`}
              </span>
            </div>
          </div>
        )}

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-detective-2xl font-bold text-detective-gold">
              {item.price}
            </span>
            <span className="text-detective-sm text-detective-text-secondary">ML</span>
          </div>

          {item.isOwned ? (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-detective-success/20 text-detective-success rounded-detective cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span className="font-medium">Owned</span>
            </button>
          ) : locked ? (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-detective-neutral/20 text-detective-neutral rounded-detective cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span className="font-medium">Locked</span>
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={!affordable}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-detective font-medium transition-colors
                ${affordable
                  ? 'bg-detective-orange text-white hover:bg-detective-orange-dark'
                  : 'bg-detective-neutral/20 text-detective-neutral cursor-not-allowed'}
              `}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{affordable ? 'Add to Cart' : 'Too Expensive'}</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
