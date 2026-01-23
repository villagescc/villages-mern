import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project imports
import Profile from './Profile';
import Trust from './Trust';
import Credit from './Credit';
import MainCard from 'ui-component/cards/MainCard';

// store
import { gridSpacing } from 'store/constant';
import { dispatch } from 'store';
import { getUserByID } from 'store/slices/user';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import FavoriteOutlined from '@mui/icons-material/FavoriteOutlined';
import PaymentOutlined from '@mui/icons-material/Payment';

// tabs panel
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    {
        label: 'Profile',
        icon: <AccountCircleTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Trust',
        icon: <FavoriteOutlined sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Payment',
        icon: <PaymentOutlined sx={{ fontSize: '1.3rem' }} />
    }
];

// ==============================|| PROFILE 1 ||============================== //

const Index = () => {
    const theme = useTheme();
    const { userId } = useParams();

    const [tab, setTab] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        dispatch(getUserByID(userId));
    }, []);

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Tabs
                        value={tab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleTabChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        sx={{
                            mb: 3,
                            '& a': {
                                minHeight: 'auto',
                                minWidth: 10,
                                py: 1.5,
                                px: 1,
                                mr: 2.25,
                                color: theme.palette.grey[600],
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            '& a.Mui-selected': {
                                color: theme.palette.primary.main
                            },
                            '& .MuiTabs-indicator': {
                                bottom: 2
                            },
                            '& a > svg': {
                                marginBottom: '0px !important',
                                mr: 1.25
                            }
                        }}
                    >
                        {tabsOption.map((tab, index) => (
                            <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <Profile />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <Trust />
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <Credit />
                    </TabPanel>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Index;
