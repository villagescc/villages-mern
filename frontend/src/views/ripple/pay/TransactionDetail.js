import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material ui
import { Grid, Tabs, Tab, Box } from '@mui/material';

// components
import PaymentPath from './PaymentPath';
import TransactionDescription from './TransactionDescription';

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`product-details-tabpanel-${index}`}
            aria-labelledby={`product-details-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

const a11yProps = (index) => {
    return {
        id: `product-details-tab-${index}`,
        'aria-controls': `product-details-tabpanel-${index}`
    };
};

const TransactionDetail = ({ transaction }) => {
    const { paylogs, ...trxInfo } = transaction;

    const [tab, setTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <Tabs value={tab} indicatorColor="primary" onChange={handleTabChange} variant="scrollable">
                    <Tab component={Link} to="#" label="Description" {...a11yProps(0)} />
                    <Tab component={Link} to="#" label="Payment Path" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    <TransactionDescription transaction={trxInfo} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <PaymentPath paylogs={paylogs} />
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default TransactionDetail;
