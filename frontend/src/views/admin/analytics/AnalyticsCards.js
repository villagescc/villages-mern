import React, { useEffect, useState } from 'react'
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import RevenueCard from 'ui-component/cards/BalanceCard';
import { getAnalytics } from 'store/slices/user';
import { dispatch } from 'store';
import { Card, CardContent, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import { AccountCircleTwoTone } from '@mui/icons-material';
// import EarningCard from 'ui-component/cards/Skeleton/EarningCard';

const AnalyticsCards = ({ period, location }) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false)
    const state = useSelector(state => state.user);
    const [analytics, setAnalytics] = useState({
        numberOfCreditLinesUsed: 0, numberOfTransactions: 0, totalCreditLinesUsed: 0, totalTransactions: 0,
        totalNewUsers: 0, totalCreditInCirculation: 0
    })
    // let latlong = ''
    useEffect(() => {
        // async function abc() {
        //     if (location?.placeId?.length !== 0 && typeof location?.placeId === 'string') {
        //         latlong = await geocodeByPlaceId(location.placeId);
        //     }
        // }
        // abc()
        // if (location?.placeId?.length !== 0 && typeof location?.placeId === 'string') {
        dispatch(getAnalytics(period, location))
        // }
    }, [period, location])

    // useEffect(() => {
    //     let latlong = ''
    //     geocodeByPlaceId(location.placeId).then(res => {
    //         getLatLng(res[0]).then((res2 => {
    //             latlong = res2
    //         })).catch((e) => { console.log(e) }).finally(() => {
    //             dispatch(getAnalytics(period, filterData, latlong))
    //         })
    //     }).catch(() => { })
    // }, [location])

    useEffect(() => {
        setAnalytics(state.analytics)
    }, [state.analytics])

    useEffect(() => {
        setIsLoading(state.isAnalyticsLoading)
    }, [state.isAnalyticsLoading])
    return (
        <>
            <Grid container spacing={2} marginBottom={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RevenueCard
                        decimal={2}
                        loading={isLoading}
                        primary="Sum Of Payments"
                        secondary={analytics?.totalTransactions ?? 0}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RevenueCard
                        decimal={2}
                        loading={isLoading}
                        primary="Sum Of Credit Lines"
                        secondary={analytics?.totalCreditLinesUsed ?? 0}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RevenueCard
                        loading={isLoading}
                        decimal={0}
                        primary="Number Of Credit Lines"
                        secondary={analytics?.numberOfCreditLinesUsed ?? 0}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={"rgb(41, 49, 79)"}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RevenueCard
                        decimal={0}
                        loading={isLoading}
                        primary="Number Of Transactions"
                        secondary={analytics?.numberOfTransactions ?? 0}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={'#ef5350'}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RevenueCard
                        loading={isLoading}
                        decimal={2}
                        primary="Sum Of Credit In Circulation"
                        secondary={analytics?.totalCreditInCirculation ?? 0}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={'#6AB187'}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <RevenueCard
                        loading={isLoading}
                        decimal={0}
                        primary="Total Of New Users"
                        secondary={analytics?.totalNewUsers ?? 0}
                        iconPrimary={AccountCircleTwoTone}
                        color={'#DBAE58'}
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={3}>
                    <RevenueCard
                        primary="Number of New Users"
                        secondary={analytics?.numberOfNewUsers ?? 0}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={theme.palette.secondary.main}
                    />
                    <EarningCard users={0}></EarningCard>
                </Grid> */}
            </Grid>
        </>
    )
}

export default AnalyticsCards