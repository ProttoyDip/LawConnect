import { ReactNode } from 'react'

export function FormLabel({ className = '', children }: {
  className?: string
  children: ReactNode
}) {
  return (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`}>
      {children}
    </label>
  )
}

export function FormInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${className}`}
      {...props}
    />
  )
}

export function FormSelect({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${className}`}
      {...props}
    />
  )
}

export function FormTextarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-vertical ${className}`}
      {...props}
    />
  )
}

export function FormGroup({ className = '', children }: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}
