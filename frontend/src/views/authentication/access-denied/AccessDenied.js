import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import { Box } from '@mui/system';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { IconAlertTriangle } from '@tabler/icons';

// assets

// ================================|| Unauthorized Access - Page ||================================ //

const AccessDenied = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const redirectYourApplication = () => {
        navigate(-2);
    }

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper style={{ maxWidth: "100%" }}>
                                <Grid container spacing={2}>
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="/">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <IconAlertTriangle color='red' size={42} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid item>
                                                <Stack spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Access Denied
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Your Application not approved so you do not have permission to view this page please contact admin.
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sx={{ mb: 3 }}>
                                        <Box sx={{ mt: 2 }}>
                                            <AnimateButton>
                                                <Button size="large" type="submit" variant="contained" color="secondary" onClick={redirectYourApplication}>
                                                    Go Back
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default AccessDenied;
