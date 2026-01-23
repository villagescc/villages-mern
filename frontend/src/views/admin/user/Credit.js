import React, { useEffect, useState } from 'react';

import { Grid } from '@mui/material';

import BalanceCard from './BalanceCard';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'store';
import PaymentChart from './PaymentChart';
import DefaultUserIcon from 'assets/images/auth/default.png';
import { dispatch } from 'store';
import useAuth from 'hooks/useAuth';
import PaymentList from './PaymentList';

const Credit = () => {
    const { user } = useSelector((state) => state.user);

    // const [payout, setPayout] = useState([]);
    // const [payin, setPayin] = useState([]);

    // useEffect(() => {
    //     let payoutData = [],
    //         payinData = [],
    //         today = new Date();
    //     if (user.payments) {
    //         for (let i = 0; i < 31; i++) {
    //             let loopDate = new Date(today - 1000 * 60 * 60 * 24 * (30 - i));
    //             let amountsIn = user.payments
    //                 .filter((payment) => payment.recipient._id === user._id)
    //                 .filter(
    //                     (payment) =>
    //                         new Date(payment.createdAt).getYear() === loopDate.getYear() &&
    //                         new Date(payment.createdAt).getMonth() === loopDate.getMonth() &&
    //                         new Date(payment.createdAt).getDate() === loopDate.getDate()
    //                 )
    //                 .map((payment) => payment.amount);
    //             let amountsOut = user.payments
    //                 .filter((payment) => payment.payer._id === user._id)
    //                 .filter(
    //                     (payment) =>
    //                         new Date(payment.createdAt).getYear() === loopDate.getYear() &&
    //                         new Date(payment.createdAt).getMonth() === loopDate.getMonth() &&
    //                         new Date(payment.createdAt).getDate() === loopDate.getDate()
    //                 )
    //                 .map((payment) => payment.amount);
    //             payinData.push(amountsIn.reduce((accum, val) => accum + val, 0));
    //             payoutData.push(amountsOut.reduce((accum, val) => accum + val, 0));
    //         }
    //         setPayin(payinData);
    //         setPayout(payoutData);
    //     }
    // }, [user]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <BalanceCard isLoading={false} balance={user?.account?.balance ? user?.account?.balance : 0} />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        {/* <PaymentChart payout={payout} payin={payin} /> */}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <PaymentList title={'Payment Logs'} payments={user?.payments ? user?.payments : []} />
            </Grid>
        </Grid>
    );
};

export default Credit;
