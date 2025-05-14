'use client'; // if using Next.js App Router

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface ReusableDatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  fullWidth?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const DatePickerComponent: React.FC<ReusableDatePickerProps> = ({
  label = 'Select date',
  value,
  onChange,
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
  fullWidth = true,
  required = false,
  error = false,
  helperText = ''
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            fullWidth,
            required,
            error,
            helperText
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
