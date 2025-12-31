import FormSection from './FormSection';
import DatePickerField from './DatePickerField';

interface MoveInDetailsSectionProps {
    moveInDate: string;
    onMoveInDateChange: (date: string) => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    error?: string;
}

export default function MoveInDetailsSection({
    moveInDate,
    onMoveInDateChange,
    isCalendarOpen,
    onCalendarOpenChange,
    error
}: MoveInDetailsSectionProps) {
    return (
        <FormSection 
            label="Move-In Date" 
            borderColor="border-l-orange-500" 
            error={error}
        >
            <DatePickerField
                value={moveInDate}
                onChange={onMoveInDateChange}
                isOpen={isCalendarOpen}
                onOpenChange={onCalendarOpenChange}
            />
        </FormSection>
    );
}
