import React, { useState } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

type PhoneInputFieldProps = {
  value: string;
  onChange: (phone: string) => void; // only one argument expected
  placeholder?: string;
  defaultCountry?: 'US' | 'GB' | 'IN' | 'CA' | 'AU';
  label?: string;
};

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  placeholder = 'Enter your phone number',
  defaultCountry = 'US',
  label = 'Phone Number',
}) => {
  const [error, setError] = useState<string>('');

  // Internal handler to adapt multi-arg signature
  const handlePhoneChange = (
    phone: string,
    countryData: object,
    event: any,
    formattedValue: string
  ) => {
    onChange(phone); // pass only the phone to the parent

    try {
      const fullPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const phoneNumber = parsePhoneNumberFromString(fullPhone);

      if (!phoneNumber || !phoneNumber.isValid()) {
        setError('Invalid phone number');
      } else {
        setError('');
      }
    } catch {
      setError('Invalid phone number');
    }
  };

  return (
    <div>
      <label htmlFor="phone-input" style={{ display: 'block', marginBottom: '5px' }}>
        {label}
      </label>

      <ReactPhoneInput
        inputProps={{ name: 'phone', id: 'phone-input' }}
        value={value}
        onChange={handlePhoneChange} // wraps to match react-phone-input-2
        placeholder={placeholder}
        country={defaultCountry.toLowerCase()}
        enableSearch
      />

      {error && (
        <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PhoneInputField;
