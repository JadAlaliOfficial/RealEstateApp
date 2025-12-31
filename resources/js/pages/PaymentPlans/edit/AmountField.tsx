import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface Props {
    amount: number;
    originalPaidAmount: number;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AmountField({ amount, originalPaidAmount, error, onChange }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
            <div className="mb-2">
                <Label htmlFor="amount" className="text-base font-semibold">
                    Total Amount *
                </Label>
            </div>
            <Input
                id="amount"
                type="number"
                step="0.01"
                min={originalPaidAmount}
                value={amount || ''}
                onChange={onChange}
                placeholder="0.00"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
                Minimum amount: ${Number(originalPaidAmount || 0).toFixed(2)} (already paid)
            </p>
        </div>
    );
}
