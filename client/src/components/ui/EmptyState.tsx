import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title, 
  description, 
  icon, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'text-center py-16 px-8 rounded-2xl border-4 border-dashed border-slate-300/70 dark:border-white/30 bg-white/80 dark:bg-white/5 backdrop-blur-sm shadow-xl',
        className
      )}
    >
      <div className="mb-6 w-24 h-24 mx-auto bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 dark:from-indigo-400/20 dark:to-purple-400/20 rounded-2xl border-2 border-slate-300/70 dark:border-white/20 flex items-center justify-center shadow-2xl">
        {icon || (
          <svg className="w-12 h-12 text-slate-500 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      
      <motion.h3 
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
      >
        {title}
      </motion.h3>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-600 dark:text-white/70 mb-8 max-w-md mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

