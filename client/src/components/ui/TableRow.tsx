import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TableRowProps {
  children: ReactNode;
  className?: string;
  initial?: { opacity: number; x: number };
  animate?: { opacity: number; x: number };
  transition?: { delay: number };
}

export function TableRow({ children, initial, animate, transition, className = '' }: TableRowProps) {
  return (
    <motion.tr
      initial={initial}
      animate={animate}
      transition={transition}
      className={`border-b border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`}
    >
      {children}
    </motion.tr>
  );
}

