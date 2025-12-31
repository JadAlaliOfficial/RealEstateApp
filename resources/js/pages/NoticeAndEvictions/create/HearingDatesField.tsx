import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function HearingDatesField({ value, onChange, error }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="rounded-lg border-l-4 border-l-yellow-500 p-4">
            <div className="mb-2">
                <Label htmlFor="hearing_dates" className="text-base font-semibold">
                    Hearing Dates
                </Label>
            </div>
            <div className="relative">
                <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? format(parse(value, 'yyyy-MM-dd', new Date()), 'PPP') : 'Pick a date'}
                        </Button>
                    </PopoverTrigger>
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
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Clear hearing date"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
