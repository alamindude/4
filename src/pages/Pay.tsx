import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smartphone, CreditCard, HelpCircle } from 'lucide-react';
import { usePaymentStore } from '@/store/paymentStore';
import { NeonLogo } from '@/components/NeonLogo';
import { PaymentMethodModal } from '@/components/PaymentMethodModal';
import { toast } from '@/hooks/use-toast';

export const Pay = () => {
  const navigate = useNavigate();
  const { name, amount, invoiceId } = usePaymentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if user has valid data, otherwise redirect to home
    if (!name || !amount || amount <= 0) {
      // Try to load from localStorage
      const savedData = localStorage.getItem('payment_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.name && parsed.amount > 0) {
            // Data exists in localStorage, continue
            return;
          }
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
      
      toast({
        title: "No payment data found",
        description: "Please fill in your details first",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [name, amount, navigate]);

  const handleBkashPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate bKash API call
      toast({
        title: "Processing payment...",
        description: "Connecting to bKash",
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate success
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        toast({
          title: "Payment successful!",
          description: "Redirecting to success page...",
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate(`/success?invoice=${invoiceId}`);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNagadPayment = () => {
    toast({
      title: "Coming Soon",
      description: "Nagad API integration coming soon!",
    });
  };

  const paymentMethods = [
    {
      id: 'bkash',
      name: 'Pay with bKash',
      icon: <Smartphone className="w-6 h-6" />,
      className: 'neon-red-card',
      onClick: handleBkashPayment,
      disabled: isProcessing
    },
    {
      id: 'nagad',
      name: 'Pay with Nagad',
      icon: <CreditCard className="w-6 h-6" />,
      className: 'neon-orange-card',
      onClick: handleNagadPayment,
      disabled: false
    },
    {
      id: 'help',
      name: 'How to Pay',
      icon: <HelpCircle className="w-6 h-6" />,
      className: 'neon-green-card',
      onClick: () => setIsModalOpen(true),
      disabled: false
    }
  ];

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
          <NeonLogo size="md" />
        </div>

        {/* Payment Summary */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white neon-text-glow">
            Choose Payment Method
          </h1>
          <p className="text-white/80">
            {name} • ৳{amount.toFixed(2)}
          </p>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {paymentMethods.map((method, index) => (
            <motion.button
              key={method.id}
              onClick={method.onClick}
              disabled={method.disabled}
              className={`
                w-full p-6 rounded-xl transition-all duration-300 
                ${method.className}
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-[1.02] active:scale-[0.98]
                flex items-center space-x-4
              `}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: method.disabled ? 1 : 1.02 }}
              whileTap={{ scale: method.disabled ? 1 : 0.98 }}
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                {method.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-white text-lg">
                  {method.name}
                </h3>
                {method.id === 'bkash' && isProcessing && (
                  <p className="text-sm text-white/60">Processing...</p>
                )}
              </div>
              {method.disabled && isProcessing && method.id === 'bkash' && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="w-full py-3 text-white/60 hover:text-white transition-colors duration-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          ← Back to form
        </motion.button>
      </motion.div>

      {/* Payment Method Modal */}
      <PaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};