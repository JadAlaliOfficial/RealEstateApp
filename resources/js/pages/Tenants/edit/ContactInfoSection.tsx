import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoSectionProps {
    loginEmail: string;
    alternateEmail: string;
    mobile: string;
    emergencyPhone: string;
    onLoginEmailChange: (value: string) => void;
    onAlternateEmailChange: (value: string) => void;
    onMobileChange: (value: string) => void;
    onEmergencyPhoneChange: (value: string) => void;
    errors: Record<string, string>;
}

export default function ContactInfoSection({
    loginEmail,
    alternateEmail,
    mobile,
    emergencyPhone,
    onLoginEmailChange,
    onAlternateEmailChange,
    onMobileChange,
    onEmergencyPhoneChange,
    errors,
}: ContactInfoSectionProps) {
    return (
        <>
            {/* Login Email */}
            <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="login_email" className="text-base font-semibold">
                        Login Email
                    </Label>
                </div>
                <Input
                    id="login_email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => onLoginEmailChange(e.target.value)}
                    placeholder="Enter login email address"
                />
                {errors.login_email && <p className="mt-1 text-sm text-red-600">{errors.login_email}</p>}
            </div>

            {/* Alternate Email */}
            <div className="rounded-lg border-l-4 border-l-sky-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="alternate_email" className="text-base font-semibold">
                        Alternate Email
                    </Label>
                </div>
                <Input
                    id="alternate_email"
                    type="email"
                    value={alternateEmail}
                    onChange={(e) => onAlternateEmailChange(e.target.value)}
                    placeholder="Enter alternate email address"
                />
                {errors.alternate_email && <p className="mt-1 text-sm text-red-600">{errors.alternate_email}</p>}
            </div>

            {/* Mobile Phone */}
            <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="mobile" className="text-base font-semibold">
                        Mobile Phone
                    </Label>
                </div>
                <Input
                    id="mobile"
                    value={mobile}
                    onChange={(e) => onMobileChange(e.target.value)}
                    placeholder="Enter mobile phone number"
                />
                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            {/* Emergency Phone */}
            <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="emergency_phone" className="text-base font-semibold">
                        Emergency Phone
                    </Label>
                </div>
                <Input
                    id="emergency_phone"
                    value={emergencyPhone}
                    onChange={(e) => onEmergencyPhoneChange(e.target.value)}
                    placeholder="Enter emergency phone number"
                />
                {errors.emergency_phone && <p className="mt-1 text-sm text-red-600">{errors.emergency_phone}</p>}
            </div>
        </>
    );
}
