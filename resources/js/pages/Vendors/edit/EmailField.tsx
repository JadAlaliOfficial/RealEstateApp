import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface EmailFieldProps {
    value: string[];
    onChange: (emails: string[]) => void;
    error?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({ value, onChange, error }) => {
    const [tempEmail, setTempEmail] = useState('');

    const handleAddEmail = () => {
        if (tempEmail.trim()) {
            onChange([...value, tempEmail.trim()]);
            setTempEmail('');
        }
    };

    const handleRemoveEmail = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    return (
        <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
            <div className="mb-2">
                <Label htmlFor="email" className="text-base font-semibold">
                    Email Address
                </Label>
            </div>

            {/* Input for adding new emails */}
            <div className="mb-4 flex gap-2">
                <Input
                    id="email"
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="vendor@example.com"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEmail}
                    disabled={!tempEmail.trim()}
                    className="flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>

            {/* Display list of added emails */}
            {value.length > 0 && (
                <div className="mb-3 space-y-2">
                    {value.map((email, index) => (
                        <div key={index} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
                            <span className="text-sm text-gray-700">{email}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveEmail(index)}
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

export default EmailField;
