import { forwardRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface Props {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    error?: string;
    borderColor: 'blue' | 'green' | 'purple' | 'orange';
    disabled?: boolean;
}

const borderColorClasses = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    purple: 'border-l-purple-500',
    orange: 'border-l-orange-500'
};

export const SelectionField = forwardRef<HTMLButtonElement, Props>(({ 
    id,
    label,
    placeholder,
    value,
    options,
    onChange,
    error,
    borderColor,
    disabled = false
}, ref) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label || '';

    return (
        <div className={`rounded-lg border-l-4 ${borderColorClasses[borderColor]} p-4`}>
            <div className="mb-2">
                <Label htmlFor={id} className="text-base font-semibold">
                    {label} *
                </Label>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedLabel || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

SelectionField.displayName = 'SelectionField';
