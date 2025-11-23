/**
 * ShopLayout - Main shop page with navigation and items
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShopNavigation } from './ShopNavigation';
import { ShopItem } from './ShopItem';
import { ShoppingCart } from './ShoppingCart';
import { useShop } from '../../hooks/useShop';
import { allShopItems } from '../../mockData/shopItemsMockData';
import type { ShopCategory, ShopSortBy } from '../../types/economyTypes';
import { Search, SlidersHorizontal } from 'lucide-react';

export const ShopLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'all'>('all');
  const [showCart, setShowCart] = useState(false);

  const categoryItems =
    selectedCategory === 'all'
      ? allShopItems
      : allShopItems.filter((item) => item.category === selectedCategory);

  const {
    items,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    updateFilters,
  } = useShop(categoryItems);

  return (
    <div className="min-h-screen bg-detective-bg py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-detective-3xl font-bold text-detective-text mb-2">
            ML Coins Shop
          </h1>
          <p className="text-detective-text-secondary">
            Purchase items, upgrades, and exclusive content with your ML Coins
          </p>
        </div>

        {/* Navigation */}
        <ShopNavigation
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-detective-text-secondary" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-detective-orange/30 rounded-detective focus:outline-none focus:border-detective-orange bg-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ShopSortBy)}
            className="px-4 py-3 border-2 border-detective-orange/30 rounded-detective focus:outline-none focus:border-detective-orange bg-white"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
            <option value="rarity">Rarity</option>
          </select>
          <button
            onClick={() => setShowCart(!showCart)}
            className="px-6 py-3 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium"
          >
            Cart
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ShopItem key={item.id} item={item} />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-detective-text-secondary text-detective-lg">
              No items found. Try adjusting your filters.
            </p>
          </div>
        )}

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <ShoppingCart onClose={() => setShowCart(false)} />
        )}
      </div>
    </div>
  );
};
