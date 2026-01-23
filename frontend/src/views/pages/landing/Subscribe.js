// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// project imports
import FadeInWhenVisible from './Animation';
import AnimateButton from 'ui-component/extended/AnimateButton';

// Styled components
const CTAWrapper = styled('div')(({ theme }) => ({
  padding: '100px 0',
  background: 'linear-gradient(135deg, #1695c8 0%, #1d90b5 50%, #0d7a9e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '16px 40px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: '#fff',
  color: theme.palette.primary.main,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '16px 40px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderColor: 'rgba(255,255,255,0.5)',
  color: '#fff',
  borderWidth: '2px',
  '&:hover': {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: '2px',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

// ============================|| LANDING - CTA SECTION ||============================ //

const Subscribe = () => {
  const theme = useTheme();

  return (
    <CTAWrapper>
      <Container maxWidth="md">
        <FadeInWhenVisible>
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Ready to Join Your Village?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 5,
                fontWeight: 400,
                maxWidth: '550px',
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              Start building trust, sharing skills, and creating value 
              with your community today. It's free to join.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
              <AnimateButton>
                <StyledButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                >
                  Get Started Free
                </StyledButton>
              </AnimateButton>
              <AnimateButton>
                <OutlineButton
                  component={RouterLink}
                  to="/documentation/help"
                  variant="outlined"
                  size="large"
                >
                  Learn More
                </OutlineButton>
              </AnimateButton>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={4} sm={3}>
                <StatBox>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}
                  >
                    100%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    Free to use
                  </Typography>
                </StatBox>
              </Grid>
              <Grid item xs={4} sm={3}>
                <StatBox>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}
                  >
                    $0
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    No fees ever
                  </Typography>
                </StatBox>
              </Grid>
              <Grid item xs={4} sm={3}>
                <StatBox>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}
                  >
                    ∞
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    Possibilities
                  </Typography>
                </StatBox>
              </Grid>
            </Grid>
          </Box>
        </FadeInWhenVisible>
      </Container>
    </CTAWrapper>
  );
};

export default Subscribe;
