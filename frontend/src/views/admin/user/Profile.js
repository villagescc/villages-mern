import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Button,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import Avatar from 'ui-component/extended/Avatar';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconEdit } from '@tabler/icons';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import DefaultUserIcon from 'assets/images/auth/default.png';

import { useSelector } from 'store';

// progress
function LinearProgressWithLabel({ value, ...others }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    mr: 1
                }}
            >
                <LinearProgress value={value} {...others} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number
};

// personal details table
/** names Don&apos;t look right */
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const avatarImage = user?.avatar ? `${SERVER_URL}/upload/avatar/` + user?.avatar : DefaultUserIcon;

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={4} xs={12}>
                <SubCard
                    title={
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar alt="User 1" src={avatarImage} />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography align="left" variant="subtitle1">
                                    {user?.username}
                                </Typography>
                                <Typography align="left" variant="subtitle2">
                                    {user?.job || <Chip label="No job" size="small" />}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    label={user?.isSuperuser ? 'Administrator' : user?.isStaff ? 'Staff' : 'User'}
                                    color="primary"
                                />
                            </Grid>
                        </Grid>
                    }
                >
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton>
                            <ListItemIcon>
                                <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {user?.email}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton>
                            <ListItemIcon>
                                <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Location</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {user?.profile?.placeId}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    </List>
                    <CardContent>
                        <Grid container spacing={0}>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h3">
                                    {user?.postings?.length ? user?.postings?.length : 0}
                                </Typography>
                                <Typography align="center" variant="subtitle2">
                                    Postings
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h3">
                                    {user?.followers?.length ? user?.followers?.length : 0}
                                </Typography>
                                <Typography align="center" variant="subtitle2">
                                    Followers
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography align="center" variant="h3">
                                    {user?.followings?.length ? user?.followings?.length : 0}
                                </Typography>
                                <Typography align="center" variant="subtitle2">
                                    Following
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </SubCard>
            </Grid>
            <Grid item lg={8} xs={12}>
                <Grid container direction="column" spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="User detail">
                            <Grid container direction="column" spacing={2}>
                                <Grid item xs={12}>
                                    <Typography align="left" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
                                        {user?.profile?.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Personal Details</Typography>
                                </Grid>
                                <Divider sx={{ pt: 1 }} />
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table
                                            sx={{
                                                '& td': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell variant="head">Full Name</TableCell>
                                                    <TableCell>:</TableCell>
                                                    <TableCell>
                                                        {user?.firstName + ' ' + user?.lastName ? (
                                                            user?.firstName + ' ' + user?.lastName
                                                        ) : (
                                                            <Chip size="small" label="empty" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell variant="head">Phone</TableCell>
                                                    <TableCell>:</TableCell>
                                                    <TableCell>
                                                        {user?.profile?.phone ? user?.profile?.phone : <Chip size="small" label="empty" />}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell variant="head">Website</TableCell>
                                                    <TableCell>:</TableCell>
                                                    <TableCell>
                                                        {user?.profile?.website ? (
                                                            user?.profile?.website
                                                        ) : (
                                                            <Chip size="small" label="empty" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">User Activity</Typography>
                                </Grid>
                                <Divider sx={{ pt: 1 }} />
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table
                                            sx={{
                                                '& td': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell variant="head">Signed Up</TableCell>
                                                    <TableCell>:</TableCell>
                                                    <TableCell>{user?.createdAt}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell variant="head">Recent use time</TableCell>
                                                    <TableCell>:</TableCell>
                                                    <TableCell>
                                                        {user.logs?.length > 0 ? (
                                                            user.logs?.reduce((a, b) => (a.createdAt > b.createdAt ? a : b))?.createdAt
                                                        ) : (
                                                            <Chip size="small" label="empty" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Profile;
