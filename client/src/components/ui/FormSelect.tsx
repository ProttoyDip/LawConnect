import { ReactNode, useState, useRef, useEffect, createContext, useContext } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps {
  className?: string
  children: ReactNode
}

export function SelectTrigger({ className = '', children }: SelectTriggerProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within Select')

  const { open, setOpen } = context

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between w-full px-3 py-2 text-left bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within Select')

  const { value } = context

  return (
    <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
      {value || placeholder}
    </span>
  )
}

interface SelectContentProps {
  children: ReactNode
}

export function SelectContent({ children }: SelectContentProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within Select')

  const { open, setOpen } = context
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      {children}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: ReactNode
}

export function SelectItem({ value, children }: SelectItemProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within Select')

  const { value: selectedValue, onValueChange, setOpen } = context

  const isSelected = selectedValue === value

  return (
    <div
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
      }`}
    >
      {children}
    </div>
  )
}
