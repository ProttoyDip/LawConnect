import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export default function GlassCard({ 
  children, 
  className = '', 
  hoverEffect = true,
  delay = 0 
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: 'easeOut'
      }}
      whileHover={hoverEffect ? { 
        y: -8, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transition: { duration: 0.3 }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}
