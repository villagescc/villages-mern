// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Container, Grid, Link, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YoutubeIcon from '@mui/icons-material/YouTube';
import GithubIcon from '@mui/icons-material/GitHub';

import logoDark from 'assets/images/logo-white.svg';
import logo from 'assets/images/pages/logo_grayscale.png';

// styles
const FooterWrapper = styled('div')(({ theme }) => ({
    padding: '35px 0',
    color: '#fff',
    background: theme.palette.mode === 'dark' ? theme.palette.dark.background : theme.palette.grey[300],
    [theme.breakpoints.down('md')]: {
        textAlign: 'center'
    }
}));

const FooterLink = styled(Link)({
    color: '#757575',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    opacity: '0.8',
    '& svg': {
        fontsize: '1.125rem',
        marginRight: 8
    },
    '&:hover': {
        opacity: '1',
        textDecoration: `underline`
    }
});

const FooterSubWrapper = styled('div')(({ theme }) => ({
    padding: '20px 0',
    color: '#fff',
    background: theme.palette.secondary.dark,
    [theme.breakpoints.down('md')]: {
        textAlign: 'center'
    }
}));

// ==============================|| LANDING - FOOTER PAGE ||============================== //

const FooterPage = () => {
    const theme = useTheme();
    return (
        <>
            <FooterWrapper>
                <Container>
                    <Grid container alignItems="center" spacing={gridSpacing}>
                        <Grid item xs={12} sm={3}>
                            <img src={logo} alt="Berry" width="100" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Grid container alignItems="center" spacing={2} sx={{ justifyContent: 'center' }}>
                                <Grid item>
                                    <FooterLink href="https://punarising.com/" target="_blank" underline="hover">
                                        Home
                                    </FooterLink>
                                </Grid>
                                <Grid item>
                                    <FooterLink href="/about/privacy" target="_blank" underline="hover">
                                        About Us
                                    </FooterLink>
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                alignItems="center"
                                spacing={2}
                                sx={{ justifyContent: 'space-between', marginTop: `3em`, fontSize: `0.75em` }}
                            >
                                <Grid item>
                                    <span style={{ color: `#757575` }}>© 2017 - Villages.io - brought to you by &nbsp;</span>

                                    <FooterLink href="/#" target="_blank" underline="hover">
                                        Puna Rising LLC
                                    </FooterLink>
                                </Grid>
                                <Grid item>
                                    <FooterLink href="/#how-it-works" target="_blank" underline="hover">
                                        Privacy Policy • Terms of Service
                                    </FooterLink>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Grid
                                container
                                alignItems="center"
                                spacing={2}
                                sx={{ justifyContent: 'flex-end', [theme.breakpoints.down('md')]: { justifyContent: 'center' } }}
                            >
                                <Grid item>
                                    <FooterLink href="https://instagram.com/villages.io/" target="_blank" underline="hover">
                                        <InstagramIcon />
                                    </FooterLink>
                                </Grid>
                                <Grid item>
                                    <FooterLink href="https://t.me/villagesio" target="_blank" underline="hover">
                                        <TelegramIcon />
                                    </FooterLink>
                                </Grid>
                                <Grid item>
                                    <FooterLink href="https://www.youtube.com/user/weboftrustnet/videos" target="_blank" underline="hover">
                                        <YoutubeIcon />
                                    </FooterLink>
                                </Grid>
                                <Grid item>
                                    <FooterLink href="https://github.com/villagescc/villagesio2.0" target="_blank" underline="hover">
                                        <GithubIcon />
                                    </FooterLink>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </FooterWrapper>
            {/* <FooterSubWrapper>
                <Container>
                    <Typography variant="subtitle2" component="div" color="inherit">
                        &#169; CodedThemes
                    </Typography>
                </Container>
            </FooterSubWrapper> */}
        </>
    );
};

export default FooterPage;
