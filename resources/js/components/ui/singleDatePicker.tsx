import { useState } from 'react'
import { ChevronDownIcon, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface SingleDatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  maxDate?: Date
  minDate?: Date
  className?: string
}

export const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  maxDate,
  minDate,
  className = '',
}) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false)
  }

  const getDisabledDates = () => {
    const disabledConditions: any = {}
    
    if (maxDate) {
      disabledConditions.after = maxDate
    }
    
    if (minDate) {
      disabledConditions.before = minDate
    }
    
    return Object.keys(disabledConditions).length > 0 ? disabledConditions : undefined
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {value ? formatDisplayDate(value) : placeholder}
            </span>
          </div>
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={getDisabledDates()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default SingleDatePicker