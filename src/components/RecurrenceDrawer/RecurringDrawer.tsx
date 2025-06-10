'use client';

import React, { useEffect, useState } from 'react';
import {
  Drawer,
  IconButton,
  Typography,
  Stack,
  AppBar,
  useMediaQuery,
  Divider,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Grid,
  FormControl
} from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { RRule, Frequency, Weekday } from 'rrule';
import toast from 'react-hot-toast';
import RecurringTable from './RecurringTable';

import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

type FormData = {
  orderstartdate: Date | null;
  orderstarttime: Date | null;
  recurrenceDuration: string;
  recurrenceUnit: string;
  frequency: string;
  monthsSelected: string[];
  daysOfMonthSelected: number[];
  daysOfWeekSelected: string[];
  repeatEvery: string;
};

type Job = {
  orderstartdate: Date;
  orderstarttime: Date;
};

interface RecurringDrawerProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  rows: Job[];
  setRows: React.Dispatch<React.SetStateAction<Job[]>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

// 👇 Optional: Define and use this wherever you initialize form
export const initialFormData: FormData = {
  orderstartdate: null,
  orderstarttime: null,
  recurrenceDuration: '',
  recurrenceUnit: '',
  frequency: '',
  monthsSelected: [],
  daysOfMonthSelected: [],
  daysOfWeekSelected: [],
  repeatEvery: ''
};

