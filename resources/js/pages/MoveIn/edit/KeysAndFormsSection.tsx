import FormSection from './FormSection';
import RadioGroupField from './RadioGroupField';
import DatePickerField from './DatePickerField';

interface KeysAndFormsSectionProps {
    handledKeys: 'Yes' | 'No' | '';
    onHandledKeysChange: (value: 'Yes' | 'No' | '') => void;
    moveInFormSentDate: string;
    onMoveInFormSentDateChange: (date: string) => void;
    filledMoveInForm: 'Yes' | 'No' | '';
    onFilledMoveInFormChange: (value: 'Yes' | 'No' | '') => void;
    dateOfMoveInFormFilled: string;
    onDateOfMoveInFormFilledChange: (date: string) => void;
    formSentCalendarOpen: boolean;
    onFormSentCalendarOpenChange: (open: boolean) => void;
    formFilledCalendarOpen: boolean;
    onFormFilledCalendarOpenChange: (open: boolean) => void;
    handledKeysError?: string;
    formSentDateError?: string;
    filledFormError?: string;
    formFilledDateError?: string;
}

export default function KeysAndFormsSection({
    handledKeys,
    onHandledKeysChange,
    moveInFormSentDate,
    onMoveInFormSentDateChange,
    filledMoveInForm,
    onFilledMoveInFormChange,
    dateOfMoveInFormFilled,
    onDateOfMoveInFormFilledChange,
    formSentCalendarOpen,
    onFormSentCalendarOpenChange,
    formFilledCalendarOpen,
    onFormFilledCalendarOpenChange,
    handledKeysError,
    formSentDateError,
    filledFormError,
    formFilledDateError
}: KeysAndFormsSectionProps) {
    return (
        <>
            <FormSection 
                label="Handled Keys" 
                borderColor="border-l-indigo-500" 
                error={handledKeysError}
            >
                <RadioGroupField
                    value={handledKeys}
                    onChange={onHandledKeysChange}
                    name="handled_keys"
                />
            </FormSection>

            <FormSection 
                label="Move-In Form Sent Date" 
                borderColor="border-l-pink-500" 
                error={formSentDateError}
            >
                <DatePickerField
                    value={moveInFormSentDate}
                    onChange={onMoveInFormSentDateChange}
                    isOpen={formSentCalendarOpen}
                    onOpenChange={onFormSentCalendarOpenChange}
                />
            </FormSection>

            <FormSection 
                label="Filled Move-In Form" 
                borderColor="border-l-red-500" 
                error={filledFormError}
            >
                <RadioGroupField
                    value={filledMoveInForm}
                    onChange={(value) => {
                        onFilledMoveInFormChange(value);
                    }}
                    name="filled_move_in_form"
                />
            </FormSection>
            {filledMoveInForm === 'Yes' && (
                <FormSection 
                    label="Date of Move-In Form Filled" 
                    borderColor="border-l-yellow-500" 
                    error={formFilledDateError}
                >
                    <DatePickerField
                        value={dateOfMoveInFormFilled}
                        onChange={onDateOfMoveInFormFilledChange}
                        isOpen={formFilledCalendarOpen}
                        onOpenChange={onFormFilledCalendarOpenChange}
                    />
                </FormSection>
            )}
        </>
    );
}
