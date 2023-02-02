import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import EmtpyBox from 'assets/images/icons/empty-box.png';

const Empty = () => {
    return (
        <Box
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300
            }}
        >
            <img src={EmtpyBox} style={{ width: 200, height: 200 }} />
            <Typography variant={'h1'} align="center">
                Sorry, No Data To Show
            </Typography>
            <Typography variant={'body'} align="center">
                There is not data what you need
            </Typography>{' '}
        </Box>
    );
};

export default Empty;
