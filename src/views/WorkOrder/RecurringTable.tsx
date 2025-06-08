import { Box } from '@mui/material';
import { Stack, Typography } from '@mui/material';
import { maxHeight } from '@mui/system';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react'

const RecurringTable = (props: any) => {

    const [rows, setRows] = useState<[]>([]);

    useEffect(() => {
        setRows(props.dates);
    })

    return (
        <Box sx={{maxHeight: "100vh", overflow: "auto"}}>
            <MainCard>
                <Stack marginY={"20px"}>
                    <Typography variant="h3">Generated Dates</Typography>
                </Stack>
                <Box>
                    {
                        rows.length === 0 ? <NoDataLottieComponent /> :
                            rows.map((row: any, idx: number) => (
                                <Box key={idx}>
                                    <Typography variant="h6">{row}</Typography>
                                </Box>
                            ))
                    }
                </Box>
            </MainCard>
        </Box>
    )
}

export default RecurringTable;