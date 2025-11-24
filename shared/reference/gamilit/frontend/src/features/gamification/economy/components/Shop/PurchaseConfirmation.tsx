/**
 * PurchaseConfirmation - Success modal after purchase
 */

import { motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';

export const PurchaseConfirmation: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-detective p-8 max-w-md mx-4 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="inline-block p-4 bg-detective-success/20 rounded-full mb-4"
        >
          <CheckCircle className="w-16 h-16 text-detective-success" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-detective-2xl font-bold text-detective-text mb-2">
            Purchase Successful!
          </h2>
          <p className="text-detective-text-secondary mb-4">
            Your items have been added to your inventory
          </p>

          <div className="flex items-center justify-center gap-2 text-detective-gold">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Enjoy your new items!</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
