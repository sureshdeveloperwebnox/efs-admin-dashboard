// components/MultiTextInput.tsx

import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
export interface MultiTextInputProps {
  label?: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  error?: boolean;
  maxItems?: number;
  sx?: any;
}

const MultiTextInput: React.FC<MultiTextInputProps> = ({
  label = 'Enter items',
  placeholder = 'Press Enter to add',
  values,
  onChange,
  disabled = false,
  fullWidth = true,
  helperText,
  error = false,
  maxItems,
  sx,
}) => {
  const handleChange = (_: any, newValue: string[]) => {
    if (maxItems && newValue.length > maxItems) return;
    onChange(newValue);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={values}
      disabled={disabled}
      onChange={handleChange}
      filterSelectedOptions
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={option}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          fullWidth={fullWidth}
          helperText={helperText}
          sx={sx}
          error={error}
        />
      )}
    />
  );
};

export default MultiTextInput;
