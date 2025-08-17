import { motion } from 'framer-motion';

interface NeonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NeonLogo = ({ size = 'md', className = '' }: NeonLogoProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative w-full h-full">
        <motion.div
          className="w-full h-full rounded-full neon-ring-red pulse-glow flex items-center justify-center"
          animate={{ 
            boxShadow: [
              '0 0 20px hsl(0 100% 50%), 0 0 40px hsl(0 100% 50%), 0 0 60px hsl(0 100% 50%)',
              '0 0 30px hsl(0 100% 50%), 0 0 60px hsl(0 100% 50%), 0 0 90px hsl(0 100% 50%)',
              '0 0 20px hsl(0 100% 50%), 0 0 40px hsl(0 100% 50%), 0 0 60px hsl(0 100% 50%)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="text-red-500 font-bold text-2xl neon-text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            PAY
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};