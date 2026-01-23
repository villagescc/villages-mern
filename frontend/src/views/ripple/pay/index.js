import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

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
  const [urlSearchParams, setURLSearchParams] = useSearchParams();

  useEffect(() => {
    if (!!userId) setShowModal(true);
  }, [userId]);

  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState(null)

  const handleCreateClick = () => {
    setShowModal(true);
    setAmount(0)
    setMemo('')
    setUsername(null)
  };

  const theme = useTheme();
  const [memo, setMemo] = useState('');
  const [amount, setAmount] = useState(0);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // console.log(urlSearchParams.get("recipient"), urlSearchParams.get("amount"), urlSearchParams.get("comment"));
    // console.log(recipient, amount, comment);
    if (urlSearchParams.get("recipient") && urlSearchParams.get("amount") && urlSearchParams.get("comment")) {
      setShowModal(true)
      setUsername(urlSearchParams.get("recipient"))
      setAmount(urlSearchParams.get("amount"))
      setMemo(urlSearchParams.get("comment"))
    }
  }, [urlSearchParams])


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
        <Path graphFlag={true} />
      </TabPanel>
      <PaymentDialog open={showModal} setOpen={setShowModal} recipientId={userId ?? ''} setCount={setCount} amount={amount} setAmount={setAmount} memo={memo} setMemo={setMemo} username={username} setUsername={setUsername} />
    </MainCard>
  );
};

export default Index;
