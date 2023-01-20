import React from 'react';

import { Grid } from '@mui/material';

import BalanceCard from './BalanceCard';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'store';

const Credit = () => {
    const { user } = useSelector((state) => state.user);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <BalanceCard isLoading={false} balance={user?.account?.balance ? user?.account?.balance : 0} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Credit;
