import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';

// project imports
import FollowingCard from 'ui-component/cards/FollowingCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons';

// ==============================|| SOCIAL PROFILE - FRIENDS ||============================== //

const Followings = ({ user }) => {
    const theme = useTheme();

    let friendsResult = <></>;
    if (user.followings.length) {
        friendsResult = user.followings.map((following, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FollowingCard {...following} />
            </Grid>
        ));
    }

    const [search, setSearch] = React.useState('');
    const handleSearch = async (event) => {
        const newString = event?.target.value;
        setSearch(newString);
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">
                            Followings{' '}
                            <Typography variant="h3" component="span" sx={{ color: theme.palette.grey[300], fontWeight: 500 }}>
                                ({user.followings.length})
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <OutlinedInput
                            size="small"
                            id="input-search-user-profile"
                            placeholder="Search Followings"
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
                {friendsResult}
            </Grid>
        </MainCard>
    );
};

export default Followings;
