import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import heroImage from 'assets/images/landing/landing-hero.png';

// styles
const HeroWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #fef9f3 0%, #fdf4eb 50%, #f0f9fc 100%)',
  overflow: 'hidden',
  padding: '80px 0 100px',
  [theme.breakpoints.down('md')]: {
    padding: '60px 0 80px',
  },
}));

const HeroImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: '24px',
  boxShadow: '0 30px 80px rgba(22, 149, 200, 0.2)',
  [theme.breakpoints.down('md')]: {
    marginTop: '40px',
  },
}));

const GradientText = styled('span')({
  background: 'linear-gradient(135deg, #1695c8 0%, #1d90b5 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 24px rgba(22, 149, 200, 0.3)',
  '&:hover': {
    boxShadow: '0 12px 32px rgba(22, 149, 200, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderWidth: '2px',
  '&:hover': {
    borderWidth: '2px',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

// ==============================|| LANDING - HEADER PAGE ||============================== //

const HeaderPage = () => {
  const theme = useTheme();

  return (
    <HeroWrapper>
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 3,
                  color: '#1a1a2e',
                }}
              >
                Everyone has{' '}
                <GradientText>value</GradientText>
                <br />
                to share
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontWeight: 400,
                  lineHeight: 1.7,
                  mb: 4,
                  color: '#666',
                  maxWidth: '480px',
                }}
              >
                Join a trust-based community where your time and skills create real value. 
                Exchange services with neighbors without needing money.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <AnimateButton>
                  <StyledButton
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Get Started Free
                  </StyledButton>
                </AnimateButton>
                <AnimateButton>
                  <OutlineButton
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    color="primary"
                    size="large"
                  >
                    Sign In
                  </OutlineButton>
                </AnimateButton>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Free to join
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No money needed
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <HeroImage src={heroImage} alt="Community helping each other" />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </HeroWrapper>
  );
};

export default HeaderPage;
