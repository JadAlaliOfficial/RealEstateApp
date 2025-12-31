import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, {  useMemo, useState } from 'react';
import FormSection from './FormSection';

interface VendorOption {
    id: number;
    vendor_name: string;
    city?: string;
}

interface VendorSelectorProps {
    vendors: VendorOption[];
    selectedVendorId: string;
    onVendorChange: (vendorId: string) => void;
    vendorRef: React.RefObject<HTMLButtonElement>;
    disabled: boolean;
    error?: string;
    validationError?: string;
}

export default function VendorSelector({
    vendors,
    selectedVendorId,
    onVendorChange,
    vendorRef,
    disabled,
    error,
    validationError,
}: VendorSelectorProps) {
    const [open, setOpen] = useState(false);
    const selectedVendor = useMemo(
        () => vendors?.find((v) => v.id.toString() === selectedVendorId),
        [vendors, selectedVendorId]
    );

    return (
        <FormSection
            label="Vendor Name"
            required={true}
            borderColor="border-l-purple-500"
            error={error}
            validationError={validationError}
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={vendorRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedVendor?.vendor_name || (disabled ? 'Select a city first' : 'Select vendor')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search vendors..." />
                        <CommandEmpty>No vendors found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {vendors?.map((vendor) => (
                                    <CommandItem
                                        key={vendor.id}
                                        value={vendor.vendor_name}
                                        onSelect={() => {
                                            onVendorChange(vendor.id.toString());
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedVendorId === vendor.id.toString() ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {vendor.vendor_name}
                                        {vendor.city && (
                                            <span className="ml-2 text-xs text-muted-foreground">({vendor.city})</span>
                                        )}
                                    </CommandItem>
                                )) || []}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </FormSection>
    );
}
