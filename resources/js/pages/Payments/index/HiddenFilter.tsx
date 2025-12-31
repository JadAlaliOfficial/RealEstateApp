import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';


interface HiddenFilterProps {
    value: boolean;
    onChange: (value: boolean) => void;
}


export default function HiddenFilter({ value, onChange }: HiddenFilterProps) {
    return (
        <div className="flex gap-1">
            <Button
                variant={value ? 'outline' : 'default'}
                onClick={() => onChange(false)}
                className="flex-1"
                title="Show visible payments"
            >
                <Eye className="h-4 w-4 mr-1" />
                Visible
            </Button>
            <Button
                variant={value ? 'default' : 'outline'}
                onClick={() => onChange(true)}
                className="flex-1"
                title="Show hidden payments"
            >
                <EyeOff className="h-4 w-4 mr-1" />
                Hidden
            </Button>
        </div>
    );
}
