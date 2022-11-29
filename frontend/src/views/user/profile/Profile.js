// material-ui
import { Avatar, Button, Grid, Stack, TextField, Typography, List, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, CardContent, Divider, Chip } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import DefaultAvatar from 'assets/images/auth/default.png';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import React from "react";

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = () => {
    const { user } = useAuth();

    return (
      <Grid container spacing={gridSpacing}>
          <Grid item sm={6} md={4}>
              <SubCard title="Profile Picture" contentSX={{ textAlign: 'center' }}>
                  <Grid container spacing={2}>
                      <Grid item xs={12}>
                          <Avatar alt="User 1" src={DefaultAvatar} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                      </Grid>
                      <Grid item xs={12}>
                          <Typography variant="subtitle2" align="center">
                              Upload/Change Your Profile Image
                          </Typography>
                      </Grid>
                      <Grid item xs={12}>
                          <AnimateButton>
                              <Button variant="contained" size="small">
                                  Upload Avatar
                              </Button>
                          </AnimateButton>
                      </Grid>
                      <Grid item xs={12}>
                          <List component="nav" aria-label="main mailbox folders">
                              <ListItemButton>
                                  <ListItemIcon>
                                      <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                  </ListItemIcon>
                                  <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                                  <ListItemSecondaryAction>
                                      <Typography variant="subtitle2" align="right">
                                          { user?.email }
                                      </Typography>
                                  </ListItemSecondaryAction>
                              </ListItemButton>
                              <Divider />
                              <ListItemButton>
                                  <ListItemIcon>
                                      <PersonIcon sx={{ fontSize: '1.3rem' }} />
                                  </ListItemIcon>
                                  <ListItemText primary={<Typography variant="subtitle1">Username</Typography>} />
                                  <ListItemSecondaryAction>
                                      <Typography variant="subtitle2" align="right">
                                          { user.username }
                                      </Typography>
                                  </ListItemSecondaryAction>
                              </ListItemButton>
                          </List>
                          <Grid container spacing={0}>
                              <Grid item xs={4}>
                                  <Typography align="center" variant="h3">
                                      37
                                  </Typography>
                                  <Typography align="center" variant="subtitle2">
                                      Mails
                                  </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                  <Typography align="center" variant="h3">
                                      2749
                                  </Typography>
                                  <Typography align="center" variant="subtitle2">
                                      Followers
                                  </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                  <Typography align="center" variant="h3">
                                      678
                                  </Typography>
                                  <Typography align="center" variant="subtitle2">
                                      Following
                                  </Typography>
                              </Grid>
                          </Grid>
                      </Grid>
                  </Grid>
              </SubCard>
          </Grid>
          <Grid item sm={6} md={8}>
              <SubCard title="Edit Account Details">
                  <Grid container spacing={gridSpacing}>
                      <Grid item xs={12} md={6}>
                          <TextField id="firstName" fullWidth label="First Name" defaultValue={user?.firstName} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <TextField id="lastName" fullWidth label="Last Name" defaultValue={user?.lastName} />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField id="job" fullWidth label="Job" defaultValue={user?.profile?.job} />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField id="location" fullWidth label="Location" defaultValue={user?.profile?.locationId} />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                            id="description"
                            fullWidth
                            multiline
                            rows={3}
                            value={user?.profile?.description}
                            placeholder={'Description'}
                          />
                      </Grid>

                      <Grid item xs={12}>
                          <Stack direction="row">
                              <AnimateButton>
                                  <Button variant="contained">Change Details</Button>
                              </AnimateButton>
                          </Stack>
                      </Grid>
                  </Grid>
              </SubCard>
          </Grid>
      </Grid>
    );
};

export default Profile;
