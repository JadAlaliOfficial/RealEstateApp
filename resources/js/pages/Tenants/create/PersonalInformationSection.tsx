import React from 'react';
import { FormField } from './FormField';

interface PersonalInformationSectionProps {
    firstNameRef: React.RefObject<HTMLInputElement>;
    lastNameRef: React.RefObject<HTMLInputElement>;
    firstName: string;
    lastName: string;
    streetAddress: string;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onStreetAddressChange: (value: string) => void;
    firstNameError?: string;
    lastNameError?: string;
    streetAddressError?: string;
    firstNameValidationError?: string;
    lastNameValidationError?: string;
}

export function PersonalInformationSection({
    firstNameRef,
    lastNameRef,
    firstName,
    lastName,
    streetAddress,
    onFirstNameChange,
    onLastNameChange,
    onStreetAddressChange,
    firstNameError,
    lastNameError,
    streetAddressError,
    firstNameValidationError,
    lastNameValidationError,
}: PersonalInformationSectionProps) {
    return (
        <>
            <FormField
                id="first_name"
                label="First Name *"
                value={firstName}
                onChange={onFirstNameChange}
                placeholder="Enter first name"
                borderColor="orange"
                error={firstNameError}
                validationError={firstNameValidationError}
                ref={firstNameRef}
            />

            <FormField
                id="last_name"
                label="Last Name *"
                value={lastName}
                onChange={onLastNameChange}
                placeholder="Enter last name"
                borderColor="emerald"
                error={lastNameError}
                validationError={lastNameValidationError}
                ref={lastNameRef}
            />

            <FormField
                id="street_address_line"
                label="Street Address"
                value={streetAddress}
                onChange={onStreetAddressChange}
                placeholder="Enter street address"
                borderColor="slate"
                error={streetAddressError}
            />
        </>
    );
}
