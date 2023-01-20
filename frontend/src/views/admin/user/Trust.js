import React from 'react';

import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';

import { useSelector } from 'store';
import EndorsementList from './EndorsementList';

const Trust = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
                <EndorsementList title={'Trust to'} followings={user.followings || []} />
            </Grid>
            <Grid item xs={12} md={6}>
                <EndorsementList title={'Trust from'} followings={user.followers || []} />
            </Grid>
        </Grid>
    );
};

export default Trust;
