import React from 'react';

// material-ui
import { Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';

// project imports
import FollowerCard from 'ui-component/cards/FollowerCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import Empty from '../../../../ui-component/Empty';

// ==============================|| SOCIAL PROFILE - FOLLOWERS ||============================== //

const Followers = ({ user }) => {
  const theme = useTheme();

  const [search, setSearch] = React.useState('');
  const handleSearch = async (event) => {
    const newString = event?.target.value;
    setSearch(newString);
  };

  let followersResult = (
    <Grid item container>
      <Empty />
    </Grid>
  );
  if (user?.followers?.length) {
    followersResult = user.followers.map((follower, index) => (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3} >
        <FollowerCard {...follower} />
      </Grid>
    ));
  }

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
          <Grid item>
            <Typography variant="h3">
              Trusted By{' '}
              <Typography variant="h3" component="span" sx={{ color: theme.palette.grey[300], fontWeight: 500 }}>
                ({user?.followers?.length})
              </Typography>
            </Typography>
          </Grid>
          <Grid item>
            <OutlinedInput
              size="small"
              id="input-search-user-profile"
              placeholder="Search Followers"
              value={search}
              onChange={handleSearch}
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="16px" />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      }
    >
      <Grid container direction="row" spacing={gridSpacing}>
        {followersResult}
      </Grid>
    </MainCard>
  );
};

export default Followers;
