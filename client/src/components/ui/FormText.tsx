import { ReactNode } from 'react'

interface FormTextProps {
  className?: string
  children: ReactNode
  muted?: boolean
}

export function FormText({ className = '', muted = false, children }: FormTextProps) {
  return (
    <p className={`${muted ? 'text-gray-500 dark:text-gray-400' : ''} text-xs ${className}`}>
      {children}
    </p>
  )
}
