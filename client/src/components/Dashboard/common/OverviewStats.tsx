import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp 
} from 'lucide-react';
import { cn } from '../../../utils/cn';

interface Stat {
  value: number;
  label: string;
  change?: number;
  variant: 'primary' | 'warning' | 'success' | 'danger' | 'info';
  icon: React.ElementType;
}

interface OverviewStatsProps {
  stats: {
    totalReports: number;
    pending: number;
    resolved: number;
    recentActivity: number;
  };
}

const StatCard = ({ stat }: { stat: Stat }) => {
  const Icon = stat.icon;
  const variants = {
    primary: 'stats-card-primary',
    warning: 'stats-card-warning',
    success: 'stats-card-success',
    danger: 'stats-card-danger',
    info: 'stats-card-info',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={cn(
        'stats-card group relative overflow-hidden p-6 rounded-2xl border border-white/20 shadow-2xl',
        variants[stat.variant]
      )}
    >
      {/* Glow Effect */}
      <div className="stats-card-glow absolute inset-0" />
      
      {/* Icon */}
      <div className="stats-card-icon">
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Content */}
      <div className="stats-card-content">
        <motion.div
          className="stats-card-value"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {stat.value.toLocaleString()}
        </motion.div>
        <div className="stats-card-title">{stat.label}</div>
      </div>

      {/* Change Indicator */}
      {stat.change !== undefined && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'absolute bottom-4 right-4 text-sm font-semibold flex items-center gap-1',
            stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'
          )}
        >
          {stat.change >= 0 ? '↑' : '↓'}
          {Math.abs(stat.change)}%
        </motion.div>
      )}
    </motion.div>
  );
};

export default function OverviewStats({ stats }: OverviewStatsProps) {
  const statData: Stat[] = [
    {
      value: stats.totalReports,
      label: 'Total Reports',
      change: 12,
      variant: 'primary' as const,
      icon: FileText,
    },
    {
      value: stats.pending,
      label: 'Pending',
      change: 5,
      variant: 'warning' as const,
      icon: Clock,
    },
    {
      value: stats.resolved,
      label: 'Resolved',
      change: 18,
      variant: 'success' as const,
      icon: CheckCircle,
    },
    {
      value: stats.recentActivity,
      label: 'Recent Activity',
      change: 8,
      variant: 'info' as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statData.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

