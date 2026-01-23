import { useTheme, styled } from '@mui/material/styles';

// material-ui
import { Container, Grid, Typography, Box, Paper } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';

// Styled components
const SectionWrapper = styled('div')(({ theme }) => ({
  padding: '80px 0',
  background: '#fff',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '20px',
  textAlign: 'center',
  height: '100%',
  border: '2px solid #e8f4f8',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 12px 40px rgba(22, 149, 200, 0.12)',
    transform: 'translateY(-4px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #e8f4f8 0%, #d0eaf2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
}));

// ==============================|| LANDING - HOURS SECTION ||============================== //

const Hours = () => {
  const theme = useTheme();

  const features = [
    {
      icon: '⏱',
      title: 'Stable Value',
      description: "A sustainable hour's wage is different in every community, but it always remains a stable measure of value. From this base, members negotiate fair prices for their products and services.",
    },
    {
      icon: '🌍',
      title: 'Universal System',
      description: 'This is an effective complementary currency system that can be used anywhere in the world. What is a sustainable wage in your community? Start exchanging value today.',
    },
    {
      icon: '🤝',
      title: 'Trust-Based',
      description: 'Unlike traditional currencies, Villages hours are backed by real relationships and trust. Every transaction strengthens your community and builds lasting connections.',
    },
  ];

  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <FadeInWhenVisible>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 2,
                mb: 1,
                display: 'block',
              }}
            >
              OUR CURRENCY
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1a1a2e',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Villages Hours
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: '1.1rem',
                lineHeight: 1.7,
              }}
            >
              Backed by a sustainable hour's wage in your community — 
              real value, not speculation
            </Typography>
          </FadeInWhenVisible>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FadeInWhenVisible>
                <FeatureCard>
                  <IconWrapper>
                    <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
                      {feature.icon}
                    </Typography>
                  </IconWrapper>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: '#1a1a2e',
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#666',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </FadeInWhenVisible>
            </Grid>
          ))}
        </Grid>
      </Container>
    </SectionWrapper>
  );
};

export default Hours;
