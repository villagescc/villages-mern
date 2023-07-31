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
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';

// assets
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonTwoTone from '@mui/icons-material/PersonTwoTone';

import React, { useState, useEffect } from 'react';

import { geocodeByPlaceId } from 'react-places-autocomplete';
import moment from 'moment';

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

const Profile = ({ user }) => {
  const rows = [
    createData('First Name', ':', user?.firstName),
    createData('Last Name', ':', user?.lastName),
    createData('Zip Code', ':', user?.profile?.zipCode ? user.profile?.zipCode : ''),
    createData('Phone', ':', user?.profile?.phoneNumber ? user.profile.phoneNumber : ''),
    // createData('Email', ':', user?.email),
    createData('Website', ':', user?.profile?.website ? user.profile.website : '')
  ];
  const [location, setLocation] = useState('');
  useEffect(() => {
    if (user && user.profile && user.profile.placeId) {
      geocodeByPlaceId(user.profile.placeId).then((results) => {
        setLocation(results[0].formatted_address);
      });
    }
  }, [user]);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item lg={4} xs={12}>
        <SubCard>
          <List component="nav" aria-label="main mailbox folders">
            <ListItemButton>
              <ListItemIcon>
                <PersonTwoTone sx={{ fontSize: '1.3rem' }} />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="subtitle1">Username</Typography>} />
              <ListItemSecondaryAction>
                <Typography variant="subtitle2" align="right">
                  {user.username}
                </Typography>
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider />
            {/* <ListItemButton>
              <ListItemIcon>
                <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
              <ListItemSecondaryAction>
                <Typography variant="subtitle2" align="right">
                  {user.email}
                </Typography>
              </ListItemSecondaryAction>
            </ListItemButton> */}
            <Divider />
            <ListItemButton>
              <ListItemIcon>
                <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="subtitle1">Location</Typography>} secondary={<Typography variant="subtitle2" align="left">
                {/*TODO convert to place description */}
                {user?.profile?.placeId ? location : <Chip label="No location" />}
              </Typography>} />
              {/* <ListItemSecondaryAction> */}
              {/* </ListItemSecondaryAction> */}
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemIcon>
                <AccessTimeIcon sx={{ fontSize: '1.3rem' }} />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="subtitle1">Recently active</Typography>} />
              <ListItemSecondaryAction>
                <Typography variant="subtitle2" align="right">
                  {moment(user?.profile?.recentlyActive).format('YYYY-MM-DD')}
                </Typography>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
          <CardContent>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Typography align="center" variant="h3">
                  {user?.followers?.length ? user?.followers?.length : 0}
                </Typography>
                <Typography align="center" variant="subtitle2">
                  Trusted By
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="center" variant="h3">
                  {user?.followings?.length ? user?.followings?.length : 0}
                </Typography>
                <Typography align="center" variant="subtitle2">
                  Trust Given
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </SubCard>
      </Grid>
      <Grid item lg={8} xs={12}>
        <Grid container direction="column" spacing={gridSpacing}>
          <Grid item xs={12}>
            <SubCard title="About me">
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">{user?.profile?.description}</Typography>
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
                        {rows.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell variant="head">{row.name}</TableCell>
                            <TableCell>{row.calories}</TableCell>
                            <TableCell>{row.fat}</TableCell>
                          </TableRow>
                        ))}
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
