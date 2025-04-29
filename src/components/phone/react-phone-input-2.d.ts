// src/types/react-phone-input-2.d.ts

declare module 'react-phone-input-2' {
    import * as React from 'react';
  
    export interface PhoneInputProps {
      international?: boolean;  // Make sure the 'international' prop is recognized
      defaultCountry?: string;  // Handle defaultCountry prop
      value: string;
      onChange: (phone: string) => void;
      placeholder?: string;
      disabled?: boolean;
      onlyCountries?: string[]; // Optional: Restrict to specific countries
      countryCodeEditable?: boolean; // Optional: Make country code editable
    }
  
    const ReactPhoneInput: React.FC<PhoneInputProps>;
  
    export default ReactPhoneInput;
  }
  