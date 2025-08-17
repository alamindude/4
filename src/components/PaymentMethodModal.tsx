import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentMethodModal = ({ isOpen, onClose }: PaymentMethodModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-card border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full mx-4 neon-blue-input"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-white neon-text-glow">
                How to Pay
              </h2>
              
              <div className="space-y-4 text-white/90">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-neon-pink flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-1">
                    1
                  </div>
                  <p>First enter your bKash/Nagad number</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1">
                    2
                  </div>
                  <p>Second enter verification code on your number</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-neon-green flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-1">
                    3
                  </div>
                  <p>Enter your PIN</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_hsl(220_100%_60%/0.3)]"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};