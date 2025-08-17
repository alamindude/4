import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '@/store/paymentStore';
import { NeonLogo } from '@/components/NeonLogo';
import { toast } from '@/hooks/use-toast';

export const Home = () => {
  const navigate = useNavigate();
  const { name, amount, setName, setAmount, generateInvoiceId } = usePaymentStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }
    
    if (name.trim().length < 2) {
      toast({
        title: "Name too short",
        description: "Name must be at least 2 characters",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Generate invoice ID and save to store + localStorage
    generateInvoiceId();
    
    // Simulate loading for smooth UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsLoading(false);
    navigate('/pay');
  };

  const formatAmount = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-20">
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <NeonLogo size="lg" />
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Enter Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 rounded-xl neon-blue-input text-white placeholder-white/50 focus:outline-none transition-all duration-300"
              placeholder="Your full name"
              required
              minLength={2}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Enter Amount To Pay
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount || ''}
                onChange={(e) => setAmount(formatAmount(e.target.value))}
                className="w-full px-4 py-4 pl-8 rounded-xl neon-blue-input text-white placeholder-white/50 focus:outline-none transition-all duration-300"
                placeholder="0.00"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 font-medium">
                ৳
              </span>
            </div>
            {amount > 0 && (
              <p className="text-sm text-white/60">
                Amount: ৳{amount.toFixed(2)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl neon-pink-btn text-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Pay Now'
            )}
          </motion.button>
        </motion.form>

        {/* Info Text */}
        <motion.p
          className="text-center text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Secure payment with bKash & Nagad
        </motion.p>
      </motion.div>
    </div>
  );
};