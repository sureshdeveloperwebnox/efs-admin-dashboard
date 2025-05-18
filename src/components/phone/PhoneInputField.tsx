import React, { useState } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

type PhoneInputFieldProps = {
  value: string;
  onChange: (phone: string) => void;
  placeholder?: string;
  defaultCountry?: string; // Expanded to accept any country code
  label?: string;
  disabled?: boolean;
  required?: boolean;
};

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  placeholder = 'Enter your phone number',
  defaultCountry = 'us', // Lowercase for react-phone-input-2
  label = 'Phone Number',
  disabled = false,
  required = false,
}) => {
  const [error, setError] = useState<string>('');

  const handlePhoneChange = (phone: string) => {
    // Always ensure the phone number starts with '+'
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    onChange(formattedPhone);

    try {
      const phoneNumber = parsePhoneNumberFromString(formattedPhone);
      
      if (!phoneNumber || !phoneNumber.isValid()) {
        setError('Please enter a valid phone number');
      } else {
        setError('');
      }
    } catch {
      setError('Please enter a valid phone number');
    }
  };

  return (
    <div >
      {label && (
        <label 
          htmlFor="phone-input" 
          style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '150',
            fontSize: '14px'
          }}
        >
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </label>
      )}

      <ReactPhoneInput
        inputProps={{ 
          name: 'phone', 
          id: 'phone-input',
          required,
          disabled,
          style: {
            height: '40px',
            width: '100%',
            fontSize: '16px',
            // paddingLeft: '48px'
          } 
        }}
        inputStyle={{
          width: '100%'
        }}
        buttonStyle={{
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
          borderRight: '1px solid #e0e0e0'
        }}
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        country={defaultCountry.toLowerCase()}
        enableSearch
        disableSearchIcon
        disableDropdown={disabled}
        countryCodeEditable={false}
        specialLabel=""
      />

      {error && (
        <div style={{ 
          color: '#d32f2f', 
          marginTop: '4px', 
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default PhoneInputField;