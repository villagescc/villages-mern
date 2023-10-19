import { Link } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

import imageBackground from 'assets/images/maintenance/img-error-bg.svg';
import imageDarkBackground from 'assets/images/maintenance/img-error-bg-dark.svg';
import imageBlue from 'assets/images/maintenance/img-error-blue.svg';
import imageText from 'assets/images/maintenance/img-error-text.svg';
import imagePurple from 'assets/images/maintenance/img-error-purple.svg';
import { IconKey } from '@tabler/icons';

// styles
const CardMediaWrapper = styled('div')({
    maxWidth: 720,
    margin: '0 auto',
    position: 'relative'
});

const ErrorWrapper = styled('div')({
    maxWidth: 350,
    margin: '0 auto',
    textAlign: 'center'
});

const ErrorCard = styled(Card)({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const CardMediaBlock = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '3s bounce ease-in-out infinite'
});

const CardMediaBlue = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '15s wings ease-in-out infinite'
});

const CardMediaPurple = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '12s wings ease-in-out infinite'
});

// ==============================|| ERROR PAGE ||============================== //

const AuthError = ({ path }) => {
    const theme = useTheme();

    return (
        <ErrorCard>
            <CardContent>
                <Grid container justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <ErrorWrapper>
                            <Grid container spacing={gridSpacing}>
                                {/* <Grid item xs={12}>
                                    <Typography variant="h1" component="div">
                                       You will need to login to view this post
                                    </Typography>
                                </Grid> */}
                                <Grid item xs={12}>
                                    <Typography variant="h4">
                                        You will need to login to view this post
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button variant="contained" size="large" component={Link} to={'/login'} sx={{ gap: "5px" }}>
                                            <IconKey stroke={1.5} size="24px" style={{ mr: 0.75 }} color={theme.palette.primary.light} />Login
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </ErrorWrapper>
                    </Grid>
                </Grid>
            </CardContent>
        </ErrorCard>
    );
};

export default AuthError;
