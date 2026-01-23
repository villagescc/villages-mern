// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Container, Grid, Link, Typography, Box, IconButton } from '@mui/material';

// assets
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';

import logo from 'assets/images/pages/logo_grayscale.png';

// styles
const FooterWrapper = styled('div')(({ theme }) => ({
  padding: '60px 0 40px',
  background: '#1a1a2e',
  color: '#fff',
}));

const FooterLink = styled(Link)({
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: '#fff',
  },
});

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: 'rgba(255,255,255,0.7)',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
}));

const Divider = styled('div')({
  height: '1px',
  background: 'rgba(255,255,255,0.1)',
  margin: '40px 0 30px',
});

// ==============================|| LANDING - FOOTER PAGE ||============================== //

const FooterPage = () => {
  const theme = useTheme();

  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <img src={logo} alt="Villages" width="120" style={{ opacity: 0.9 }} />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 280 }}
            >
              A trust-based community currency where everyone has value to share.
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ color: '#fff', fontWeight: 600, mb: 2 }}
            >
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FooterLink href="/documentation/help">How it Works</FooterLink>
              <FooterLink href="/register">Get Started</FooterLink>
              <FooterLink href="/login">Sign In</FooterLink>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle2"
              sx={{ color: '#fff', fontWeight: 600, mb: 2 }}
            >
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FooterLink href="/documentation/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/documentation/privacy">Terms of Service</FooterLink>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              sx={{ color: '#fff', fontWeight: 600, mb: 2 }}
            >
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <SocialButton
                href="https://instagram.com/villages.io/"
                target="_blank"
                component="a"
              >
                <InstagramIcon />
              </SocialButton>
              <SocialButton
                href="https://t.me/villagesio"
                target="_blank"
                component="a"
              >
                <TelegramIcon />
              </SocialButton>
              <SocialButton
                href="https://www.youtube.com/user/weboftrustnet/videos"
                target="_blank"
                component="a"
              >
                <YouTubeIcon />
              </SocialButton>
              <SocialButton
                href="https://github.com/villagescc/villagesio2.0"
                target="_blank"
                component="a"
              >
                <GitHubIcon />
              </SocialButton>
            </Box>
          </Grid>
        </Grid>

        <Divider />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)' }}
            >
              © {new Date().getFullYear()} Villages.io — brought to you by Puna Rising LLC
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Building trust-based communities worldwide
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </FooterWrapper>
  );
};

export default FooterPage;
