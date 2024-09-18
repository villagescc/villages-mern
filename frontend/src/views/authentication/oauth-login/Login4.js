import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import { useEffect, useState } from 'react';
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [applicationName, setApplicationName] = useState('');
    const theme = useTheme();
    const { verifyClient } = useAuth();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const checkedVerifyClient = async () => {
            await verifyClient(searchParams.get('clientSecret'), searchParams.get('secretKey')).then(
                (data) => {
                    setApplicationName(data.client.applicationName)
                },
                (err) => {
                    if (err.redirectUrl) {
                        navigate(err.redirectUrl)
                    }
                }
            )
        }
        checkedVerifyClient();
    }, [searchParams])

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 2 }}>
                                        <Link to="/">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'center'}
                                                        maxWidth={matchDownSM ? '100%' : '80%'}
                                                    >
                                                        Enter your credentials to connect Villages.io with <Typography component={'strong'} color={'secondary'} fontWeight={700}>{applicationName}</Typography>
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AuthLogin oAuth={true} />
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
