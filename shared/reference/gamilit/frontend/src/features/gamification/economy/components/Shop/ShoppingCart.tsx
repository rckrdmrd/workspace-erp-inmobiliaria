/**
 * ShoppingCart - Cart sidebar with purchase functionality
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart as CartIcon, Trash2, CreditCard } from 'lucide-react';
import { useEconomyStore } from '../../store/economyStore';
import { useCoins } from '../../hooks/useCoins';
import { useState } from 'react';
import { PurchaseConfirmation } from './PurchaseConfirmation';

interface ShoppingCartProps {
  onClose: () => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ onClose }) => {
  const cart = useEconomyStore((state) => state.cart);
  const removeFromCart = useEconomyStore((state) => state.removeFromCart);
  const getCartTotal = useEconomyStore((state) => state.getCartTotal);
  const purchaseCart = useEconomyStore((state) => state.purchaseCart);
  const { balance, canAfford } = useCoins();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const total = getCartTotal();
  const affordable = canAfford(total);

  const handlePurchase = async () => {
    const result = await purchaseCart();
    if (result.success) {
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <CartIcon className="w-6 h-6 text-detective-orange" />
            <h2 className="text-detective-2xl font-bold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-detective-bg rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CartIcon className="w-20 h-20 text-detective-text-secondary/30 mb-4" />
              <p className="text-detective-lg text-detective-text-secondary">
                Your cart is empty
              </p>
              <p className="text-detective-sm text-detective-text-secondary mt-2">
                Add items from the shop to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 p-4 bg-detective-bg rounded-detective"
                >
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-detective-text">{item.name}</h3>
                    <p className="text-detective-sm text-detective-text-secondary line-clamp-1">
                      {item.description}
                    </p>
                    <p className="text-detective-gold font-bold mt-2">
                      {item.price} ML × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-detective-danger/10 rounded-full transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4 text-detective-danger" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-detective-text-secondary">Your Balance:</span>
              <span className="font-bold text-detective-text">
                {balance.current.toLocaleString()} ML
              </span>
            </div>
            <div className="flex justify-between items-center text-detective-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-detective-gold">
                {total.toLocaleString()} ML
              </span>
            </div>
            {!affordable && (
              <div className="p-3 bg-detective-danger/10 rounded-detective">
                <p className="text-detective-sm text-detective-danger text-center">
                  Insufficient balance. Need {(total - balance.current).toLocaleString()} more ML
                </p>
              </div>
            )}
            <button
              onClick={handlePurchase}
              disabled={!affordable}
              className={`
                w-full flex items-center justify-center gap-3 px-6 py-3 rounded-detective font-bold transition-all
                ${affordable
                  ? 'bg-detective-orange text-white hover:bg-detective-orange-dark hover:shadow-orange'
                  : 'bg-detective-neutral/20 text-detective-neutral cursor-not-allowed'}
              `}
            >
              <CreditCard className="w-5 h-5" />
              <span>Purchase {cart.length} Item{cart.length > 1 ? 's' : ''}</span>
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showConfirmation && <PurchaseConfirmation />}
      </AnimatePresence>
    </>
  );
};
