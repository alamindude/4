import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Copy, Home } from 'lucide-react';
import { NeonLogo } from '@/components/NeonLogo';
import { usePaymentStore } from '@/store/paymentStore';
import { toast } from '@/hooks/use-toast';

export const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { name, amount, invoiceId, reset } = usePaymentStore();
  const [currentInvoiceId, setCurrentInvoiceId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [currentAmount, setCurrentAmount] = useState(0);

  useEffect(() => {
    const urlInvoiceId = searchParams.get('invoice');
    
    // Try to get data from store first
    if (invoiceId && name && amount > 0) {
      setCurrentInvoiceId(invoiceId);
      setCurrentName(name);
      setCurrentAmount(amount);
      return;
    }

    // Try to get data from localStorage
    const savedData = localStorage.getItem('payment_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.name && parsed.amount > 0 && parsed.invoiceId) {
          setCurrentInvoiceId(parsed.invoiceId);
          setCurrentName(parsed.name);
          setCurrentAmount(parsed.amount);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }

    // If URL has invoice but no data, use fallback
    if (urlInvoiceId) {
      setCurrentInvoiceId(urlInvoiceId);
      setCurrentName('User');
      setCurrentAmount(0);
      return;
    }

    // No valid data found, redirect to home
    toast({
      title: "No payment data found",
      description: "Redirecting to home page...",
      variant: "destructive"
    });
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [searchParams, invoiceId, name, amount, navigate]);

  const copyInvoiceId = async () => {
    try {
      await navigator.clipboard.writeText(currentInvoiceId);
      toast({
        title: "Copied!",
        description: "Invoice ID copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentInvoiceId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Copied!",
        description: "Invoice ID copied to clipboard",
      });
    }
  };

  const handleNewPayment = () => {
    reset();
    localStorage.removeItem('payment_data');
    navigate('/');
  };

  if (!currentInvoiceId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-20">
      <motion.div
        className="w-full max-w-md space-y-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Success Animation */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
        >
          <div className="relative">
            <NeonLogo size="lg" />
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              <CheckCircle className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_hsl(120_100%_50%)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-white neon-text-glow">
            Thank For Payment
          </h1>
          {currentName !== 'User' && (
            <p className="text-lg text-white/80">
              {currentName}
            </p>
          )}
          {currentAmount > 0 && (
            <p className="text-xl text-green-400 font-semibold">
              ৳{currentAmount.toFixed(2)}
            </p>
          )}
        </motion.div>

        {/* Invoice ID */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-white">
            your Invoice Id
          </h2>
          
          <div className="relative">
            <div className="p-4 bg-card border-2 border-green-500 rounded-xl neon-green-card">
              <p className="text-green-400 font-mono text-lg font-bold tracking-wider">
                {currentInvoiceId}
              </p>
            </div>
            
            <button
              onClick={copyInvoiceId}
              className="absolute top-2 right-2 p-2 rounded-lg hover:bg-white/10 transition-colors group"
              title="Copy Invoice ID"
            >
              <Copy className="w-4 h-4 text-white/60 group-hover:text-white" />
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={handleNewPayment}
            className="w-full py-4 rounded-xl neon-pink-btn text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Make Another Payment</span>
          </button>
          
          <p className="text-sm text-white/60">
            Payment completed successfully. Thank you for using our service!
          </p>
        </motion.div>

        {/* Celebration Effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 1.2, duration: 2 }}
        >
          <div className="w-32 h-32 border-4 border-green-400/30 rounded-full animate-ping" />
        </motion.div>
      </motion.div>
    </div>
  );
};