const RecurringDrawer: React.FC<RecurringDrawerProps> = React.memo(
  ({ open, setOpen, formData, setFormData, rows, setRows, jobs, setJobs }) => {
    const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    const frequencies =
      initialFormData.recurrenceUnit === 'Month(s)'
        ? ['Day', 'Week', 'Month']
        : formData.recurrenceUnit === 'Week(s)'
          ? ['Day', 'Week']
          : formData.recurrenceUnit === 'Day(s)'
            ? ['Day']
            : ['Day', 'Week', 'Month', 'Year'];

    const recurrenceUnits = ['Week(s)', 'Month(s)', 'Year(s)'];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleInputChange = (field: keyof FormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    };

    const handleMonthChange = (month: string) => {
      setFormData((prev) => ({
        ...prev,
        monthsSelected: prev.monthsSelected.includes(month)
          ? prev.monthsSelected.filter((m) => m !== month)
          : [...prev.monthsSelected, month]
      }));
    };

    const handleDayOfMonthChange = (day: number) => {
      setFormData((prev) => ({
        ...prev,
        daysOfMonthSelected: prev.daysOfMonthSelected.includes(day)
          ? prev.daysOfMonthSelected.filter((d) => d !== day)
          : [...prev.daysOfMonthSelected, day]
      }));
    };

    const handleWeekdayChange = (weekday: string) => {
      setFormData((prev) => ({
        ...prev,
        daysOfWeekSelected: prev.daysOfWeekSelected.includes(weekday)
          ? prev.daysOfWeekSelected.filter((d) => d !== weekday)
          : [...prev.daysOfWeekSelected, weekday]
      }));
    };

    const generateRecurrenceDates = () => {
      // console.log("FormData>>>>", formData);
      // return;
      const {
        orderstartdate,
        orderstarttime,
        recurrenceDuration,
        recurrenceUnit,
        repeatEvery,
        daysOfMonthSelected,
        daysOfWeekSelected,
        monthsSelected,
        frequency
      } = formData;

      if (!orderstartdate || !recurrenceDuration || !recurrenceUnit || !repeatEvery || !frequency || !orderstarttime) {
        toast.error('Please fill in all the fields.');
        return;
      }

      const weekdayMap: Record<string, Weekday> = {
        Sunday: RRule.SU,
        Monday: RRule.MO,
        Tuesday: RRule.TU,
        Wednesday: RRule.WE,
        Thursday: RRule.TH,
        Friday: RRule.FR,
        Saturday: RRule.SA
      };

      let freq: Frequency;
      switch (frequency) {
        case 'Day':
          freq = RRule.DAILY;
          break;
        case 'Week':
          freq = RRule.WEEKLY;
          break;
        case 'Month':
          freq = RRule.MONTHLY;
          break;
        case 'Year':
          freq = RRule.YEARLY;
          break;
        default:
          toast.error('Invalid frequency.');
          return;
      }

      const startDateObj = new Date(orderstartdate);

      const commonOptions = {
        freq,
        interval: parseInt(repeatEvery, 10),
        dtstart: new Date(
          startDateObj.getFullYear(),
          startDateObj.getMonth(),
          startDateObj.getDate(),
          17,
          0,
          0
        ),
        until: (() => {
          const baseYear = startDateObj.getFullYear();
          const baseMonth = startDateObj.getMonth();
          const baseDate = startDateObj.getDate();
          const duration = parseInt(recurrenceDuration, 10);

          switch (recurrenceUnit) {
            case 'Year(s)':
              return new Date(baseYear + duration, baseMonth, baseDate, 17, 0, 0);
            case 'Month(s)':
              return new Date(baseYear, baseMonth + duration, baseDate, 17, 0, 0);
            case 'Week(s)':
              return new Date(baseYear, baseMonth, baseDate + duration * 7, 17, 0, 0);
            case 'Day(s)':
              return new Date(baseYear, baseMonth, baseDate + duration, 17, 0, 0);
            default:
              return undefined;
          }
        })()
      };

      let rule: RRule;

      switch (recurrenceUnit) {
        case 'Year(s)':
          rule = new RRule({
            ...commonOptions,
            bymonth: monthsSelected.length
              ? monthsSelected.map((month) =>
                ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(month) + 1
              )
              : undefined,
            bymonthday: daysOfMonthSelected.length ? daysOfMonthSelected : undefined,
            byweekday: daysOfWeekSelected.length ? daysOfWeekSelected.map((day) => weekdayMap[day]) : undefined
          });
          break;

        case 'Month(s)':
          rule = new RRule({
            ...commonOptions,
            bymonthday: daysOfMonthSelected.length ? daysOfMonthSelected : undefined,
            byweekday: daysOfWeekSelected.length ? daysOfWeekSelected.map((day) => weekdayMap[day]) : undefined
          });
          break;

        case 'Week(s)':
          rule = new RRule({
            ...commonOptions,
            byweekday: daysOfWeekSelected.length ? daysOfWeekSelected.map((day) => weekdayMap[day]) : []
          });
          break;

        case 'Day(s)':
        default:
          rule = new RRule({
            ...commonOptions
          });
      }

      const finalData: Job[] = rule.all().map((item) => ({
        orderstartdate: new Date(item),
        orderstarttime: orderstarttime
      }));

      setJobs(finalData);
      setRows(finalData.slice(0, 50));
    };

    const getFirstDateOfNextMonth = () => {
      const currentDate = moment();
      return currentDate.add(1, 'months').startOf('month').toDate();
    };

    useEffect(() => {
      if (!formData.orderstartdate) {
        setFormData((prevData) => ({
          ...prevData,
          orderstartdate: getFirstDateOfNextMonth()
        }));
      }
    }, [formData.orderstartdate, setFormData]);

    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: isSmallScreen ? '100%' : '50%' } }}
      >
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: isSmallScreen ? '100%' : '50%' } }}>
          <div style={{ padding: '12px' }}>
            <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
              <Stack justifyContent="space-between" direction="row" alignItems="center">
                <Typography variant="h3" sx={{ mb: 1, color: 'black' }}>
                  Job Recurrence
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      orderstartdate: null,
                      orderstarttime: null,
                      recurrenceDuration: '',
                      recurrenceUnit: '',
                      frequency: '',
                      monthsSelected: [],
                      daysOfMonthSelected: [],
                      daysOfWeekSelected: [],
                      repeatEvery: ''
                    });
                    setOpen(false);
                    // setRows([]);
                  }}
                  size="large"
                >
                  <IoMdClose />
                </IconButton>
              </Stack>
            </AppBar>
          </div>
          <Divider />

          <Box p={3}>
            <Grid container spacing={2}>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <DatePicker
                      fullWidth
                      label="Start Date"
                      name="orderstartdate"
                      value={formData.orderstartdate ? dayjs(formData.orderstartdate) : null}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          orderstartdate: newValue
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!formData.orderstartdate} // Red outline if no date selected
                          helperText={!formData.orderstartdate ? 'Please select a start date' : ''}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <TimePicker
                      label=" Start Time"
                      value={formData.orderstarttime ? dayjs(formData.orderstarttime) : null}
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          orderstarttime: newValue
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!formData.orderstarttime} // Red outline if no time selected
                          helperText={!formData.orderstarttime ? 'Please select a start time' : ''}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </LocalizationProvider>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Total Job Duration"
                  value={formData.recurrenceDuration}
                  onChange={(e) => handleInputChange('recurrenceDuration', e.target.value)}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Unit"
                  value={formData.recurrenceUnit}
                  onChange={(e) => handleInputChange('recurrenceUnit', e.target.value)}
                  select
                  fullWidth
                >
                  {recurrenceUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Repeat Every"
                  type="number"
                  value={formData.repeatEvery}
                  onChange={(e) => handleInputChange('repeatEvery', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Choose Frequency"
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  select
                  fullWidth
                >
                  {frequencies.map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {formData.frequency === 'Year' && (
                <>
                  <Grid item xs={12}>
                    <div>
                      <b>Months:</b>
                    </div>
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => (
                      <FormControlLabel
                        key={month}
                        control={<Checkbox checked={formData.monthsSelected.includes(month)} onChange={() => handleMonthChange(month)} />}
                        label={month}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <b>Day of Month:</b>
                    </div>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <FormControlLabel
                        key={day}
                        control={<Checkbox checked={formData.daysOfMonthSelected.includes(day)} onChange={() => handleDayOfMonthChange(day)} />}
                        label={day}
                      />
                    ))}
                  </Grid>
                </>
              )}

              {formData.frequency === 'Month' && (
                <Grid item xs={12}>
                  <div>
                    <b>Day of Month:</b>
                  </div>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <FormControlLabel
                      key={day}
                      control={<Checkbox checked={formData.daysOfMonthSelected.includes(day)} onChange={() => handleDayOfMonthChange(day)} />}
                      label={day}
                    />
                  ))}
                </Grid>
              )}

              {formData.frequency === 'Week' && (
                <Grid item xs={12}>
                  <div>
                    <b>Days of the Week:</b>
                  </div>
                  {weekdays.map((day) => (
                    <FormControlLabel
                      key={day}
                      control={<Checkbox checked={formData.daysOfWeekSelected.includes(day)} onChange={() => handleWeekdayChange(day)} />}
                      label={day}
                    />
                  ))}
                </Grid>
              )}

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      orderstartdate: null,
                      orderstarttime: null,
                      recurrenceDuration: '',
                      recurrenceUnit: '',
                      frequency: '',
                      monthsSelected: [],
                      daysOfMonthSelected: [],
                      daysOfWeekSelected: [],
                      repeatEvery: ''
                    });

                    setRows([]);
                  }}
                  fullWidth
                  color="error"
                >
                  Clear All
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button variant="contained" color="secondary" onClick={generateRecurrenceDates} fullWidth>
                  Generate Dates
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" color="primary" onClick={() => setOpen(false)} fullWidth>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
          {rows?.length > 0 && <RecurringTable rows={rows} setRows={setRows} />}
        </Drawer>
      </Drawer>
    );
  }
);

export default RecurringDrawer;
