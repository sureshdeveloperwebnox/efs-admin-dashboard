// components/MultiTextInput.tsx
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { SxProps, Theme } from '@mui/material/styles';

export interface MultiTextInputProps {
  label?: string;
  placeholder?: string;
  values?: string[] | null;
  onChange: (values: string[]) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  error?: boolean;
  maxItems?: number;
  sx?: SxProps<Theme>;
}

const MultiTextInput: React.FC<MultiTextInputProps> = ({
  label = 'Enter Your List',
  placeholder = 'Type and press Enter to add',
  values = [],
  onChange,
  disabled = false,
  fullWidth = true,
  helperText,
  error = false,
  maxItems,
  sx,
}) => {
  // Ensure values is always an array and filter out any null/undefined values
  const normalizedValues = React.useMemo(() => {
    if (!values) return [];
    return Array.isArray(values) 
      ? values.filter(item => item != null).map(String) 
      : [String(values)];
  }, [values]);

  const handleChange = (_: any, newValue: (string | null)[]) => {
    // Filter out null/undefined and empty strings
    const filteredValues = newValue
      .filter(item => item != null && item.trim() !== '')
      .map(String);

    // Apply maxItems constraint if specified
    if (maxItems && filteredValues.length > maxItems) {
      return;
    }

    onChange(filteredValues);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={normalizedValues}
      disabled={disabled}
      onChange={handleChange}
      filterSelectedOptions
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={`${option}-${index}`} // More unique key
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