import { ReactNode, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'


interface TableProps {
  children: ReactNode
  className?: string
  responsive?: boolean
}

export function Table({ className = '', responsive = true, children }: TableProps) {
  return (
    <div className={`w-full ${responsive ? 'overflow-x-auto rounded-lg border' : ''}`}>
      <table className={`w-full text-sm ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-gray-50 dark:bg-slate-700 [&_tr]:border-b ${className}`} {...props} />
  )
}

export function TableBody({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`[&_tr:last-child]:border-b-0 ${className}`} {...props} />
  )
}


export function TableRow({ className = '', initial, animate, transition, ...props }: React.HTMLAttributes<HTMLTableRowElement> & {
  initial?: { opacity: number; x: number };
  animate?: { opacity: number; x: number };
  transition?: { delay: number };
}) {
  return (
    <motion.tr
      initial={initial}
      animate={animate}
      transition={transition}
      className={`border-b border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${className}`}
      {...props}
    />
  )
}


export function TableHead({ className = '', ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-semibold text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}

export function TableCell({ className = '', ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-4 align-middle text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}


