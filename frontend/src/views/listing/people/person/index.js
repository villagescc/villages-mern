import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, CardMedia, Chip, Grid, Tab, Tabs, Typography } from '@mui/material';

// project imports
import Profile from './Profile';
import Followers from './Followers';
import Followings from './Followings';
import Postings from './Postings';
import useConfig from 'hooks/useConfig';
import Avatar from 'ui-component/extended/Avatar';
import MainCard from 'ui-component/cards/MainCard';
import ImagePlaceholder from 'ui-component/cards/Skeleton/ImagePlaceholder';
import { gridSpacing } from 'store/constant';

// assets
import { IconFriends, IconInbox, IconPhoto, IconUserPlus, IconUsers } from '@tabler/icons';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import Cover from 'assets/images/profile/img-profile-bg1.jpg';
import { useDispatch, useSelector } from 'store';
import { getUser } from 'store/slices/user';
import DefaultUserIcon from '../../../../assets/images/auth/default.png';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 0
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const tabOptions = [
    {
        icon: <IconInbox stroke={1.5} size="17px" />,
        label: 'Profile'
    },
    {
        icon: <IconUsers stroke={1.5} size="17px" />,
        label: 'Followers'
    },
    {
        icon: <IconFriends stroke={1.5} size="17px" />,
        label: 'Followings'
    },
    {
        icon: <IconPhoto stroke={1.5} size="17px" />,
        label: 'Posting'
    }
];

// ==============================|| PUBLIC PROFILE ||============================== //

const SocialProfile = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { borderRadius } = useConfig();
    const { id, tab } = useParams();
    const { user } = useSelector((state) => state.user);
    const avatarImage = user?.avatar ? `${SERVER_URL}/upload/avatar/` + user?.avatar : DefaultUserIcon;

    let selectedTab = 0;
    switch (tab) {
        case 'follower':
            selectedTab = 1;
            break;
        case 'friends':
            selectedTab = 2;
            break;
        case 'gallery':
            selectedTab = 3;
            break;
        default:
            selectedTab = 0;
    }
    const [value, setValue] = React.useState(selectedTab);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
        dispatch(getUser(id));
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard
                    contentSX={{
                        p: 1.5,
                        paddingBottom: '0px !important',
                        [theme.breakpoints.down('lg')]: {
                            textAlign: 'center'
                        }
                    }}
                >
                    {isLoading ? (
                        <ImagePlaceholder
                            sx={{
                                borderRadius: `${borderRadius}px`,
                                overflow: 'hidden',
                                mb: 3,
                                height: { xs: 85, sm: 150, md: 260 }
                            }}
                        />
                    ) : (
                        <CardMedia component="img" image={Cover} sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden', mb: 3 }} />
                    )}
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={3}>
                            {isLoading ? (
                                <ImagePlaceholder
                                    sx={{
                                        margin: '-70px 0 0 auto',
                                        borderRadius: '16px',
                                        [theme.breakpoints.down('lg')]: {
                                            margin: '-70px auto 0'
                                        },
                                        [theme.breakpoints.down('md')]: {
                                            margin: '-60px auto 0'
                                        },
                                        width: { xs: 72, sm: 100, md: 140 },
                                        height: { xs: 72, sm: 100, md: 140 }
                                    }}
                                />
                            ) : (
                                <Avatar
                                    alt="User 1"
                                    src={avatarImage}
                                    sx={{
                                        margin: '-70px 0 0 auto',
                                        borderRadius: '16px',
                                        [theme.breakpoints.down('lg')]: {
                                            margin: '-70px auto 0'
                                        },
                                        [theme.breakpoints.down('md')]: {
                                            margin: '-60px auto 0'
                                        },
                                        width: { xs: 72, sm: 100, md: 140 },
                                        height: { xs: 72, sm: 100, md: 140 }
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="h5">
                                        {user?.firstName} {user?.lastName}
                                    </Typography>
                                    <Typography variant="subtitle2">{user?.job || <Chip label="No job" />}</Typography>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Grid
                                        container
                                        spacing={1}
                                        sx={{
                                            justifyContent: 'flex-end',
                                            [theme.breakpoints.down('lg')]: {
                                                justifyContent: 'center'
                                            }
                                        }}
                                    >
                                        <Grid item>
                                            <Button variant="contained" color={'secondary'} startIcon={<ChatIcon />}>
                                                Message
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                component={Link}
                                                to={`/ripple/trust/${id}`}
                                                variant="contained"
                                                color={'error'}
                                                startIcon={<FavoriteIcon />}
                                            >
                                                Trust
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                component={Link}
                                                to={`/ripple/pay/${id}`}
                                                color={'success'}
                                                variant="outlined"
                                                startIcon={<CurrencyExchangeIcon />}
                                            >
                                                Pay
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="flex-end">
                                <Tabs
                                    value={value}
                                    variant="scrollable"
                                    onChange={handleChange}
                                    sx={{
                                        marginTop: 2.5,
                                        '& .MuiTabs-flexContainer': {
                                            border: 'none'
                                        },
                                        '& a': {
                                            minHeight: 'auto',
                                            minWidth: 10,
                                            py: 1.5,
                                            px: 1,
                                            mr: 2.25,
                                            color: 'grey.700',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        '& a.Mui-selected': {
                                            color: 'primary.main'
                                        },
                                        '& a > svg': {
                                            marginBottom: '4px !important',
                                            mr: 1.25
                                        }
                                    }}
                                >
                                    {tabOptions.map((option, index) => (
                                        <Tab
                                            key={index}
                                            component={Link}
                                            to={'#'}
                                            icon={option.icon}
                                            label={option.label}
                                            {...a11yProps(index)}
                                        />
                                    ))}
                                </Tabs>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <TabPanel value={value} index={0}>
                    <Profile user={user} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Followers user={user} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Followings user={user} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <Postings user={user} />
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default SocialProfile;
