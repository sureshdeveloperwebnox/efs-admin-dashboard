'use client';
import React from 'react';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const DateTimePickerComponent = React.forwardRef((props, ref) => {
  const {
    label,
    value,
    onChange,
    minDateTime,
    maxDateTime,
    disabled,
    required = false,
    error = false,
    helperText,
    sx,
    ...other
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={onChange}
        minDate={minDateTime}
        maxDate={maxDateTime}
        disabled={disabled}
        sx={{ width: '100%', ...sx }}
        slotProps={{
          textField: {
            fullWidth: true,
            required,
            error,
            helperText,
            sx: { width: '100%' }
          },
          popper: {
            sx: {
              // Optional: Adjust popper width if needed
              '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '400px' // You can adjust this as needed
              }
            }
          }
        }}
        {...other}
      />
    </LocalizationProvider>
  );
});

DateTimePickerComponent.displayName = 'DateTimePicker';

export default DateTimePickerComponent;