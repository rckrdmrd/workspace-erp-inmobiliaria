/**
 * UserInventory - Display user's owned items
 */

import { motion } from 'framer-motion';
import { Package, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { InventoryItem } from './InventoryItem';
import type { ShopCategory } from '../../types/economyTypes';

export const UserInventory: React.FC = () => {
  const {
    inventory,
    inventoryCount,
    isEmpty,
    inventoryStats,
    searchInventory,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ShopCategory | 'all'>('all');

  const filteredInventory =
    searchQuery ? searchInventory(searchQuery) :
    categoryFilter === 'all' ? inventory :
    inventory.filter((item) => item.category === categoryFilter);

  return (
    <div className="bg-white rounded-detective shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-detective-2xl font-bold text-detective-text">
            Your Inventory
          </h2>
          <p className="text-detective-sm text-detective-text-secondary">
            {inventoryCount} items • Total value: {inventoryStats.totalValue.toLocaleString()} ML
          </p>
        </div>
        <div className="p-4 bg-detective-gold/10 rounded-detective">
          <Package className="w-8 h-8 text-detective-gold" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-detective-text-secondary" />
          <input
            type="text"
            placeholder="Search your items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-detective-orange/30 rounded-detective focus:outline-none focus:border-detective-orange"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ShopCategory | 'all')}
          className="px-4 py-2 border border-detective-orange/30 rounded-detective focus:outline-none focus:border-detective-orange"
        >
          <option value="all">All Categories</option>
          <option value="cosmetics">Cosmetics</option>
          <option value="profile">Profile</option>
          <option value="guild">Guild</option>
          <option value="premium">Premium</option>
          <option value="social">Social</option>
        </select>
      </div>

      {/* Inventory Grid */}
      {isEmpty ? (
        <div className="text-center py-20">
          <Package className="w-20 h-20 text-detective-text-secondary/30 mx-auto mb-4" />
          <p className="text-detective-lg text-detective-text-secondary">
            Your inventory is empty
          </p>
          <p className="text-detective-sm text-detective-text-secondary mt-2">
            Visit the shop to purchase items!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInventory.map((item, index) => (
            <InventoryItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
