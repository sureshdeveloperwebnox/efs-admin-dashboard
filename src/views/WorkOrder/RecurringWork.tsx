"use client";

import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  SelectChangeEvent,
  Divider,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import NoDataLottieComponent from "components/CustomComponents/NoDataLottie";
import dayjs from "dayjs";
import React, { useState } from "react";

interface FormData {
  startDate: Date | null;
  startTime: Date | null;
  jobDuration: string;
  jobUnit: string;
  jobRepitition: string;
  jobFrequency: string;
}

const jobUnitArray = ["Week(s)", "Month(s)", "Year(s)"];
const jobFrequencyArray = ["Day", "Week", "Month", "Year"];

const initialFormData: FormData = {
  startDate: null,
  startTime: null,
  jobDuration: "",
  jobUnit: "",
  jobRepitition: "",
  jobFrequency: "",
};

const RecurringWork: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  const generateRecurrence = () => {
    const {
      startDate,
      startTime,
      jobDuration,
      jobUnit,
      jobRepitition,
      jobFrequency,
    } = formData;

    if (!startDate || !startTime) {
      console.error("Start date or time missing");
      return;
    }

    const start = dayjs(startDate)
      .hour(dayjs(startTime).hour())
      .minute(dayjs(startTime).minute())
      .second(0);

      console.log("start>>>>", start)

    const totalWeeks = jobUnit.toLowerCase().includes("week")
      ? parseInt(jobDuration)
      : 0;

    const repeatEvery = parseInt(jobRepitition);
    const unit = jobFrequency.toLowerCase();

    const dates: Date[] = [];

    for (let week = 0; week < totalWeeks; week++) {
      let weekStart = start.add(week, "week");

      for (let i = 0; i < 7; i += repeatEvery) {
        const nextDate = weekStart.add(i, "day");
        if (nextDate.isBefore(start)) continue;
        dates.push(nextDate.toDate());
      }
    }

    console.log("Generated Dates:", dates.length);
  };

  return (
    <>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newValue) =>
                    handleInputChange("startDate", newValue)
                  }
                  minDate={dayjs().toDate()}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TimePicker
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(newValue) =>
                    handleInputChange("startTime", newValue)
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Total Job Duration"
                type="number"
                fullWidth
                value={formData.jobDuration}
                onChange={(e) =>
                  handleInputChange("jobDuration", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="job-unit-label">Job Unit</InputLabel>
                <Select
                  labelId="job-unit-label"
                  value={formData.jobUnit}
                  label="Job Unit"
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleInputChange("jobUnit", e.target.value)
                  }
                >
                  <MenuItem value="" disabled>
                    Select Job Unit
                  </MenuItem>
                  {jobUnitArray.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Repeat Every"
                type="number"
                fullWidth
                value={formData.jobRepitition}
                onChange={(e) =>
                  handleInputChange("jobRepitition", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="job-frequency-label">Job Frequency</InputLabel>
                <Select
                  labelId="job-frequency-label"
                  value={formData.jobFrequency}
                  label="Job Frequency"
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleInputChange("jobFrequency", e.target.value)
                  }
                >
                  <MenuItem value="" disabled>
                    Select Frequency
                  </MenuItem>
                  {jobFrequencyArray.map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Button
                color="error"
                variant="contained"
                fullWidth
                onClick={handleClear}
              >
                Clear All
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                color="primary"
                variant="contained"
                onClick={generateRecurrence}
                fullWidth
              >
                Generate Dates
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
      <Divider />
      <Box>
        <Stack marginY={"20px"}>
          <Typography variant="h3">Generated Dates</Typography>
        </Stack>
        <NoDataLottieComponent />
      </Box>
    </>
  );
};

export default RecurringWork;
