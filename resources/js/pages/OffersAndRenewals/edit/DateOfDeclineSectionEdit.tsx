import DatePickerField from './DatePickerField';

interface DateOfDeclineSectionEditProps {
    value: string | null;
    onChange: (date: string | null) => void;
    error?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DateOfDeclineSectionEdit({
    value,
    onChange,
    error,
    isOpen,
    onOpenChange,
}: DateOfDeclineSectionEditProps) {
    return (
        <DatePickerField
            label="Date of Decline"
            value={value}
            onChange={onChange}
            error={error}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            borderColor="border-l-red-500"
            required
        />
    );
}