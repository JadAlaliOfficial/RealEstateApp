import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ServiceTypeFieldProps {
    value: string[];
    onChange: (serviceTypes: string[]) => void;
    error?: string;
}

const DEFAULT_SERVICE_TYPE_OPTIONS = [
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Appliances', label: 'Appliances' },
    { value: 'Pest control', label: 'Pest control' },
    { value: 'HVAC Repairs', label: 'HVAC Repairs' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Landscaping', label: 'Landscaping' },
    { value: 'Lock Smith', label: 'Lock Smith' },
    { value: 'Garage door', label: 'Garage door' },
    { value: 'Towing', label: 'Towing' },
    { value: 'Cleaning', label: 'Cleaning' }
];

const ServiceTypeField: React.FC<ServiceTypeFieldProps> = ({ value, onChange, error }) => {
    const [selectedType, setSelectedType] = useState('');
    const [customType, setCustomType] = useState('');
    const [useCustom, setUseCustom] = useState(false);

    const handleAddServiceType = () => {
        const typeToAdd = useCustom ? customType.trim() : selectedType;

        if (typeToAdd && !value.includes(typeToAdd)) {
            onChange([...value, typeToAdd]);
            setSelectedType('');
            setCustomType('');
            setUseCustom(false);
        }
    };

    const handleRemoveServiceType = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const availableOptions = DEFAULT_SERVICE_TYPE_OPTIONS.filter(
        option => !value.includes(option.value)
    );

    const isAddDisabled = useCustom ? !customType.trim() : !selectedType;

    return (
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
            <div className="mb-2">
                <Label className="text-base font-semibold">
                    Service Type
                </Label>
            </div>

            {/* Toggle between select and custom input */}
            <div className="mb-4 flex gap-2">
                {useCustom ? (
                    <Input
                        type="text"
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        placeholder="Enter new service type"
                        className="flex-1"
                    />
                ) : (
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a service type" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Toggle button */}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setUseCustom(!useCustom);
                        setSelectedType('');
                        setCustomType('');
                    }}
                    title={useCustom ? 'Select from existing' : 'Create new'}
                >
                    {useCustom ? 'Select' : 'Custom'}
                </Button>

                {/* Add button */}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddServiceType}
                    disabled={isAddDisabled}
                    className="flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>

            {/* Display list of selected service types */}
            {value.length > 0 && (
                <div className="mb-3 space-y-2">
                    {value.map((serviceType, index) => (
                        <div key={index} className="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
                            <span className="text-sm text-gray-700">{serviceType}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveServiceType(index)}
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

export default ServiceTypeField;
