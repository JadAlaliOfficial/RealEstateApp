import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup } from '@/components/ui/radioGroup';
import { format, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

interface Props {
    insurance: string;
    insuranceExpirationDate: string;
    calendarOpen: boolean;
    onInsuranceChange: (value: string) => void;
    onInsuranceExpirationDateChange: (value: string) => void;
    onCalendarOpenChange: (open: boolean) => void;
    errors: {
        insurance?: string;
        insurance_expiration_date?: string;
    };
}

export default function InsuranceInformation({
    insurance,
    insuranceExpirationDate,
    calendarOpen,
    onInsuranceChange,
    onInsuranceExpirationDateChange,
    onCalendarOpenChange,
    errors
}: Props) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-violet-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="insurance" className="text-base font-semibold">
                        Insurance
                    </Label>
                </div>
                <RadioGroup
                    value={insurance}
                    onValueChange={onInsuranceChange}
                    name="insurance"
                    options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                    ]}
                />
                {errors.insurance && <p className="mt-1 text-sm text-red-600">{errors.insurance}</p>}
            </div>

            {insurance === 'Yes' && (
                <div className="rounded-lg border-l-4 border-l-rose-500 p-4">
                    <div className="mb-2">
                        <Label htmlFor="insurance_expiration_date" className="text-base font-semibold">
                            Insurance Expiration Date
                        </Label>
                    </div>
                    <Popover
                        open={calendarOpen}
                        onOpenChange={onCalendarOpenChange}
                        modal={false}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`relative w-full justify-start text-left font-normal pr-8 ${!insuranceExpirationDate && 'text-muted-foreground'}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {insuranceExpirationDate
                                    ? format(parse(insuranceExpirationDate, 'yyyy-MM-dd', new Date()), 'PPP')
                                    : 'Pick a date'}
                                <span
                                    className="absolute right-2 inline-flex h-4 w-4 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onInsuranceExpirationDateChange('');
                                        onCalendarOpenChange(false);
                                    }}
                                    aria-label="Clear insurance expiration date"
                                    title="Clear"
                                >
                                    <X className="h-4 w-4" />
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                            <Calendar
                                mode="single"
                                selected={insuranceExpirationDate ? parse(insuranceExpirationDate, 'yyyy-MM-dd', new Date()) : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        onInsuranceExpirationDateChange(format(date, 'yyyy-MM-dd'));
                                        onCalendarOpenChange(false);
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.insurance_expiration_date && <p className="mt-1 text-sm text-red-600">{errors.insurance_expiration_date}</p>}
                </div>
            )}
        </>
    );
}
