import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, {  useMemo, useState } from 'react';

interface VendorOption {
    id: number;
    vendor_name: string;
    city?: string;
}

interface VendorSectionProps {
    availableVendors: VendorOption[];
    selectedCity: string;
    vendorId: string;
    onVendorChange: (vendorId: string) => void;
    vendorRef: React.RefObject<HTMLButtonElement>;
    errors: Partial<Record<string, string>>; // Changed from Record<string, string>
    validationError: string;
}

export default function VendorSection({
    availableVendors,
    selectedCity,
    vendorId,
    onVendorChange,
    vendorRef,
    errors,
    validationError
}: VendorSectionProps) {
    const [open, setOpen] = useState(false);
    const selectedVendor = useMemo(
        () => availableVendors?.find((v) => v.id.toString() === vendorId),
        [availableVendors, vendorId]
    );

    return (
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
            <div className="mb-2">
                <Label htmlFor="vendor_name" className="text-base font-semibold">
                    Vendor Name *
                </Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={vendorRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!selectedCity}
                    >
                        {selectedVendor?.vendor_name || (selectedCity ? 'Select vendor' : 'Select a city first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search vendors..." />
                        <CommandEmpty>No vendors found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {availableVendors?.map((vendor) => (
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
                                                vendorId === vendor.id.toString() ? 'opacity-100' : 'opacity-0'
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
            
            {errors.vendor_id && <p className="mt-1 text-sm text-red-600">{errors.vendor_id}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
