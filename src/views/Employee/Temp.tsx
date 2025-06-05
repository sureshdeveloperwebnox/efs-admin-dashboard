import { Button, Drawer } from '@mui/material';
import { Box, Grid } from '@mui/system';
import React, { useState } from 'react';
import { MdOutlineWorkOutline, MdOutlineWorkHistory } from 'react-icons/md';

const Temp = () => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDrawerView, setRecurringDrawerView] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setRecurringDrawerView(newOpen);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant={!isRecurring ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
            onClick={() => setIsRecurring(false)}
            startIcon={<MdOutlineWorkOutline />}
          >
            One Time Work
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant={isRecurring ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
            onClick={() => {
              setIsRecurring(true);
              setRecurringDrawerView(true);
            }}
            startIcon={<MdOutlineWorkHistory />}
          >
            Recurring Work
          </Button>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={recurringDrawerView} onClose={toggleDrawer(false)}>
        <Box p={2} sx={{xs:"100%", lg:"50%"}}>
          <h1>Drawer Content</h1>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Temp;
