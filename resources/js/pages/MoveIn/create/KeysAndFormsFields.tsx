import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';
import { DatePickerField } from './DatePickerField';

interface KeysAndFormsFieldsProps {
    handledKeys: 'Yes' | 'No' | '';
    moveInFormSentDate: string;
    filledMoveInForm: 'Yes' | 'No' | '';
    dateOfMoveInFormFilled: string;
    onHandledKeysChange: (value: 'Yes' | 'No' | '') => void;
    onMoveInFormSentDateChange: (value: string) => void;
    onFilledMoveInFormChange: (value: 'Yes' | 'No' | '') => void;
    onDateOfMoveInFormFilledChange: (value: string) => void;
    errors: any;
}

export function KeysAndFormsFields({
    handledKeys,
    moveInFormSentDate,
    filledMoveInForm,
    dateOfMoveInFormFilled,
    onHandledKeysChange,
    onMoveInFormSentDateChange,
    onFilledMoveInFormChange,
    onDateOfMoveInFormFilledChange,
    errors,
}: KeysAndFormsFieldsProps) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="handled_keys" className="text-base font-semibold">
                        Handled Keys
                    </Label>
                </div>
                <RadioGroup
                    value={handledKeys}
                    onValueChange={(value) => onHandledKeysChange(value as 'Yes' | 'No' | '')}
                    name="handled_keys"
                    options={[
                        { value: 'No', label: 'No' },
                        { value: 'Yes', label: 'Yes' },
                    ]}
                />
                {errors.handled_keys && <p className="mt-1 text-sm text-red-600">{errors.handled_keys}</p>}
            </div>

            <DatePickerField
                label="Move-In Form Sent Date"
                value={moveInFormSentDate}
                onChange={onMoveInFormSentDateChange}
                error={errors.move_in_form_sent_date}
                borderColor="border-l-pink-500"
            />

            <div className="rounded-lg border-l-4 border-l-red-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="filled_move_in_form" className="text-base font-semibold">
                        Filled Move-In Form
                    </Label>
                </div>
                <RadioGroup
                    value={filledMoveInForm}
                    onValueChange={(value) => onFilledMoveInFormChange(value as 'Yes' | 'No' | '')}
                    name="filled_move_in_form"
                    options={[
                        { value: 'No', label: 'No' },
                        { value: 'Yes', label: 'Yes' },
                    ]}
                />
                {errors.filled_move_in_form && <p className="mt-1 text-sm text-red-600">{errors.filled_move_in_form}</p>}
            </div>
            {filledMoveInForm === 'Yes' && (
                <DatePickerField
                    label="Date of Move-In Form Filled"
                    value={dateOfMoveInFormFilled}
                    onChange={onDateOfMoveInFormFilledChange}
                    error={errors.date_of_move_in_form_filled}
                    borderColor="border-l-yellow-500"
                />
            )}
        </>
    );
}
