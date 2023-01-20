import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Badge, Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import WatchLaterTwoToneIcon from '@mui/icons-material/WatchLaterTwoTone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import DefaultUserIcon from 'assets/images/auth/default.png';

// ===========================|| DATA WIDGET - USER ACTIVITY CARD ||=========================== //

const EndorsementList = ({ title, followings }) => {
    const theme = useTheme();

    const iconSX = {
        fontSize: '0.875rem',
        marginRight: 0.2,
        verticalAlign: 'sub'
    };

    return (
        <MainCard title={title} content={false}>
            <CardContent>
                <Grid container spacing={gridSpacing} alignItems="center">
                    {followings.map((following, index) => (
                        <Grid item xs={12} key={index}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar
                                            alt="image"
                                            src={
                                                following?.profile?.avatar
                                                    ? 'http://localhost:5000/upload/avatar/' + following?.profile?.avatar
                                                    : DefaultUserIcon
                                            }
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography align="left" component="div" variant="subtitle1">
                                        {following?.username}
                                    </Typography>
                                    <Typography align="left" component="div" variant="subtitle2">
                                        {following?.endorsement?.text ? following?.endorsement?.text?.slice(0, 100) + '...' : ''}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography align="left" variant="h5">
                                        {following?.endorsement?.weight} {'VH'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <Divider />
        </MainCard>
    );
};

EndorsementList.propTypes = {
    title: PropTypes.string
};

export default EndorsementList;
