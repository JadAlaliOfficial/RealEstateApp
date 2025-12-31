import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoSectionProps {
    firstName: string;
    lastName: string;
    streetAddress: string;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onStreetAddressChange: (value: string) => void;
    errors: Record<string, string>;
}

export default function PersonalInfoSection({
    firstName,
    lastName,
    streetAddress,
    onFirstNameChange,
    onLastNameChange,
    onStreetAddressChange,
    errors,
}: PersonalInfoSectionProps) {
    return (
        <>
            {/* First Name */}
            <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="first_name" className="text-base font-semibold">
                        First Name *
                    </Label>
                </div>
                <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                    placeholder="Enter first name"
                />
                {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="last_name" className="text-base font-semibold">
                        Last Name *
                    </Label>
                </div>
                <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                    placeholder="Enter last name"
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
            </div>

            {/* Street Address */}
            <div className="rounded-lg border-l-4 border-l-slate-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="street_address_line" className="text-base font-semibold">
                        Street Address
                    </Label>
                </div>
                <Input
                    id="street_address_line"
                    value={streetAddress}
                    onChange={(e) => onStreetAddressChange(e.target.value)}
                    placeholder="Enter street address"
                />
                {errors.street_address_line && <p className="mt-1 text-sm text-red-600">{errors.street_address_line}</p>}
            </div>
        </>
    );
}
