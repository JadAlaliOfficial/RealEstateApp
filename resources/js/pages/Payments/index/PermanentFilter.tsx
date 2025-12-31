import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface PermanentFilterProps {
    value: string[];
    onChange: (value: string[]) => void;
}


const PERMANENT_OPTIONS = ['Yes', 'No'];


export default function PermanentFilter({ value, onChange }: PermanentFilterProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePermanent = (permanent: string) => {
        if (value.includes(permanent)) {
            onChange(value.filter(p => p !== permanent));
        } else {
            onChange([...value, permanent]);
        }
    };

    const selectedCount = value.length;
    const displayText = selectedCount === 0 ? 'Permanent' : `Permanent (${selectedCount})`;

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full justify-between"
            >
                <span>{displayText}</span>
                <ChevronDown className="h-4 w-4" />
            </Button>

            {showDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-input bg-popover shadow-lg">
                    {PERMANENT_OPTIONS.map((permanent) => (
                        <label key={permanent} className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value.includes(permanent)}
                                onChange={() => togglePermanent(permanent)}
                                className="mr-2 h-4 w-4 rounded border border-input"
                            />
                            <span className="text-sm">{permanent}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
