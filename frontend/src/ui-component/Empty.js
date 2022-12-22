import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const Empty = () => {
  return (
    <Box
      style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 300, border: '1px dashed grey', borderRadius: 5 }}
    >
        <InboxIcon sx={{ fontSize: 100 }} color={'primary'} />
        <Typography variant={'h3'}> No Data </Typography>
    </Box>
  );
};

export default Empty;
