import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';

interface DatePickerFieldProps {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
    error?: string;
    borderColor: string;
}

export function DatePickerField({ label, value, onChange, error, borderColor }: DatePickerFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
            <div className="mb-2">
                <Label htmlFor={label} className="text-base font-semibold">
                    {label}
                </Label>
            </div>
            <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
                <div className="relative">
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? format(parse(value, 'yyyy-MM-dd', new Date()), 'PPP') : 'Pick a date'}
                        </Button>
                    </PopoverTrigger>
                    {value && (
                        <button
                            type="button"
                            aria-label="Clear date"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onChange(null);
                                setIsOpen(false);
                            }}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => {
                            if (date) {
                                onChange(format(date, 'yyyy-MM-dd'));
                                setIsOpen(false);
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
