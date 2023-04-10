import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography, styled } from '@mui/material';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import PaymentHistory from './PaymentHistory';
import PaymentDialog from './PaymentDialog';

import Path from '../graph/path';

import MainCard from 'ui-component/cards/MainCard';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import GraphTwoToneIcon from '@mui/icons-material/AutoGraphRounded';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box
          sx={{
            py: 3
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// icon tab style
const AntTabs = styled(Tabs)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.primary.light,
  width: 140,
  borderRadius: '12px',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.secondary.main
  }
}));

// style constant
const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  color: theme.palette.secondary.main,
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    color: theme.palette.secondary.main,
    opacity: 1
  },
  '&.Mui-selected': {
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.secondary.main
  }
}));

const Index = () => {
  const { userId } = useParams();

  useEffect(() => {
    if (!!userId) setShowModal(true);
  }, [userId]);

  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard title="Payment History">
      <AntTabs theme={theme} value={value} onChange={handleChange} aria-label="ant example">
        <AntTab icon={<MenuTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />
        <AntTab icon={<GraphTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />
      </AntTabs>
      <TabPanel value={value} index={0}>
        <PaymentHistory handleCreateClick={handleCreateClick} count={count} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Path />
      </TabPanel>
      <PaymentDialog open={showModal} setOpen={setShowModal} recipientId={userId} setCount={setCount} />
    </MainCard>
  );
};

export default Index;
