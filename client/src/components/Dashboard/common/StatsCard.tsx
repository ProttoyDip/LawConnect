import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  delay?: number;
}

const colorClasses = {
  primary: 'stats-card-primary',
  success: 'stats-card-success',
  warning: 'stats-card-warning',
  danger: 'stats-card-danger',
  info: 'stats-card-info',
};

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      className={`stats-card ${colorClasses[color]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: delay * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="stats-card-icon">
        {icon}
      </div>
      <div className="stats-card-content">
        <div className="stats-card-value">{value}</div>
        <div className="stats-card-title">{title}</div>
      </div>
      <div className="stats-card-glow"></div>
    </motion.div>
  );
}
