import { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'


interface TableProps {
  children: ReactNode
  className?: string
  responsive?: boolean
  striped?: boolean
  hover?: boolean
}

export function Table({ className = '', responsive = true, striped = false, hover = false, children }: TableProps) {
  const tableClasses = [
    'w-full text-sm',
    striped ? '[&_tbody_tr:nth-child(even)]:bg-gray-50 dark:[&_tbody_tr:nth-child(even)]:bg-slate-800/50' : '',
    hover ? '[&_tbody_tr:hover]:bg-gray-50 dark:[&_tbody_tr:hover]:bg-slate-800' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={`w-full ${responsive ? 'overflow-x-auto rounded-lg border' : ''}`}>
      <table className={tableClasses}>
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


export function TableRow({ className = '', ...props }: HTMLMotionProps<'tr'>) {
  return (
    <motion.tr
      className={`border-b border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${className}`}
      {...props}
    />
  )
}


export function TableHead({ className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-semibold text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}

export function TableCell({ className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-4 align-middle text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  )
}


