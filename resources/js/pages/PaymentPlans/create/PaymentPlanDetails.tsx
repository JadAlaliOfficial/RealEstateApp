import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface PaymentPlanDetailsProps {
    dates: string;
    amount: number;
    paid: number;
    errors: {
        dates?: string;
        amount?: string;
        paid?: string;
    };
    onDatesChange: (dates: string) => void;
    onAmountChange: (amount: number) => void;
    onPaidChange: (paid: number) => void;
    dateRef?: React.RefObject<HTMLButtonElement>;
}

export default function PaymentPlanDetails({
    dates,
    amount,
    paid,
    errors,
    onDatesChange,
    onAmountChange,
    onPaidChange,
    dateRef,
}: PaymentPlanDetailsProps) {
    const [calendarOpen, setCalendarOpen] = useState(false);

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            onDatesChange(format(date, 'yyyy-MM-dd'));
            setCalendarOpen(false);
        }
    };

    return (
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
            <div className="mb-4">
                <Label className="text-base font-semibold">
                    Payment Plan Details
                </Label>
            </div>
            
            <DateField
                dates={dates}
                error={errors.dates}
                calendarOpen={calendarOpen}
                onCalendarOpenChange={setCalendarOpen}
                onDateSelect={handleDateSelect}
                dateRef={dateRef}
            />

            <AmountField
                amount={amount}
                error={errors.amount}
                onAmountChange={onAmountChange}
            />

            <PaidField
                paid={paid}
                error={errors.paid}
                onPaidChange={onPaidChange}
            />
        </div>
    );
}

interface DateFieldProps {
    dates: string;
    error?: string;
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    onDateSelect: (date: Date | undefined) => void;
    dateRef?: React.RefObject<HTMLButtonElement>;
}

function DateField({ dates, error, calendarOpen, onCalendarOpenChange, onDateSelect, dateRef }: DateFieldProps) {
    return (
        <div className="mt-4">
            <Label htmlFor="dates" className="text-sm font-medium mb-2 block">
                Date *
            </Label>
            <Popover
                open={calendarOpen}
                onOpenChange={onCalendarOpenChange}
                modal={false}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={dateRef}
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!dates && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dates ? format(parse(dates, 'yyyy-MM-dd', new Date()), 'PPP') : 'Pick a date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={dates ? parse(dates, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={onDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

interface AmountFieldProps {
    amount: number;
    error?: string;
    onAmountChange: (amount: number) => void;
}

function AmountField({ amount, error, onAmountChange }: AmountFieldProps) {
    return (
        <div className="mt-4">
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                Amount *
            </Label>
            <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount || ''}
                onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

interface PaidFieldProps {
    paid: number;
    error?: string;
    onPaidChange: (paid: number) => void;
}

function PaidField({ paid, error, onPaidChange }: PaidFieldProps) {
    return (
        <div className="mt-4">
            <Label htmlFor="paid" className="text-sm font-medium mb-2 block">
                Paid
            </Label>
            <Input
                id="paid"
                type="number"
                step="0.01"
                min="0"
                value={paid ?? ''}
                onChange={(e) => onPaidChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
