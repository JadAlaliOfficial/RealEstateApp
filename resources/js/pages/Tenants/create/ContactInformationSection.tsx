import { FormField } from './FormField';

interface ContactInformationSectionProps {
    loginEmail: string;
    alternateEmail: string;
    mobile: string;
    emergencyPhone: string;
    onLoginEmailChange: (value: string) => void;
    onAlternateEmailChange: (value: string) => void;
    onMobileChange: (value: string) => void;
    onEmergencyPhoneChange: (value: string) => void;
    loginEmailError?: string;
    alternateEmailError?: string;
    mobileError?: string;
    emergencyPhoneError?: string;
}

export function ContactInformationSection({
    loginEmail,
    alternateEmail,
    mobile,
    emergencyPhone,
    onLoginEmailChange,
    onAlternateEmailChange,
    onMobileChange,
    onEmergencyPhoneChange,
    loginEmailError,
    alternateEmailError,
    mobileError,
    emergencyPhoneError,
}: ContactInformationSectionProps) {
    return (
        <>
            <FormField
                id="login_email"
                label="Email"
                type="email"
                value={loginEmail}
                onChange={onLoginEmailChange}
                placeholder="Enter email address"
                borderColor="teal"
                error={loginEmailError}
            />

            <FormField
                id="alternate_email"
                label="Alternate Email"
                type="email"
                value={alternateEmail}
                onChange={onAlternateEmailChange}
                placeholder="Enter alternate email address"
                borderColor="sky"
                error={alternateEmailError}
            />

            <FormField
                id="mobile"
                label="Mobile Phone"
                value={mobile}
                onChange={onMobileChange}
                placeholder="Enter mobile phone number"
                borderColor="indigo"
                error={mobileError}
            />

            <FormField
                id="emergency_phone"
                label="Emergency Phone"
                value={emergencyPhone}
                onChange={onEmergencyPhoneChange}
                placeholder="Enter emergency phone number"
                borderColor="pink"
                error={emergencyPhoneError}
            />
        </>
    );
}
