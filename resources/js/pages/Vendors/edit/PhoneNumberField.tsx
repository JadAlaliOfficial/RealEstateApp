import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface PhoneNumberFieldProps {
    value: string[];
    onChange: (phoneNumbers: string[]) => void;
    error?: string;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({ value, onChange, error }) => {
    const [tempPhone, setTempPhone] = useState('');

    const handleAddPhone = () => {
        if (tempPhone.trim()) {
            onChange([...value, tempPhone.trim()]);
            setTempPhone('');
        }
    };

    const handleRemovePhone = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPhone();
        }
    };

    return (
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
            <div className="mb-2">
                <Label htmlFor="number" className="text-base font-semibold">
                    Phone Number
                </Label>
            </div>
            
            {/* Input for adding new phone numbers */}
            <div className="mb-4 flex gap-2">
                <Input
                    id="number"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter phone number"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPhone}
                    disabled={!tempPhone.trim()}
                    className="flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>

            {/* Display list of added phone numbers */}
            {value.length > 0 && (
                <div className="mb-3 space-y-2">
                    {value.map((phone, index) => (
                        <div key={index} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
                            <span className="text-sm text-gray-700">{phone}</span>
                            <button
                                type="button"
                                onClick={() => handleRemovePhone(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default PhoneNumberField;
