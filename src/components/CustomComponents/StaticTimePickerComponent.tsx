import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const StaticDateTimePickerComponent = ({
  label = 'Select Date & Time',
  value,
  onChange,
  disabled = false,
  ampm = true,
  views = ['year', 'day', 'hours', 'minutes'],
  minutesStep = 5,
  sx = {},
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        width: '100%', 
        '& .MuiPickerStaticWrapper-root': {
          minWidth: 'auto',
          width: '100%'
        },
        ...sx 
      }}>
        <StaticDateTimePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          ampm={ampm}
          views={views}
          minutesStep={minutesStep}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  height: '56px',
                },
              }}
            />
          )}
          {...props}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default StaticDateTimePickerComponent;