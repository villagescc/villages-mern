import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, Card, CardContent, CardMedia, Divider, Grid, Typography } from '@mui/material';

// project imports
import AvatarStatus from './AvatarStatus';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';

// assets
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

import images1 from 'assets/images/pages/img-catalog1.png';
import images2 from 'assets/images/pages/img-catalog2.png';
import images3 from 'assets/images/pages/img-catalog3.png';
import { SERVER_URL } from 'config';

import DefaultUserIcon from 'assets/images/auth/default.png';

// ==============================|| USER PROFILE / DETAILS ||============================== //

const UserDetails = ({ user }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={gridSpacing} sx={{ width: '100%', maxWidth: 300 }}>
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{
              textAlign: 'center',
              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Avatar
                  alt={user.name}
                  src={user?.user?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + user?.user?.profile?.avatar : DefaultUserIcon}
                  sx={{
                    m: '0 auto',
                    width: 130,
                    height: 130,
                    border: '1px solid',
                    borderColor: theme.palette.primary.main,
                    bgcolor: 'transparent'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <AvatarStatus status={user.state} />
                <Typography variant="caption" component="div">
                  {user?.state}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" component="div">
                  {user.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" component="div">
                  {user.role}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <SubCard
          sx={{
            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" component="div">
                Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <PinDropTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} />{' '}
                    {user?.user?.profile?.location ? user?.user?.profile?.location : <Chip label="No location" size="small" />}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <PhoneTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} />{' '}
                    {user?.user?.profile?.phone ? user?.user?.profile?.phone : <Chip label="No phone" size="small" />}
                  </Typography>
                </Grid>
                {/* <Grid item xs={12}>
                                    <Typography variant="body2">
                                        <EmailTwoToneIcon sx={{ verticalAlign: 'sub', fontSize: '1.125rem', mr: 0.625 }} />
                                        {user?.user?.email ? user?.user?.email : <Chip label="No email" size="small" />}
                                    </Typography>
                                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};

UserDetails.propTypes = {
  user: PropTypes.object
};

export default UserDetails;
